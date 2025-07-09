import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { integracoesGovernamentais } from '@/services/integracoes-governamentais';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  TrendingUp, 
  MapPin, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Info
} from 'lucide-react';

interface ApiStatus {
  servico: string;
  status: 'online' | 'offline' | 'degraded';
  tempoResposta?: number;
  erro?: string;
}

export function GovernmentAPIIntegrationReal() {
  const [activeTab, setActiveTab] = useState('cnpj');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus[]>([]);

  // Estados dos formulários
  const [cnpjInput, setCnpjInput] = useState('');
  const [cepInput, setCepInput] = useState('');
  const [nfeInput, setNfeInput] = useState('');

  const consultarCNPJ = async () => {
    if (!cnpjInput) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await integracoesGovernamentais.consultarEmpresaCompleta(cnpjInput);
      setResults(resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const consultarCEP = async () => {
    if (!cepInput) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const dadosCEP = await integracoesGovernamentais.cep.consultarCEP(cepInput);
      
      // Buscar informações do município
      let municipio = null;
      if (dadosCEP.ibge) {
        try {
          municipio = await integracoesGovernamentais.ibge.obterMunicipioPorCodigo(dadosCEP.ibge);
        } catch (e) {
          console.warn('Erro ao buscar município:', e);
        }
      }
      
      setResults({ cep: dadosCEP, municipio });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const consultarNFe = async () => {
    if (!nfeInput) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const validacao = integracoesGovernamentais.nfe.validarChaveAcesso(nfeInput);
      const urlConsulta = validacao.valida 
        ? integracoesGovernamentais.nfe.gerarURLConsultaPublica(nfeInput)
        : null;
      const informacoes = validacao.valida
        ? integracoesGovernamentais.nfe.extrairInformacoesChave(nfeInput)
        : null;
      
      setResults({ validacao, urlConsulta, informacoes });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const consultarIndicesEconomicos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const dashboard = await integracoesGovernamentais.obterDashboardEconomico();
      setResults(dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const verificarStatusAPIs = async () => {
    setLoading(true);
    
    try {
      const status = await integracoesGovernamentais.verificarStatusAPIs();
      setApiStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao verificar status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Integrações Governamentais Reais
          </CardTitle>
          <CardDescription>
            Consultas utilizando APIs oficiais e públicas dos órgãos governamentais brasileiros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={verificarStatusAPIs}
              disabled={loading}
            >
              <Info className="h-4 w-4 mr-1" />
              Verificar Status das APIs
            </Button>
          </div>

          {apiStatus.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Status das APIs Governamentais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {apiStatus.map((api, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(api.status)}
                      <span className="text-sm font-medium">{api.servico}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={getStatusColor(api.status)}>
                        {api.status}
                      </Badge>
                      {api.tempoResposta && (
                        <span className="text-xs text-gray-500">
                          {api.tempoResposta}ms
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="cnpj">CNPJ</TabsTrigger>
              <TabsTrigger value="cep">CEP</TabsTrigger>
              <TabsTrigger value="nfe">NFe</TabsTrigger>
              <TabsTrigger value="indices">Índices</TabsTrigger>
            </TabsList>

            <TabsContent value="cnpj" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o CNPJ (ex: 11.222.333/0001-81)"
                  value={cnpjInput}
                  onChange={(e) => setCnpjInput(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={consultarCNPJ} disabled={loading}>
                  {loading ? 'Consultando...' : 'Consultar'}
                </Button>
              </div>

              {results?.dadosBasicos && (
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Dados obtidos da Receita Federal através de APIs públicas oficiais
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Dados Básicos</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <strong>CNPJ:</strong> {results.dadosBasicos.cnpj}
                        </div>
                        <div>
                          <strong>Razão Social:</strong> {results.dadosBasicos.razaoSocial}
                        </div>
                        {results.dadosBasicos.nomeFantasia && (
                          <div>
                            <strong>Nome Fantasia:</strong> {results.dadosBasicos.nomeFantasia}
                          </div>
                        )}
                        <div>
                          <strong>Situação:</strong> 
                          <Badge className={results.dadosBasicos.situacaoCadastral === 'ATIVA' ? 'bg-green-100 text-green-800 ml-2' : 'bg-red-100 text-red-800 ml-2'}>
                            {results.dadosBasicos.situacaoCadastral}
                          </Badge>
                        </div>
                        <div>
                          <strong>Data de Abertura:</strong> {results.dadosBasicos.dataAbertura}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Regime Tributário</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <strong>Regime:</strong> {results.regimeTributario?.regime}
                        </div>
                        <div>
                          <strong>Simples Nacional:</strong> 
                          <Badge className={results.regimeTributario?.simplesNacional ? 'bg-blue-100 text-blue-800 ml-2' : 'bg-gray-100 text-gray-800 ml-2'}>
                            {results.regimeTributario?.simplesNacional ? 'Sim' : 'Não'}
                          </Badge>
                        </div>
                        <div>
                          <strong>MEI:</strong> 
                          <Badge className={results.regimeTributario?.mei ? 'bg-purple-100 text-purple-800 ml-2' : 'bg-gray-100 text-gray-800 ml-2'}>
                            {results.regimeTributario?.mei ? 'Sim' : 'Não'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {results.enderecoCompleto && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Endereço Completo</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <strong>CEP:</strong> {results.enderecoCompleto.cep}
                          </div>
                          <div>
                            <strong>Logradouro:</strong> {results.enderecoCompleto.logradouro}
                          </div>
                          <div>
                            <strong>Bairro:</strong> {results.enderecoCompleto.bairro}
                          </div>
                          <div>
                            <strong>Cidade:</strong> {results.enderecoCompleto.localidade}
                          </div>
                          <div>
                            <strong>UF:</strong> {results.enderecoCompleto.uf}
                          </div>
                          {results.enderecoCompleto.ddd && (
                            <div>
                              <strong>DDD:</strong> {results.enderecoCompleto.ddd}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="cep" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o CEP (ex: 01310-100)"
                  value={cepInput}
                  onChange={(e) => setCepInput(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={consultarCEP} disabled={loading}>
                  {loading ? 'Consultando...' : 'Consultar'}
                </Button>
              </div>

              {results?.cep && (
                <div className="space-y-4">
                  <Alert>
                    <MapPin className="h-4 w-4" />
                    <AlertDescription>
                      Dados obtidos via ViaCEP e complementados com informações do IBGE
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardHeader>
                      <CardTitle>Informações do CEP</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <strong>CEP:</strong> {results.cep.cep}
                        </div>
                        <div>
                          <strong>Logradouro:</strong> {results.cep.logradouro}
                        </div>
                        <div>
                          <strong>Bairro:</strong> {results.cep.bairro}
                        </div>
                        <div>
                          <strong>Cidade:</strong> {results.cep.localidade}
                        </div>
                        <div>
                          <strong>UF:</strong> {results.cep.uf}
                        </div>
                        {results.cep.ddd && (
                          <div>
                            <strong>DDD:</strong> {results.cep.ddd}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {results.municipio && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Informações do Município (IBGE)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <strong>Código IBGE:</strong> {results.municipio.id}
                        </div>
                        <div>
                          <strong>Região:</strong> {results.municipio.microrregiao?.mesorregiao?.UF?.regiao?.nome}
                        </div>
                        {results.municipio.area && (
                          <div>
                            <strong>Área:</strong> {results.municipio.area.total} {results.municipio.area.unidade}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="nfe" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite a chave de acesso da NFe (44 dígitos)"
                  value={nfeInput}
                  onChange={(e) => setNfeInput(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={consultarNFe} disabled={loading}>
                  {loading ? 'Validando...' : 'Validar'}
                </Button>
              </div>

              {results?.validacao && (
                <div className="space-y-4">
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      Validação da chave de acesso e geração de link para consulta pública
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Validação da Chave de Acesso
                        <Badge className={results.validacao.valida ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {results.validacao.valida ? 'Válida' : 'Inválida'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {results.validacao.valida && results.informacoes && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <strong>UF de Emissão:</strong> {results.informacoes.ufEmissao}
                          </div>
                          <div>
                            <strong>Data de Emissão:</strong> {results.informacoes.dataEmissao}
                          </div>
                          <div>
                            <strong>CNPJ Emitente:</strong> {results.informacoes.cnpjEmitente}
                          </div>
                          <div>
                            <strong>Número da Nota:</strong> {results.informacoes.numeroNota}
                          </div>
                          <div>
                            <strong>Série:</strong> {results.informacoes.serieNota}
                          </div>
                          <div>
                            <strong>Modelo:</strong> {results.informacoes.modeloDocumento}
                          </div>
                        </div>
                      )}

                      {results.urlConsulta && (
                        <div className="mt-4">
                          <Separator className="my-4" />
                          <div>
                            <strong>Link para Consulta Pública:</strong>
                            <div className="mt-2">
                              <a 
                                href={results.urlConsulta} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline break-all"
                              >
                                {results.urlConsulta}
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="indices" className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={consultarIndicesEconomicos} disabled={loading}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {loading ? 'Consultando...' : 'Consultar Índices Econômicos'}
                </Button>
              </div>

              {results?.indices && (
                <div className="space-y-4">
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      Dados obtidos diretamente do Banco Central do Brasil
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Taxa SELIC</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                          {results.indices.selic.valor}%
                        </div>
                        <div className="text-sm text-gray-500">
                          Referência: {results.indices.selic.data}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">IPCA</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          {results.indices.ipca.valor}%
                        </div>
                        <div className="text-sm text-gray-500">
                          Referência: {results.indices.ipca.data}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">IGP-M</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                          {results.indices.igpm.valor}%
                        </div>
                        <div className="text-sm text-gray-500">
                          Referência: {results.indices.igpm.data}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Dólar (PTAX)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-bold text-orange-600">
                          R$ {results.indices.cambio.cotacaoCompra.toFixed(4)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Cotação de compra
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {results.proximoFeriado && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Próximo Feriado Nacional</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{results.proximoFeriado.nome}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(results.proximoFeriado.data).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <Badge>{results.proximoFeriado.tipo}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <Alert className="mt-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}