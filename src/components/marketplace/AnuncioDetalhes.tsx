import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  DollarSign,
  FileText,
  Info,
  Star,
  User,
  X,
} from 'lucide-react';
import { marketplaceService } from '@/services/marketplace.service';
import { Anuncio, Proposta, StatusAnuncio, TipoNegociacao } from '@/types/marketplace';
import { formatCurrency } from '@/lib/utils';

interface AnuncioDetalhesProps {
  anuncioId: string;
}

export function AnuncioDetalhes({ anuncioId }: AnuncioDetalhesProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [anuncio, setAnuncio] = useState<Anuncio | null>(null);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [valorProposta, setValorProposta] = useState('');
  const [mensagemProposta, setMensagemProposta] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [anuncioId]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [anuncioData, propostasData] = await Promise.all([
        marketplaceService.obterAnuncio(anuncioId),
        marketplaceService.listarPropostas(anuncioId),
      ]);
      setAnuncio(anuncioData);
      setPropostas(propostasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: StatusAnuncio) => {
    const colors = {
      ativo: 'bg-green-500',
      pausado: 'bg-yellow-500',
      vendido: 'bg-blue-500',
      expirado: 'bg-red-500',
      cancelado: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getTipoNegociacaoLabel = (tipo: TipoNegociacao) => {
    const labels = {
      venda_direta: 'Venda Direta',
      leilao: 'Leilão',
      proposta: 'Proposta',
    };
    return labels[tipo] || tipo;
  };

  const handleEnviarProposta = async () => {
    try {
      setLoading(true);
      await marketplaceService.criarProposta({
        anuncioId,
        valor: Number(valorProposta),
        mensagem: mensagemProposta,
      });
      setDialogOpen(false);
      carregarDados();
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !anuncio) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            Carregando...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{anuncio.titulo}</CardTitle>
              <CardDescription>
                TC {anuncio.tc.numero} - {anuncio.tc.tipo}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {getTipoNegociacaoLabel(anuncio.tipoNegociacao)}
              </Badge>
              <Badge className={getStatusColor(anuncio.status)}>
                {anuncio.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Descrição</h4>
                <p className="text-muted-foreground">{anuncio.descricao}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Valores</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Original</p>
                    <p className="font-medium">{formatCurrency(anuncio.valorOriginal)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Sugerido</p>
                    <p className="font-medium">{formatCurrency(anuncio.valorSugerido)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Datas</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Publicação</p>
                      <p className="font-medium">
                        {new Date(anuncio.dataPublicacao).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Expiração</p>
                      <p className="font-medium">
                        {new Date(anuncio.dataExpiracao).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {anuncio.restricoes && (
                <div>
                  <h4 className="font-medium mb-2">Restrições</h4>
                  <div className="space-y-2">
                    {anuncio.restricoes.setoresPermitidos && (
                      <div>
                        <p className="text-sm text-muted-foreground">Setores Permitidos</p>
                        <div className="flex flex-wrap gap-2">
                          {anuncio.restricoes.setoresPermitidos.map((setor) => (
                            <Badge key={setor} variant="secondary">{setor}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {anuncio.restricoes.regioesPermitidas && (
                      <div>
                        <p className="text-sm text-muted-foreground">Regiões Permitidas</p>
                        <div className="flex flex-wrap gap-2">
                          {anuncio.restricoes.regioesPermitidas.map((regiao) => (
                            <Badge key={regiao} variant="secondary">{regiao}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {anuncio.restricoes.faturamentoMinimo && (
                      <div>
                        <p className="text-sm text-muted-foreground">Faturamento Mínimo</p>
                        <p className="font-medium">
                          {formatCurrency(anuncio.restricoes.faturamentoMinimo)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Propostas Recebidas</h4>
                {anuncio.status === 'ativo' && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Fazer Proposta</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nova Proposta</DialogTitle>
                        <DialogDescription>
                          Faça sua proposta para este TC
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Valor</label>
                          <Input
                            type="number"
                            value={valorProposta}
                            onChange={(e) => setValorProposta(e.target.value)}
                            placeholder="Digite o valor da proposta"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Mensagem</label>
                          <Textarea
                            value={mensagemProposta}
                            onChange={(e) => setMensagemProposta(e.target.value)}
                            placeholder="Digite uma mensagem para o vendedor"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleEnviarProposta}>
                          Enviar Proposta
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {propostas.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma proposta recebida ainda
                </div>
              ) : (
                <div className="space-y-4">
                  {propostas.map((proposta) => (
                    <Card key={proposta.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Comprador</span>
                              <Badge variant="outline">{proposta.status}</Badge>
                            </div>
                            <p className="text-lg font-medium mb-1">
                              {formatCurrency(proposta.valor)}
                            </p>
                            {proposta.mensagem && (
                              <p className="text-sm text-muted-foreground">
                                {proposta.mensagem}
                              </p>
                            )}
                          </div>
                          {proposta.status === 'pendente' && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {}}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button size="icon" onClick={() => {}}>
                                <Check className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => router.push('/marketplace')}
        >
          Voltar
        </Button>
        {anuncio.status === 'ativo' && (
          <>
            <Button variant="outline" onClick={() => {}}>
              Editar
            </Button>
            <Button variant="destructive" onClick={() => {}}>
              Cancelar Anúncio
            </Button>
          </>
        )}
      </div>
    </div>
  );
} 