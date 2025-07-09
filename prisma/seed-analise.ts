import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populando banco com dados de teste...');

  // Criar usuário demo
  const user = await prisma.user.upsert({
    where: { email: 'demo@tributa.ai' },
    update: {},
    create: {
      id: 'user-demo',
      email: 'demo@tributa.ai',
      name: 'Usuário Demo',
      role: 'USER',
    },
  });

  console.log('✅ Usuário demo criado:', user.email);

  // Criar análise de obrigações
  const analise = await prisma.analiseObrigacoes.upsert({
    where: { 
      id: 'analise-demo-001' 
    },
    update: {},
    create: {
      id: 'analise-demo-001',
      cnpjEmpresa: '12345678000190',
      razaoSocialEmpresa: 'Empresa Demo LTDA',
      nomeFantasiaEmpresa: 'Demo Tech',
      regimeTributario: 'Simples Nacional',
      statusAnalise: 'CONCLUIDO',
      dataInicioAnalise: new Date('2024-01-01'),
      dataConclusaoAnalise: new Date('2024-01-02'),
      totalDocumentos: 3,
      totalItensProcessados: 15,
      totalReceitasSegregadas: 202500,
      valorTotalCreditos: 202500,
      criadoPorId: 'user-demo',
    },
  });

  console.log('✅ Análise de obrigações criada:', analise.id);

  // Criar créditos identificados
  const creditos = [
    {
      id: 'credito-001',
      analiseObrigacoesId: 'analise-demo-001',
      tipo: 'PIS/COFINS',
      descricao: 'Crédito de energia elétrica industrial',
      valorNominal: 89500.00,
      valorAtual: 89500.00,
      valorEconomia: 8950.00,
      periodoInicio: new Date('2023-01-01'),
      periodoFim: new Date('2023-12-31'),
      tribunalOrigem: 'Receita Federal',
      numeroProcesso: 'RF-2023-001',
      baseCalculoDetalhada: JSON.stringify({
        aliquota: 0.1,
        baseCalculo: 895000,
        detalhes: 'Energia elétrica consumida no processo industrial'
      }),
      statusCredito: 'IDENTIFICADO',
      podeCompensar: true,
    },
    {
      id: 'credito-002',
      analiseObrigacoesId: 'analise-demo-001',
      tipo: 'ICMS',
      descricao: 'Diferencial de alíquota ICMS',
      valorNominal: 45200.00,
      valorAtual: 45200.00,
      valorEconomia: 4520.00,
      periodoInicio: new Date('2023-01-01'),
      periodoFim: new Date('2023-12-31'),
      tribunalOrigem: 'SEFAZ-SP',
      numeroProcesso: 'ICMS-2023-002',
      baseCalculoDetalhada: JSON.stringify({
        aliquota: 0.18,
        baseCalculo: 251111,
        detalhes: 'Diferencial de alíquota em operações interestaduais'
      }),
      statusCredito: 'IDENTIFICADO',
      podeCompensar: true,
    },
    {
      id: 'credito-003',
      analiseObrigacoesId: 'analise-demo-001',
      tipo: 'IRPJ/CSLL',
      descricao: 'Pagamento indevido de impostos federais',
      valorNominal: 67800.00,
      valorAtual: 67800.00,
      valorEconomia: 6780.00,
      periodoInicio: new Date('2022-01-01'),
      periodoFim: new Date('2022-12-31'),
      tribunalOrigem: 'Receita Federal',
      numeroProcesso: 'IRPJ-2022-003',
      baseCalculoDetalhada: JSON.stringify({
        aliquota: 0.25,
        baseCalculo: 271200,
        detalhes: 'Pagamento a maior em apuração anual'
      }),
      statusCredito: 'IDENTIFICADO',
      podeCompensar: true,
    },
  ];

  for (const credito of creditos) {
    await prisma.creditoIdentificado.upsert({
      where: { id: credito.id },
      update: {},
      create: credito,
    });
  }

  console.log('✅ Créditos identificados criados:', creditos.length);

  // Criar documentos de análise
  const documentos = [
    {
      id: 'doc-001',
      analiseObrigacoesId: 'analise-demo-001',
      nomeArquivo: 'DCTF_2023.xml',
      tipoDocumento: 'DCTF',
      tamanhoBytes: 1024000,
      hashArquivo: 'hash123',
      caminhoArmazenamento: '/storage/dctf_2023.xml',
      statusProcessamento: 'CONCLUIDO',
      dataProcessamento: new Date('2024-01-01'),
      itensEncontrados: 5,
      creditosIdentificados: 1,
      valorTotalEncontrado: 89500,
    },
    {
      id: 'doc-002',
      analiseObrigacoesId: 'analise-demo-001',
      nomeArquivo: 'EFD_Contribuicoes_2023.txt',
      tipoDocumento: 'EFD',
      tamanhoBytes: 2048000,
      hashArquivo: 'hash456',
      caminhoArmazenamento: '/storage/efd_2023.txt',
      statusProcessamento: 'CONCLUIDO',
      dataProcessamento: new Date('2024-01-01'),
      itensEncontrados: 8,
      creditosIdentificados: 2,
      valorTotalEncontrado: 113000,
    },
    {
      id: 'doc-003',
      analiseObrigacoesId: 'analise-demo-001',
      nomeArquivo: 'PGDAS_2023.pdf',
      tipoDocumento: 'PGDAS',
      tamanhoBytes: 512000,
      hashArquivo: 'hash789',
      caminhoArmazenamento: '/storage/pgdas_2023.pdf',
      statusProcessamento: 'CONCLUIDO',
      dataProcessamento: new Date('2024-01-01'),
      itensEncontrados: 2,
      creditosIdentificados: 0,
      valorTotalEncontrado: 0,
    },
  ];

  for (const documento of documentos) {
    await prisma.documentoAnalise.upsert({
      where: { id: documento.id },
      update: {},
      create: documento,
    });
  }

  console.log('✅ Documentos de análise criados:', documentos.length);

  // Criar mais uma análise para demonstrar histórico
  const analise2 = await prisma.analiseObrigacoes.upsert({
    where: { 
      id: 'analise-demo-002' 
    },
    update: {},
    create: {
      id: 'analise-demo-002',
      cnpjEmpresa: '98765432000101',
      razaoSocialEmpresa: 'Indústria Exemplo S.A.',
      nomeFantasiaEmpresa: 'Exemplo Industrial',
      regimeTributario: 'Lucro Real',
      statusAnalise: 'CONCLUIDO',
      dataInicioAnalise: new Date('2023-12-01'),
      dataConclusaoAnalise: new Date('2023-12-02'),
      totalDocumentos: 5,
      totalItensProcessados: 25,
      totalReceitasSegregadas: 456000,
      valorTotalCreditos: 456000,
      criadoPorId: 'user-demo',
    },
  });

  console.log('✅ Segunda análise criada:', analise2.id);

  // Criar créditos para segunda análise
  const creditos2 = [
    {
      id: 'credito-004',
      analiseObrigacoesId: 'analise-demo-002',
      tipo: 'ICMS',
      descricao: 'Crédito de ativo imobilizado',
      valorNominal: 156000.00,
      valorAtual: 156000.00,
      valorEconomia: 15600.00,
      periodoInicio: new Date('2023-01-01'),
      periodoFim: new Date('2023-12-31'),
      tribunalOrigem: 'SEFAZ-RJ',
      numeroProcesso: 'ICMS-2023-004',
      baseCalculoDetalhada: JSON.stringify({
        aliquota: 0.18,
        baseCalculo: 866667,
        detalhes: 'Crédito sobre aquisição de máquinas e equipamentos'
      }),
      statusCredito: 'IDENTIFICADO',
      podeCompensar: true,
    },
    {
      id: 'credito-005',
      analiseObrigacoesId: 'analise-demo-002',
      tipo: 'PIS/COFINS',
      descricao: 'Crédito sobre insumos industriais',
      valorNominal: 300000.00,
      valorAtual: 300000.00,
      valorEconomia: 30000.00,
      periodoInicio: new Date('2023-01-01'),
      periodoFim: new Date('2023-12-31'),
      tribunalOrigem: 'Receita Federal',
      numeroProcesso: 'PIS-COFINS-2023-005',
      baseCalculoDetalhada: JSON.stringify({
        aliquota: 0.0925,
        baseCalculo: 3243243,
        detalhes: 'Crédito sobre insumos utilizados na industrialização'
      }),
      statusCredito: 'PROCESSANDO',
      podeCompensar: false,
    },
  ];

  for (const credito of creditos2) {
    await prisma.creditoIdentificado.upsert({
      where: { id: credito.id },
      update: {},
      create: credito,
    });
  }

  console.log('✅ Créditos da segunda análise criados:', creditos2.length);

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 