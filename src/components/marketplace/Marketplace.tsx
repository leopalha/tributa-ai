'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  ArrowUpDown,
  Clock,
  DollarSign,
  Filter,
  Search,
  Star,
  TrendingUp,
} from 'lucide-react';
import { marketplaceService } from '@/services/marketplace.service';
import { Anuncio, StatusAnuncio, TipoNegociacao } from '@/types/marketplace';
import { formatCurrency } from '@/lib/utils';

interface MarketplaceProps {
  empresaId?: string;
}

export function Marketplace({ empresaId }: MarketplaceProps) {
  const router = useRouter();
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    status: '',
    tipoNegociacao: '',
    valorMinimo: '',
    valorMaximo: '',
    setorAtividade: '',
    regiao: '',
    search: '',
  });

  useEffect(() => {
    carregarAnuncios();
  }, [filtros]);

  const carregarAnuncios = async () => {
    try {
      setLoading(true);
      const response = await marketplaceService.listarAnuncios({
        ...filtros,
        valorMinimo: filtros.valorMinimo ? Number(filtros.valorMinimo) : undefined,
        valorMaximo: filtros.valorMaximo ? Number(filtros.valorMaximo) : undefined,
      });
      setAnuncios(response.items);
    } catch (error) {
      console.error('Erro ao carregar anúncios:', error);
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

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const handleAnuncioClick = (id: string) => {
    router.push(`/marketplace/anuncios/${id}`);
  };

  const handleNovoAnuncio = () => {
    router.push('/marketplace/anuncios/novo');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Marketplace de TCs</CardTitle>
              <CardDescription>
                Encontre as melhores oportunidades de negociação de Títulos de Crédito
              </CardDescription>
            </div>
            <Button onClick={handleNovoAnuncio}>
              Anunciar TC
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="col-span-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar anúncios..."
                  className="pl-8"
                  value={filtros.search}
                  onChange={(e) => handleFiltroChange('search', e.target.value)}
                />
              </div>
            </div>
            <Select
              value={filtros.status}
              onValueChange={(value) => handleFiltroChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
                <SelectItem value="vendido">Vendido</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filtros.tipoNegociacao}
              onValueChange={(value) => handleFiltroChange('tipoNegociacao', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Negociação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="venda_direta">Venda Direta</SelectItem>
                <SelectItem value="leilao">Leilão</SelectItem>
                <SelectItem value="proposta">Proposta</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Valor Mínimo"
              value={filtros.valorMinimo}
              onChange={(e) => handleFiltroChange('valorMinimo', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Valor Máximo"
              value={filtros.valorMaximo}
              onChange={(e) => handleFiltroChange('valorMaximo', e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor Original</TableHead>
                  <TableHead className="text-right">Valor Sugerido</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Carregando anúncios...
                    </TableCell>
                  </TableRow>
                ) : anuncios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Nenhum anúncio encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  anuncios.map((anuncio) => (
                    <TableRow
                      key={anuncio.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleAnuncioClick(anuncio.id)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{anuncio.titulo}</div>
                          <div className="text-sm text-muted-foreground">
                            {anuncio.tc.numero}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getTipoNegociacaoLabel(anuncio.tipoNegociacao)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(anuncio.status)}>
                          {anuncio.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(anuncio.valorOriginal)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(anuncio.valorSugerido)}
                      </TableCell>
                      <TableCell>
                        {new Date(anuncio.dataExpiracao).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <AlertCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Volume Negociado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.234.567,89</div>
            <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Taxa de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-sm text-muted-foreground">Negociações concluídas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tempo Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2 dias</div>
            <p className="text-sm text-muted-foreground">Para conclusão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Desconto Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-sm text-muted-foreground">Sobre valor original</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}