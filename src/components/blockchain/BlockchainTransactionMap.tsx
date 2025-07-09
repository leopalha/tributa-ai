import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Share2,
  Layers,
  Eye,
  Filter,
  Map,
  Wallet,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Loader2,
  ExternalLink,
  Copy,
  FileImage,
  FileSpreadsheet,
  Link
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Node {
  id: string;
  type: 'wallet' | 'contract' | 'exchange' | 'mixer';
  label: string;
  balance: number;
  risk?: 'low' | 'medium' | 'high';
  x: number;
  y: number;
}

interface Edge {
  source: string;
  target: string;
  value: number;
  timestamp: Date;
  hash: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export function BlockchainTransactionMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState('map');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: [],
  });
  const [transactionList, setTransactionList] = useState<any[]>([]);
  const [entityList, setEntityList] = useState<any[]>([]);
  const [showNodeDetails, setShowNodeDetails] = useState(false);

  // Simular dados de exemplo
  useEffect(() => {
    setIsLoading(true);
    
    // Gerar dados de exemplo
    setTimeout(() => {
      const nodes: Node[] = [
        {
          id: '0x7a8b9c2d...f1e2d3c4',
          type: 'wallet',
          label: 'Wallet A',
          balance: 1250000,
          x: 300,
          y: 200,
        },
        {
          id: '0x3e4f5g6h...7i8j9k0l',
          type: 'wallet',
          label: 'Wallet B',
          balance: 850000,
          x: 500,
          y: 150,
        },
        {
          id: '0x1a2b3c4d...5e6f7g8h',
          type: 'exchange',
          label: 'Exchange X',
          balance: 5000000,
          x: 400,
          y: 350,
        },
        {
          id: '0x9i8u7y6t...5r4e3w2q',
          type: 'contract',
          label: 'Smart Contract',
          balance: 350000,
          x: 200,
          y: 300,
        },
        {
          id: '0x2w3e4r5t...6y7u8i9o',
          type: 'mixer',
          label: 'Mixer Service',
          balance: 750000,
          risk: 'high',
          x: 600,
          y: 250,
        },
      ];
      
      const edges: Edge[] = [
        {
          source: '0x7a8b9c2d...f1e2d3c4',
          target: '0x3e4f5g6h...7i8j9k0l',
          value: 250000,
          timestamp: new Date(Date.now() - 86400000),
          hash: '0xabc123...',
        },
        {
          source: '0x3e4f5g6h...7i8j9k0l',
          target: '0x1a2b3c4d...5e6f7g8h',
          value: 150000,
          timestamp: new Date(Date.now() - 172800000),
          hash: '0xdef456...',
        },
        {
          source: '0x1a2b3c4d...5e6f7g8h',
          target: '0x9i8u7y6t...5r4e3w2q',
          value: 50000,
          timestamp: new Date(Date.now() - 259200000),
          hash: '0xghi789...',
        },
        {
          source: '0x9i8u7y6t...5r4e3w2q',
          target: '0x2w3e4r5t...6y7u8i9o',
          value: 25000,
          timestamp: new Date(Date.now() - 345600000),
          hash: '0xjkl012...',
        },
      ];
      
      setGraphData({ nodes, edges });
      setIsLoading(false);
    }, 1500);
  }, []);

  // Renderizar gráfico
  useEffect(() => {
    if (!canvasRef.current || graphData.nodes.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Aplicar zoom
    ctx.save();
    ctx.scale(zoom, zoom);
    
    // Desenhar conexões
    graphData.edges.forEach(edge => {
      const source = graphData.nodes.find(n => n.id === edge.source);
      const target = graphData.nodes.find(n => n.id === edge.target);
      
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x / zoom, source.y / zoom);
        ctx.lineTo(target.x / zoom, target.y / zoom);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.lineWidth = Math.log(edge.value) / 10;
        ctx.stroke();
        
        // Desenhar seta
        const angle = Math.atan2(target.y - source.y, target.x - source.x);
        const x = target.x / zoom - 15 * Math.cos(angle);
        const y = target.y / zoom - 15 * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 10 * Math.cos(angle - Math.PI / 6), y - 10 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x - 10 * Math.cos(angle + Math.PI / 6), y - 10 * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.fill();
        
        // Desenhar valor da transação
        const midX = (source.x / zoom + target.x / zoom) / 2;
        const midY = (source.y / zoom + target.y / zoom) / 2;
        ctx.font = '10px Arial';
        ctx.fillStyle = '#4B5563';
        ctx.fillText(`${(edge.value / 1000).toFixed(1)}K`, midX, midY - 5);
      }
    });
    
    // Desenhar nós
    graphData.nodes.forEach(node => {
      const x = node.x / zoom;
      const y = node.y / zoom;
      const isSelected = selectedNode?.id === node.id;
      const radius = isSelected ? 25 : 20;
      
      // Círculo de fundo
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      
      // Cor baseada no tipo
      let fillColor = '#3B82F6'; // wallet (azul)
      if (node.type === 'contract') fillColor = '#8B5CF6'; // contrato (roxo)
      if (node.type === 'exchange') fillColor = '#10B981'; // exchange (verde)
      if (node.type === 'mixer') fillColor = '#F59E0B'; // mixer (laranja)
      
      // Se tiver risco alto, borda vermelha
      if (node.risk === 'high') {
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      ctx.fillStyle = isSelected ? `${fillColor}DD` : `${fillColor}99`;
      ctx.fill();
      
      // Ícone baseado no tipo
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let icon = '👛'; // wallet
      if (node.type === 'contract') icon = '📄';
      if (node.type === 'exchange') icon = '💱';
      if (node.type === 'mixer') icon = '🔄';
      
      ctx.fillText(icon, x, y);
      
      // Label
      ctx.font = '12px Arial';
      ctx.fillStyle = '#1F2937';
      ctx.fillText(node.label, x, y + radius + 15);
    });
    
    ctx.restore();
  }, [graphData, zoom, selectedNode]);

  // Manipulador de clique no canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * zoom;
    const y = (e.clientY - rect.top) * zoom;
    
    // Verificar se clicou em algum nó
    const clickedNode = graphData.nodes.find(node => {
      const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
      return distance < 20 * zoom;
    });
    
    setSelectedNode(clickedNode || null);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSearch = () => {
    if (!searchTerm) return;
    
    setIsLoading(true);
    
    // Simular busca
    setTimeout(() => {
      // Encontrar nó pelo ID ou label
      const foundNode = graphData.nodes.find(
        node => node.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
               node.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (foundNode) {
        setSelectedNode(foundNode);
      }
      
      setIsLoading(false);
    }, 800);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simular atualização de dados
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const exportGraph = async (format: 'png' | 'svg' | 'json') => {
    try {
      if (format === 'png' && canvasRef.current) {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `blockchain-map-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL();
        link.click();
        toast.success('Mapa exportado como PNG!');
      } else if (format === 'json') {
        const data = {
          nodes: graphData.nodes,
          edges: graphData.edges,
          metadata: {
            exportedAt: new Date().toISOString(),
            zoom,
            selectedNode: selectedNode?.id
          }
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blockchain-map-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Dados do mapa exportados como JSON!');
      } else if (format === 'svg') {
        // Simular exportação SVG
        toast.info('Exportação SVG em desenvolvimento...');
      }
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast.error('Erro ao exportar mapa');
    }
  };

  const shareGraph = async () => {
    try {
      const shareData = {
        title: 'Mapa de Transações Blockchain - Tributa.AI',
        text: 'Confira este mapa de transações blockchain gerado pelo Tributa.AI',
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Mapa compartilhado!');
      } else {
        // Fallback: copiar URL
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copiado para a área de transferência!');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      toast.error('Erro ao compartilhar mapa');
    }
  };

  const generateTransactionList = () => {
    const transactions = graphData.edges.map((edge, index) => ({
      id: index + 1,
      hash: edge.hash,
      from: edge.source,
      to: edge.target,
      value: edge.value,
      timestamp: edge.timestamp,
      status: 'SUCCESS',
      type: 'TRANSFER',
      gasUsed: 21000 + Math.floor(Math.random() * 50000),
      gasPrice: 20 + Math.floor(Math.random() * 100)
    }));
    setTransactionList(transactions);
  };

  const generateEntityList = () => {
    const entities = graphData.nodes.map((node, index) => ({
      id: index + 1,
      address: node.id,
      label: node.label,
      type: node.type,
      balance: node.balance,
      risk: node.risk || 'low',
      transactionCount: Math.floor(Math.random() * 1000) + 10,
      firstSeen: new Date(Date.now() - Math.random() * 31536000000), // Random date in last year
      lastActivity: new Date(Date.now() - Math.random() * 86400000) // Random date in last day
    }));
    setEntityList(entities);
  };

  // Gerar listas quando os dados do grafo mudarem
  useEffect(() => {
    if (graphData.nodes.length > 0) {
      generateTransactionList();
      generateEntityList();
    }
  }, [graphData]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-lg flex items-center">
              <Map className="h-5 w-5 mr-2 text-primary" />
              Mapa de Transações Blockchain
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar endereço ou label..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                />
              </div>
              <Button variant="outline" size="icon" onClick={handleSearch} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="map">Mapa Visual</TabsTrigger>
              <TabsTrigger value="transactions">Transações</TabsTrigger>
              <TabsTrigger value="entities">Entidades</TabsTrigger>
            </TabsList>
            
            <TabsContent value="map" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4 mr-1" />
                    Ampliar
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4 mr-1" />
                    Reduzir
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
                    <RotateCw className="h-4 w-4 mr-1" />
                    Resetar
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Exportar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Exportar Mapa</DialogTitle>
                        <DialogDescription>
                          Escolha o formato para exportar o mapa de transações.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Button 
                          onClick={() => exportGraph('png')} 
                          className="w-full" 
                          variant="outline"
                        >
                          <FileImage className="w-4 h-4 mr-2" />
                          Exportar como PNG
                        </Button>
                        <Button 
                          onClick={() => exportGraph('json')} 
                          className="w-full" 
                          variant="outline"
                        >
                          <FileSpreadsheet className="w-4 h-4 mr-2" />
                          Exportar Dados (JSON)
                        </Button>
                        <Button 
                          onClick={() => exportGraph('svg')} 
                          className="w-full" 
                          variant="outline"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Exportar como SVG
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" size="sm" onClick={shareGraph}>
                    <Share2 className="h-4 w-4 mr-1" />
                    Compartilhar
                  </Button>
                </div>
              </div>
              
              <div className="relative border rounded-md h-[500px] bg-gray-50 overflow-hidden">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                      <p className="text-sm text-gray-600">Carregando mapa de transações...</p>
                    </div>
                  </div>
                )}
                
                <div className="absolute top-4 left-4 z-10 bg-white/90 p-2 rounded-md shadow-sm border">
                  <div className="text-xs text-gray-600 mb-2">Legenda:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                      <span className="text-xs">Carteira</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                      <span className="text-xs">Contrato</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                      <span className="text-xs">Exchange</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                      <span className="text-xs">Mixer</span>
                    </div>
                  </div>
                </div>
                
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full h-full"
                  onClick={handleCanvasClick}
                />
              </div>
              
              {selectedNode && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{selectedNode.label}</h3>
                        <p className="text-sm text-gray-600 font-mono">{selectedNode.id}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">
                            {selectedNode.type === 'wallet' && 'Carteira'}
                            {selectedNode.type === 'contract' && 'Contrato'}
                            {selectedNode.type === 'exchange' && 'Exchange'}
                            {selectedNode.type === 'mixer' && 'Mixer'}
                          </Badge>
                          {selectedNode.risk === 'high' && (
                            <Badge variant="destructive">Alto Risco</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Saldo</div>
                        <div className="font-medium">{formatCurrency(selectedNode.balance)}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <div className="text-sm text-gray-600">Transações de Entrada</div>
                        <div className="font-medium">
                          {graphData.edges.filter(e => e.target === selectedNode.id).length}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600">Transações de Saída</div>
                        <div className="font-medium">
                          {graphData.edges.filter(e => e.source === selectedNode.id).length}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm" onClick={() => setSelectedNode(null)}>
                        Fechar
                      </Button>
                      <Button size="sm" className="ml-2" onClick={() => setShowNodeDetails(true)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="transactions">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Transações no Mapa</h3>
                  <Badge variant="outline">{transactionList.length} transações</Badge>
                </div>
                
                {transactionList.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {transactionList.map((tx) => (
                      <div key={tx.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">#{tx.id}</Badge>
                            <Badge variant={tx.status === 'SUCCESS' ? 'default' : 'destructive'}>
                              {tx.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(tx.hash)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Hash:</p>
                            <p className="font-mono text-xs">{tx.hash}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Valor:</p>
                            <p className="font-medium">{formatCurrency(tx.value)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">De:</p>
                            <p className="font-mono text-xs">{tx.from.substring(0, 20)}...</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Para:</p>
                            <p className="font-mono text-xs">{tx.to.substring(0, 20)}...</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Gas Usado:</p>
                            <p>{tx.gasUsed.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Timestamp:</p>
                            <p>{formatDate(tx.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ArrowRight className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Nenhuma transação encontrada
                    </h3>
                    <p className="text-gray-500">
                      As transações aparecerão aqui quando o mapa for carregado.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="entities">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Entidades no Mapa</h3>
                  <Badge variant="outline">{entityList.length} entidades</Badge>
                </div>
                
                {entityList.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {entityList.map((entity) => (
                      <div key={entity.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              entity.type === 'wallet' ? 'bg-blue-500' :
                              entity.type === 'contract' ? 'bg-purple-500' :
                              entity.type === 'exchange' ? 'bg-green-500' :
                              'bg-amber-500'
                            }`}></div>
                            <Badge variant="outline">
                              {entity.type === 'wallet' && 'Carteira'}
                              {entity.type === 'contract' && 'Contrato'}
                              {entity.type === 'exchange' && 'Exchange'}
                              {entity.type === 'mixer' && 'Mixer'}
                            </Badge>
                            {entity.risk === 'high' && (
                              <Badge variant="destructive">Alto Risco</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(entity.address)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">{entity.label}</h4>
                          <p className="font-mono text-xs text-gray-600 mb-3">{entity.address}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Saldo:</p>
                            <p className="font-medium">{formatCurrency(entity.balance)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Transações:</p>
                            <p className="font-medium">{entity.transactionCount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Primeira atividade:</p>
                            <p>{formatDate(entity.firstSeen)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Última atividade:</p>
                            <p>{formatDate(entity.lastActivity)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Wallet className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Nenhuma entidade encontrada
                    </h3>
                    <p className="text-gray-500">
                      As entidades aparecerão aqui quando o mapa for carregado.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal de Detalhes do Nó */}
      <Dialog open={showNodeDetails} onOpenChange={setShowNodeDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${
                selectedNode?.type === 'wallet' ? 'bg-blue-500' :
                selectedNode?.type === 'contract' ? 'bg-purple-500' :
                selectedNode?.type === 'exchange' ? 'bg-green-500' :
                'bg-amber-500'
              }`}></div>
              Detalhes da Entidade
            </DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre {selectedNode?.label}
            </DialogDescription>
          </DialogHeader>
          
          {selectedNode && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Nome/Label</label>
                  <p className="text-lg font-semibold">{selectedNode.label}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Tipo</label>
                  <Badge variant="outline">
                    {selectedNode.type === 'wallet' && 'Carteira'}
                    {selectedNode.type === 'contract' && 'Contrato Inteligente'}
                    {selectedNode.type === 'exchange' && 'Exchange'}
                    {selectedNode.type === 'mixer' && 'Serviço Mixer'}
                  </Badge>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Endereço</label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono">
                    {selectedNode.id}
                  </code>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(selectedNode.id)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800">Saldo</h4>
                  <p className="text-xl font-bold text-blue-900">
                    {formatCurrency(selectedNode.balance)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800">Transações de Entrada</h4>
                  <p className="text-xl font-bold text-green-900">
                    {graphData.edges.filter(e => e.target === selectedNode.id).length}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800">Transações de Saída</h4>
                  <p className="text-xl font-bold text-purple-900">
                    {graphData.edges.filter(e => e.source === selectedNode.id).length}
                  </p>
                </div>
              </div>

              {/* Análise de Risco */}
              {selectedNode.risk && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Análise de Risco
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">
                      {selectedNode.risk.toUpperCase()} RISCO
                    </Badge>
                    <span className="text-sm text-red-700">
                      Esta entidade apresenta características suspeitas
                    </span>
                  </div>
                </div>
              )}

              {/* Transações Relacionadas */}
              <div className="space-y-3">
                <h4 className="font-medium">Transações Relacionadas</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {graphData.edges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .slice(0, 5)
                    .map((edge, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {edge.source === selectedNode.id ? (
                            <ArrowRight className="w-4 h-4 text-red-500" />
                          ) : (
                            <ArrowLeft className="w-4 h-4 text-green-500" />
                          )}
                          <span className="text-sm font-mono">
                            {edge.source === selectedNode.id ? 
                              edge.target.substring(0, 20) + '...' :
                              edge.source.substring(0, 20) + '...'
                            }
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(edge.value)}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(edge.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNodeDetails(false)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  // Centralizar no nó
                  toast.success('Centrado no nó selecionado');
                }}>
                  <Eye className="w-4 h-4 mr-2" />
                  Centralizar no Mapa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 