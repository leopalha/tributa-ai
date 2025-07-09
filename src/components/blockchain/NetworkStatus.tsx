import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Check,
  AlertTriangle,
  Server,
  RefreshCw,
  Activity,
  Database,
  Cpu,
  Network,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { blockchainApi } from '@/services/api';

// Interface para os dados de um peer (nó) da rede
interface PeerNode {
  id: string;
  name: string;
  url: string;
  version: string;
  status: 'online' | 'offline';
  lastSeen: string;
  role: string;
}

// Interface para os dados de um canal da rede
interface Channel {
  id: string;
  name: string;
  peers: string[];
  chaincodes: string[];
  blocks: number;
  created: string;
}

export function NetworkStatus() {
  const [loading, setLoading] = useState(true);
  const [peers, setPeers] = useState<PeerNode[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeTab, setActiveTab] = useState('peers');

  // Função para carregar dados da rede
  const fetchNetworkData = async () => {
    setLoading(true);

    try {
      // No ambiente real, aqui faria a chamada para a API
      // const response = await blockchainApi.getNetworkStatus();

      // Para fins de demonstração, criando dados mock
      const mockPeers: PeerNode[] = [
        {
          id: 'peer0.org1.example.com',
          name: 'Peer 0 (Org1)',
          url: 'grpcs://peer0.org1.example.com:7051',
          version: '2.2.8',
          status: 'online',
          lastSeen: new Date().toISOString(),
          role: 'endorser',
        },
        {
          id: 'peer1.org1.example.com',
          name: 'Peer 1 (Org1)',
          url: 'grpcs://peer1.org1.example.com:8051',
          version: '2.2.8',
          status: 'online',
          lastSeen: new Date().toISOString(),
          role: 'endorser',
        },
        {
          id: 'peer0.org2.example.com',
          name: 'Peer 0 (Org2)',
          url: 'grpcs://peer0.org2.example.com:9051',
          version: '2.2.8',
          status: 'online',
          lastSeen: new Date().toISOString(),
          role: 'committer',
        },
        {
          id: 'peer1.org2.example.com',
          name: 'Peer 1 (Org2)',
          url: 'grpcs://peer1.org2.example.com:10051',
          version: '2.2.8',
          status: 'offline',
          lastSeen: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
          role: 'committer',
        },
      ];

      const mockChannels: Channel[] = [
        {
          id: 'mychannel',
          name: 'mychannel',
          peers: [
            'peer0.org1.example.com',
            'peer1.org1.example.com',
            'peer0.org2.example.com',
            'peer1.org2.example.com',
          ],
          chaincodes: ['tributai:1.0'],
          blocks: 1284,
          created: '2023-09-15T10:00:00Z',
        },
        {
          id: 'channel2',
          name: 'channel2',
          peers: ['peer0.org1.example.com', 'peer0.org2.example.com'],
          chaincodes: ['tributai:1.0', 'documentManager:1.2'],
          blocks: 456,
          created: '2023-10-23T15:30:00Z',
        },
      ];

      setPeers(mockPeers);
      setChannels(mockChannels);
    } catch (error) {
      console.error('Erro ao buscar dados da rede:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchNetworkData();
  }, []);

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Função para calcular tempo desde a última atividade
  const getTimeSince = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffMs = now.getTime() - then.getTime();

    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) return `${seconds} segundo${seconds === 1 ? '' : 's'} atrás`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minuto${minutes === 1 ? '' : 's'} atrás`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hora${hours === 1 ? '' : 's'} atrás`;

    const days = Math.floor(hours / 24);
    return `${days} dia${days === 1 ? '' : 's'} atrás`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Network className="h-5 w-5 text-blue-500" />
            Status da Rede Blockchain
          </CardTitle>
          <CardDescription>
            Monitoramento em tempo real da infraestrutura Hyperledger Fabric
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="mb-4">
              <TabsTrigger value="peers">Peers</TabsTrigger>
              <TabsTrigger value="channels">Canais</TabsTrigger>
              <TabsTrigger value="chaincodes">Contratos</TabsTrigger>
            </TabsList>

            <TabsContent value="peers">
              {loading ? (
                <div className="space-y-2">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
              ) : peers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum peer encontrado na rede.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {peers.map(peer => (
                    <div
                      key={peer.id}
                      className="border rounded-md p-4 flex items-center justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {peer.status === 'online' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{peer.name}</h3>
                          <p className="text-sm text-muted-foreground">{peer.url}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">v{peer.version}</Badge>
                            <Badge variant="outline">{peer.role}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {getTimeSince(peer.lastSeen)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={peer.status === 'online' ? 'default' : 'destructive'}>
                        {peer.status === 'online' ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="channels">
              {loading ? (
                <div className="space-y-2">
                  {Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                </div>
              ) : channels.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum canal encontrado na rede.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {channels.map(channel => (
                    <div key={channel.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{channel.name}</h3>
                        <Badge variant="outline">{channel.blocks} blocos</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Peers conectados</h4>
                          <div className="flex flex-wrap gap-2">
                            {channel.peers.map((peerId: string) => {
                              const peer = peers.find(p => p.id === peerId);
                              return (
                                <Badge
                                  key={peerId}
                                  variant={peer?.status === 'online' ? 'default' : 'outline'}
                                  className="flex items-center gap-1"
                                >
                                  {peer?.status === 'online' ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    <AlertTriangle className="h-3 w-3" />
                                  )}
                                  {peer?.name || peerId}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Chaincodes implantados</h4>
                          <div className="flex flex-wrap gap-2">
                            {channel.chaincodes.map((chaincode: string) => (
                              <Badge key={chaincode} variant="secondary">
                                {chaincode}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-muted-foreground">
                        Criado em: {formatDate(channel.created)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="chaincodes">
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-blue-500" />
                      tributai:1.0
                    </h3>
                    <Badge variant="default">Ativo</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    Contrato inteligente principal da plataforma para gerenciamento de créditos
                    tokenizados e compensações.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Canais implantados</p>
                      <p className="font-medium">2 canais</p>
                    </div>

                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Transações</p>
                      <p className="font-medium">1,245 tx</p>
                    </div>

                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Última atualização</p>
                      <p className="font-medium">2 dias atrás</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-purple-500" />
                      documentManager:1.2
                    </h3>
                    <Badge variant="default">Ativo</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    Contrato para gerenciamento de documentos e comprovantes relacionados a créditos
                    e débitos fiscais.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Canais implantados</p>
                      <p className="font-medium">1 canal</p>
                    </div>

                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Transações</p>
                      <p className="font-medium">324 tx</p>
                    </div>

                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Última atualização</p>
                      <p className="font-medium">5 dias atrás</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" onClick={fetchNetworkData} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar status da rede
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Resumo da Infraestrutura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Server className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Peers Ativos</span>
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold">
                  {peers.filter(p => p.status === 'online').length}/{peers.length}
                </p>
              )}
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium">Canais</span>
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold">{channels.length}</p>
              )}
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">Chaincodes</span>
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold">2</p>
              )}
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Uptime</span>
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold">99.8%</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
