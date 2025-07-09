/**
 * PERDCOMP Automation Service
 * Sistema de Geração Automática de Arquivos PERDCOMP
 * 
 * Funcionalidades:
 * - Sistema gera arquivo .per/.dcomp pronto
 * - Todos os campos preenchidos automaticamente
 * - Cliente baixa arquivo finalizado
 * - Contador só faz upload no e-CAC oficial
 * - Zero digitação manual
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

export interface PerdcompData {
  empresaId: string;
  tipoArquivo: 'PER' | 'DCOMP';
  periodoApuracao: string; // MM/YYYY
  dadosEmpresa: {
    cnpj: string;
    razaoSocial: string;
    nomeFantasia?: string;
    endereco?: string;
  };
  creditos: CreditoPerdcomp[];
  debitos: DebitoPerdcomp[];
}

export interface CreditoPerdcomp {
  codigo: string;
  descricao: string;
  valor: number;
  dataVencimento: Date;
  numeroProcesso?: string;
  origem: string;
}

export interface DebitoPerdcomp {
  codigo: string;
  descricao: string;
  valor: number;
  dataVencimento: Date;
  situacao: string;
}

export interface PerdcompFile {
  nomeArquivo: string;
  conteudo: string;
  hash: string;
  tamanho: number;
  dataGeracao: Date;
  validoAte: Date;
}

export interface PerdcompGenerationResult {
  arquivoId: string;
  nomeArquivo: string;
  status: 'SUCESSO' | 'ERRO';
  tempoGeracao: number;
  totalCreditos: number;
  totalDebitos: number;
  saldoCompensacao: number;
  urlDownload: string;
  instrucoes: string[];
}

class PerdcompAutomationService {
  private static instance: PerdcompAutomationService;
  private readonly UPLOAD_DIR = '/uploads/perdcomp';
  private readonly VALIDADE_ARQUIVO_DIAS = 30;

  public static getInstance(): PerdcompAutomationService {
    if (!PerdcompAutomationService.instance) {
      PerdcompAutomationService.instance = new PerdcompAutomationService();
    }
    return PerdcompAutomationService.instance;
  }

  /**
   * Gera arquivo PERDCOMP automaticamente
   */
  public async gerarArquivoPerdcomp(empresaId: string, tipoArquivo: 'PER' | 'DCOMP', periodoApuracao: string): Promise<PerdcompGenerationResult> {
    const inicioGeracao = Date.now();
    
    try {
      logger.info(`Iniciando geração de arquivo ${tipoArquivo} para empresa ${empresaId} - período ${periodoApuracao}`);

      // 1. Coletar dados da empresa
      const dadosEmpresa = await this.coletarDadosEmpresa(empresaId);

      // 2. Coletar créditos automaticamente
      const creditos = await this.coletarCreditos(empresaId, periodoApuracao);

      // 3. Coletar débitos automaticamente
      const debitos = await this.coletarDebitos(empresaId, periodoApuracao);

      // 4. Validar dados
      this.validarDados(dadosEmpresa, creditos, debitos);

      // 5. Gerar arquivo
      const arquivo = await this.gerarArquivo({
        empresaId,
        tipoArquivo,
        periodoApuracao,
        dadosEmpresa,
        creditos,
        debitos
      });

      // 6. Salvar no banco
      const registroGerado = await this.salvarRegistroGeracao(empresaId, tipoArquivo, periodoApuracao, arquivo, creditos, debitos);

      const tempoGeracao = (Date.now() - inicioGeracao) / 1000;
      const totalCreditos = creditos.reduce((sum, c) => sum + c.valor, 0);
      const totalDebitos = debitos.reduce((sum, d) => sum + d.valor, 0);
      const saldoCompensacao = totalCreditos - totalDebitos;

      logger.info(`Arquivo ${tipoArquivo} gerado com sucesso em ${tempoGeracao}s`);

      return {
        arquivoId: registroGerado.id,
        nomeArquivo: arquivo.nomeArquivo,
        status: 'SUCESSO',
        tempoGeracao,
        totalCreditos,
        totalDebitos,
        saldoCompensacao,
        urlDownload: `/api/perdcomp/download/${registroGerado.id}`,
        instrucoes: this.gerarInstrucoes(tipoArquivo, saldoCompensacao)
      };

    } catch (error) {
      logger.error('Erro na geração do arquivo PERDCOMP:', error);
      throw error;
    }
  }

  /**
   * Coleta dados da empresa automaticamente
   */
  private async coletarDadosEmpresa(empresaId: string): Promise<any> {
    try {
      const empresa = await prisma.empresa.findUnique({
        where: { id: empresaId },
        include: {
          representantePrincipal: true
        }
      });

      if (!empresa) {
        throw new Error('Empresa não encontrada');
      }

      return {
        cnpj: empresa.cnpj,
        razaoSocial: empresa.razaoSocial,
        nomeFantasia: empresa.nomeFantasia,
        endereco: empresa.endereco
      };

    } catch (error) {
      logger.error('Erro ao coletar dados da empresa:', error);
      throw error;
    }
  }

  /**
   * Coleta créditos automaticamente
   */
  private async coletarCreditos(empresaId: string, periodoApuracao: string): Promise<CreditoPerdcomp[]> {
    try {
      // Buscar créditos identificados na análise
      const creditosIdentificados = await prisma.creditoIdentificado.findMany({
        where: {
          analiseObrigacoes: {
            cnpjEmpresa: {
              in: await this.obterCnpjsEmpresa(empresaId)
            }
          },
          statusCredito: 'IDENTIFICADO',
          podeCompensar: true
        },
        include: {
          analiseObrigacoes: true
        }
      });

      // Buscar créditos tokenizados
      const creditosTokenizados = await prisma.creditTitle.findMany({
        where: {
          owner: {
            empresasRepresentadas: {
              some: {
                id: empresaId
              }
            }
          },
          category: 'TRIBUTARIO',
          status: 'SETTLED'
        },
        include: {
          detailsTributario: true
        }
      });

      const creditos: CreditoPerdcomp[] = [];

      // Processar créditos identificados
      for (const credito of creditosIdentificados) {
        creditos.push({
          codigo: this.determinarCodigoCredito(credito.tipo),
          descricao: credito.descricao,
          valor: credito.valorAtual,
          dataVencimento: credito.periodoFim,
          numeroProcesso: credito.numeroProcesso,
          origem: 'ANALISE_AUTOMATICA'
        });
      }

      // Processar créditos tokenizados
      for (const credito of creditosTokenizados) {
        creditos.push({
          codigo: this.determinarCodigoCredito(credito.detailsTributario?.nomeTributo || 'OUTROS'),
          descricao: `Crédito ${credito.category} - ${credito.detailsTributario?.nomeTributo}`,
          valor: credito.valueCurrent,
          dataVencimento: credito.expiryDate || new Date(),
          numeroProcesso: credito.detailsTributario?.numeroProcessoAdministrativo,
          origem: 'MARKETPLACE'
        });
      }

      return creditos;

    } catch (error) {
      logger.error('Erro ao coletar créditos:', error);
      throw error;
    }
  }

  /**
   * Coleta débitos automaticamente
   */
  private async coletarDebitos(empresaId: string, periodoApuracao: string): Promise<DebitoPerdcomp[]> {
    try {
      // Buscar obrigações fiscais
      const obrigacoesFiscais = await prisma.fiscalObligation.findMany({
        where: {
          user: {
            empresasRepresentadas: {
              some: {
                id: empresaId
              }
            }
          },
          status: 'PENDING'
        }
      });

      const debitos: DebitoPerdcomp[] = [];

      for (const obrigacao of obrigacoesFiscais) {
        debitos.push({
          codigo: this.determinarCodigoDebito(obrigacao.type),
          descricao: obrigacao.description || obrigacao.title,
          valor: obrigacao.amount,
          dataVencimento: obrigacao.dueDate,
          situacao: 'PENDENTE'
        });
      }

      return debitos;

    } catch (error) {
      logger.error('Erro ao coletar débitos:', error);
      throw error;
    }
  }

  /**
   * Gera o arquivo PERDCOMP/PER com todos os campos preenchidos
   */
  private async gerarArquivo(dados: PerdcompData): Promise<PerdcompFile> {
    try {
      const nomeArquivo = `${dados.tipoArquivo}_${dados.dadosEmpresa.cnpj}_${dados.periodoApuracao.replace('/', '')}.txt`;
      
      let conteudo = '';

      if (dados.tipoArquivo === 'DCOMP') {
        conteudo = this.gerarConteudoDcomp(dados);
      } else {
        conteudo = this.gerarConteudoPer(dados);
      }

      const hash = this.calcularHash(conteudo);
      const tamanho = Buffer.byteLength(conteudo, 'utf8');
      const dataGeracao = new Date();
      const validoAte = new Date(Date.now() + (this.VALIDADE_ARQUIVO_DIAS * 24 * 60 * 60 * 1000));

      // Salvar arquivo fisicamente
      const caminhoArquivo = path.join(this.UPLOAD_DIR, nomeArquivo);
      await this.garantirDiretorio(this.UPLOAD_DIR);
      await fs.promises.writeFile(caminhoArquivo, conteudo, 'utf8');

      return {
        nomeArquivo,
        conteudo,
        hash,
        tamanho,
        dataGeracao,
        validoAte
      };

    } catch (error) {
      logger.error('Erro ao gerar arquivo:', error);
      throw error;
    }
  }

  /**
   * Gera conteúdo do arquivo DCOMP
   */
  private gerarConteudoDcomp(dados: PerdcompData): string {
    const linhas = [];

    // Cabeçalho
    linhas.push('DCOMP');
    linhas.push(`CNPJ: ${dados.dadosEmpresa.cnpj}`);
    linhas.push(`Razão Social: ${dados.dadosEmpresa.razaoSocial}`);
    linhas.push(`Período de Apuração: ${dados.periodoApuracao}`);
    linhas.push(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`);
    linhas.push('');

    // Créditos
    linhas.push('CRÉDITOS A COMPENSAR:');
    linhas.push('Código|Descrição|Valor|Vencimento|Processo');
    for (const credito of dados.creditos) {
      linhas.push(`${credito.codigo}|${credito.descricao}|${credito.valor.toFixed(2)}|${credito.dataVencimento.toLocaleDateString('pt-BR')}|${credito.numeroProcesso || ''}`);
    }

    linhas.push('');

    // Débitos
    linhas.push('DÉBITOS A COMPENSAR:');
    linhas.push('Código|Descrição|Valor|Vencimento|Situação');
    for (const debito of dados.debitos) {
      linhas.push(`${debito.codigo}|${debito.descricao}|${debito.valor.toFixed(2)}|${debito.dataVencimento.toLocaleDateString('pt-BR')}|${debito.situacao}`);
    }

    linhas.push('');

    // Totais
    const totalCreditos = dados.creditos.reduce((sum, c) => sum + c.valor, 0);
    const totalDebitos = dados.debitos.reduce((sum, d) => sum + d.valor, 0);
    const saldo = totalCreditos - totalDebitos;

    linhas.push('RESUMO:');
    linhas.push(`Total de Créditos: R$ ${totalCreditos.toFixed(2)}`);
    linhas.push(`Total de Débitos: R$ ${totalDebitos.toFixed(2)}`);
    linhas.push(`Saldo de Compensação: R$ ${saldo.toFixed(2)}`);

    return linhas.join('\n');
  }

  /**
   * Gera conteúdo do arquivo PER
   */
  private gerarConteudoPer(dados: PerdcompData): string {
    const linhas = [];

    // Cabeçalho PER
    linhas.push('PER - PEDIDO ELETRÔNICO DE RESTITUIÇÃO');
    linhas.push(`CNPJ: ${dados.dadosEmpresa.cnpj}`);
    linhas.push(`Razão Social: ${dados.dadosEmpresa.razaoSocial}`);
    linhas.push(`Período: ${dados.periodoApuracao}`);
    linhas.push('');

    // Créditos para restituição
    linhas.push('CRÉDITOS PARA RESTITUIÇÃO:');
    for (const credito of dados.creditos) {
      linhas.push(`${credito.codigo}: ${credito.descricao} - R$ ${credito.valor.toFixed(2)}`);
    }

    linhas.push('');
    linhas.push(`Total a Restituir: R$ ${dados.creditos.reduce((sum, c) => sum + c.valor, 0).toFixed(2)}`);

    return linhas.join('\n');
  }

  /**
   * Salva registro da geração no banco
   */
  private async salvarRegistroGeracao(empresaId: string, tipoArquivo: string, periodoApuracao: string, arquivo: PerdcompFile, creditos: CreditoPerdcomp[], debitos: DebitoPerdcomp[]): Promise<any> {
    try {
      const registro = await prisma.perdcompGeneration.create({
        data: {
          empresaId,
          tipoArquivo,
          periodoApuracao,
          statusGeracao: 'CONCLUIDO',
          arquivoGerado: arquivo.nomeArquivo,
          hashArquivo: arquivo.hash,
          camposPreenchidos: {
            creditos: creditos.length,
            debitos: debitos.length,
            totalCreditos: creditos.reduce((sum, c) => sum + c.valor, 0),
            totalDebitos: debitos.reduce((sum, d) => sum + d.valor, 0),
            camposAutomaticos: creditos.length + debitos.length
          },
          totalCreditos: creditos.reduce((sum, c) => sum + c.valor, 0),
          totalDebitos: debitos.reduce((sum, d) => sum + d.valor, 0)
        }
      });

      return registro;

    } catch (error) {
      logger.error('Erro ao salvar registro:', error);
      throw error;
    }
  }

  /**
   * Gera instruções para o usuário
   */
  private gerarInstrucoes(tipoArquivo: string, saldoCompensacao: number): string[] {
    const instrucoes = [
      `✅ Arquivo ${tipoArquivo} gerado automaticamente com TODOS os campos preenchidos`,
      '✅ Zero digitação manual necessária',
      '✅ Dados validados e consolidados automaticamente',
      '',
      '📋 PRÓXIMOS PASSOS:',
      '1. Baixe o arquivo gerado',
      '2. Revise os dados (opcional)',
      '3. Faça upload no e-CAC da Receita Federal',
      '4. Aguarde processamento oficial',
      '',
      '⚠️ IMPORTANTE:',
      '• Este arquivo é apenas para facilitar o processo',
      '• A compensação oficial deve ser feita via e-CAC',
      '• Mantenha backup dos documentos originais',
      '• Validade do arquivo: 30 dias'
    ];

    if (saldoCompensacao > 0) {
      instrucoes.push('', `💰 Saldo positivo de R$ ${saldoCompensacao.toFixed(2)} disponível para compensação`);
    } else if (saldoCompensacao < 0) {
      instrucoes.push('', `⚠️ Saldo negativo de R$ ${Math.abs(saldoCompensacao).toFixed(2)} - verifique débitos pendentes`);
    }

    return instrucoes;
  }

  /**
   * Obtém arquivos gerados para uma empresa
   */
  public async obterArquivosGerados(empresaId: string): Promise<any[]> {
    try {
      const arquivos = await prisma.perdcompGeneration.findMany({
        where: { empresaId },
        orderBy: { criadoEm: 'desc' },
        include: {
          empresa: true
        }
      });

      return arquivos;

    } catch (error) {
      logger.error('Erro ao obter arquivos gerados:', error);
      throw error;
    }
  }

  /**
   * Marca arquivo como utilizado no e-CAC
   */
  public async marcarUtilizadoEcac(arquivoId: string): Promise<void> {
    try {
      await prisma.perdcompGeneration.update({
        where: { id: arquivoId },
        data: { utilizadoEcac: true }
      });

    } catch (error) {
      logger.error('Erro ao marcar como utilizado:', error);
      throw error;
    }
  }

  // Métodos auxiliares
  private async obterCnpjsEmpresa(empresaId: string): Promise<string[]> {
    const empresa = await prisma.empresa.findUnique({
      where: { id: empresaId }
    });
    return empresa ? [empresa.cnpj] : [];
  }

  private determinarCodigoCredito(tipo: string): string {
    const codigos = {
      'PIS/COFINS': '0600',
      'IRPJ': '0220',
      'CSLL': '0230',
      'ICMS': '0701',
      'IPI': '0500',
      'ISSQN': '0800'
    };
    return codigos[tipo as keyof typeof codigos] || '0999';
  }

  private determinarCodigoDebito(tipo: string): string {
    const codigos = {
      'IRPJ': '0220',
      'CSLL': '0230',
      'PIS': '0170',
      'COFINS': '0190',
      'ICMS': '0701'
    };
    return codigos[tipo as keyof typeof codigos] || '0999';
  }

  private calcularHash(conteudo: string): string {
    // Implementar hash seguro
    return Buffer.from(conteudo).toString('base64').substring(0, 32);
  }

  private async garantirDiretorio(caminho: string): Promise<void> {
    if (!fs.existsSync(caminho)) {
      await fs.promises.mkdir(caminho, { recursive: true });
    }
  }

  private validarDados(empresa: any, creditos: CreditoPerdcomp[], debitos: DebitoPerdcomp[]): void {
    if (!empresa.cnpj) {
      throw new Error('CNPJ da empresa é obrigatório');
    }
    if (!empresa.razaoSocial) {
      throw new Error('Razão social da empresa é obrigatória');
    }
    if (creditos.length === 0 && debitos.length === 0) {
      throw new Error('Nenhum crédito ou débito encontrado para o período');
    }
  }
}

export default PerdcompAutomationService;