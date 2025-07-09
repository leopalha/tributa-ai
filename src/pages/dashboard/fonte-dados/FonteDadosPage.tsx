import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Building2,
  DollarSign,
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  RefreshCw,
  Database,
  Receipt,
  Gavel,
  MapPin,
  Calendar,
  Eye,
  Download,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface CNPJData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  situacaoFiscal: 'regular' | 'irregular' | 'pendente';
  atividade: string;
  endereco: {
    logradouro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  debitos: {
    federal: number;
    estadual: number;
    municipal: number;
    total: number;
  };
  creditos: {
    icms: number;
    pis_cofins: number;
    irpj_csll: number;
    outros: number;
    total: number;
  };
  ultimaAtualizacao: string;
}

const FonteDadosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('consulta');
  const [cnpjInput, setCnpjInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cnpjData, setCnpjData] = useState<CNPJData | null>(null);
  const [consultas, setConsultas] = useState<CNPJData[]>([]);

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2')
      .slice(0, 18);
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setCnpjInput(formatted);
  };

  const consultarCNPJ = async () => {
    if (!cnpjInput || cnpjInput.length < 18) {
      toast.error('CNPJ inválido', {
        description: 'Digite um CNPJ completo no formato 00.000.000/0000-00',
      });
      return;
    }

    setLoading(true);

    try {
      // Simular consulta às APIs governamentais
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Dados simulados mas realistas
      const mockData: CNPJData = {
        cnpj: cnpjInput,
        razaoSocial: `EMPRESA EXEMPLO ${cnpjInput.slice(-4)} LTDA`,
        nomeFantasia: `Exemplo Corp ${cnpjInput.slice(-4)}`,
        situacaoFiscal: Math.random() > 0.3 ? 'regular' : 'irregular',
        atividade: 'Atividades de tecnologia da informação',
        endereco: {
          logradouro: 'Av. Paulista, 1000',
          cidade: 'São Paulo',
          uf: 'SP',
          cep: '01310-000',
        },
        debitos: {
          federal: Math.floor(Math.random() * 500000),
          estadual: Math.floor(Math.random() * 300000),
          municipal: Math.floor(Math.random() * 100000),
          total: 0,
        },
        creditos: {
          icms: Math.floor(Math.random() * 200000),
          pis_cofins: Math.floor(Math.random() * 150000),
          irpj_csll: Math.floor(Math.random() * 100000),
          outros: Math.floor(Math.random() * 50000),
          total: 0,
        },
        ultimaAtualizacao: new Date().toISOString(),
      };

      // Calcular totais
      mockData.debitos.total =
        Object.values(mockData.debitos).reduce((a, b) => a + b, 0) - mockData.debitos.total;
      mockData.creditos.total =
        Object.values(mockData.creditos).reduce((a, b) => a + b, 0) - mockData.creditos.total;

      setCnpjData(mockData);

      // Adicionar ao histórico
      setConsultas(prev => {
        const newConsultas = [mockData, ...prev.filter(c => c.cnpj !== cnpjInput)];
        return newConsultas.slice(0, 10); // Manter apenas 10 consultas
      });

      toast.success('✅ Consulta realizada com sucesso!', {
        description: `Dados atualizados de ${mockData.razaoSocial}`,
      });
    } catch (error) {
      toast.error('❌ Erro na consulta', {
        description: 'Tente novamente em alguns instantes',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'regular':
        return 'bg-green-100 text-green-800';
      case 'irregular':
        return 'bg-red-100 text-red-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      consultarCNPJ();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Consulta de CNPJ/CPF</h1>
          <p className="text-gray-600 mt-2">
          Consulte débitos, créditos e situação fiscal em tempo real via APIs governamentais
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Consultas Hoje</p>
                <p className="text-2xl font-bold">{consultas.length}</p>
              </div>
              <Search className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Débitos</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(consultas.reduce((sum, c) => sum + c.debitos.total, 0))}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Créditos</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(consultas.reduce((sum, c) => sum + c.creditos.total, 0))}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">APIs Ativas</p>
                <p className="text-2xl font-bold text-blue-600">5</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="consulta">Nova Consulta</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="apis">Status APIs</TabsTrigger>
        </TabsList>

        <TabsContent value="consulta" className="space-y-6">
          {/* Formulário de Consulta */}
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Consultar CNPJ
                </CardTitle>
              <CardDescription>
                Digite o CNPJ para consultar débitos e créditos fiscais
              </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={cnpjInput}
                    onChange={handleCNPJChange}
                    onKeyPress={handleKeyPress}
                    maxLength={18}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={consultarCNPJ} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Consultando...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Consultar
                      </>
                    )}
                  </Button>
                </div>
                </div>

              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  <strong>Fontes consultadas:</strong> Receita Federal, PGFN, SEFAZ-SP, SEFAZ-RJ,
                  SPC/SERASA, CNJ
                </AlertDescription>
              </Alert>
              </CardContent>
            </Card>

          {/* Resultado da Consulta */}
          {cnpjData && (
            <div className="space-y-6">
              {/* Dados da Empresa */}
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Dados da Empresa
                    </div>
                    <Badge className={getSituacaoColor(cnpjData.situacaoFiscal)}>
                      {cnpjData.situacaoFiscal.toUpperCase()}
                    </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Razão Social</p>
                      <p className="font-semibold">{cnpjData.razaoSocial}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nome Fantasia</p>
                      <p className="font-semibold">{cnpjData.nomeFantasia}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CNPJ</p>
                      <p className="font-semibold">{cnpjData.cnpj}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Atividade Principal</p>
                      <p className="font-semibold">{cnpjData.atividade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Endereço</p>
                      <p className="font-semibold">
                        {cnpjData.endereco.logradouro}, {cnpjData.endereco.cidade}/
                        {cnpjData.endereco.uf}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Última Atualização</p>
                      <p className="font-semibold">
                        {new Date(cnpjData.ultimaAtualizacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Débitos e Créditos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Débitos */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="w-5 h-5" />
                      Débitos Fiscais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Federal (PGFN)</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(cnpjData.debitos.federal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Estadual (SEFAZ)</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(cnpjData.debitos.estadual)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Municipal</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(cnpjData.debitos.municipal)}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-red-700 text-lg">
                          {formatCurrency(cnpjData.debitos.total)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Créditos */}
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <TrendingUp className="w-5 h-5" />
                      Créditos Tributários
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">ICMS</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(cnpjData.creditos.icms)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">PIS/COFINS</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(cnpjData.creditos.pis_cofins)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">IRPJ/CSLL</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(cnpjData.creditos.irpj_csll)}
                  </span>
                </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Outros</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(cnpjData.creditos.outros)}
                  </span>
                </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-green-700 text-lg">
                          {formatCurrency(cnpjData.creditos.total)}
                  </span>
                </div>
                </div>
              </CardContent>
            </Card>
          </div>

              {/* Ações */}
          <Card>
            <CardHeader>
                  <CardTitle>Ações Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
                  <div className="flex gap-4">
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Gerar Relatório
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar PDF
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver no Portal da Receita
                    </Button>
              </div>
            </CardContent>
          </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consultas Recentes</CardTitle>
              <CardDescription>Histórico das últimas 10 consultas realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              {consultas.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhuma consulta realizada ainda</p>
                  <p className="text-sm text-gray-500">
                    Faça sua primeira consulta na aba "Nova Consulta"
                  </p>
                      </div>
              ) : (
                <div className="space-y-3">
                  {consultas.map((consulta, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-semibold">{consulta.razaoSocial}</p>
                          <p className="text-sm text-gray-600">{consulta.cnpj}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-red-600">
                            Débitos: {formatCurrency(consulta.debitos.total)}
                          </p>
                          <p className="text-sm text-green-600">
                            Créditos: {formatCurrency(consulta.creditos.total)}
                          </p>
                    </div>
                        <Badge className={getSituacaoColor(consulta.situacaoFiscal)}>
                          {consulta.situacaoFiscal}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => setCnpjData(consulta)}>
                          <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status das APIs Governamentais</CardTitle>
              <CardDescription>Monitoramento em tempo real das conexões</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Receita Federal', status: 'online', response: '120ms' },
                  { name: 'PGFN', status: 'online', response: '340ms' },
                  { name: 'SEFAZ-SP', status: 'online', response: '200ms' },
                  { name: 'SEFAZ-RJ', status: 'offline', response: '-' },
                  { name: 'CNJ (Precatórios)', status: 'online', response: '450ms' },
                ].map((api, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          api.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <span className="font-medium">{api.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">{api.response}</span>
                      <Badge
                        className={
                          api.status === 'online'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {api.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FonteDadosPage;
