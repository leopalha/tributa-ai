import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface SimulationCenterProps {
  currentStats?: {
    totalUsers: number;
    totalTransactions: number;
    revenue: number;
    totalVolume: number;
  };
  onRunSimulation?: (results: any) => void;
}

export const SimulationCenter: React.FC<SimulationCenterProps> = ({ 
  currentStats, 
  onRunSimulation 
}) => {
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [simulationResults, setSimulationResults] = useState<string | null>(null);

  const runSimulation = (type: string) => {
    setActiveSimulation(type);
    
    // Simulação de processamento
    setTimeout(() => {
      let result = '';
      
      switch (type) {
        case 'compensacao':
          result = 'Simulação de compensação concluída. 87% de eficiência no matching de créditos e débitos.';
          break;
        case 'blockchain':
          result = 'Simulação de blockchain concluída. 124 transações processadas em 3.5 segundos.';
          break;
        case 'mercado':
          result = 'Simulação de mercado concluída. Volume de R$ 1.2M em negociações simuladas.';
          break;
        case 'carga':
          result = 'Teste de carga concluído. Sistema suporta até 1200 usuários simultâneos.';
          break;
        default:
          result = 'Simulação concluída.';
      }
      
      setSimulationResults(result);
      setActiveSimulation(null);
      
      if (onRunSimulation) {
        onRunSimulation({ type, result });
      }
    }, 2000);
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Centro de Simulações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='mb-4 text-muted-foreground'>
            Execute simulações para testar diferentes aspectos da plataforma Tributa.AI.
          </p>
          
          <Tabs defaultValue='compensacao' className='w-full'>
            <TabsList className='grid grid-cols-4'>
              <TabsTrigger value='compensacao'>Compensação</TabsTrigger>
              <TabsTrigger value='blockchain'>Blockchain</TabsTrigger>
              <TabsTrigger value='mercado'>Mercado</TabsTrigger>
              <TabsTrigger value='carga'>Teste de Carga</TabsTrigger>
            </TabsList>
            
            <TabsContent value='compensacao' className='space-y-4 mt-4'>
              <h3 className='text-lg font-medium'>Simulação de Compensação Tributária</h3>
              <p>Simule o processo de matching entre créditos e débitos tributários.</p>
              <Button 
                onClick={() => runSimulation('compensacao')}
                disabled={!!activeSimulation}
              >
                {activeSimulation === 'compensacao' ? 'Processando...' : 'Iniciar Simulação'}
              </Button>
            </TabsContent>
            
            <TabsContent value='blockchain' className='space-y-4 mt-4'>
              <h3 className='text-lg font-medium'>Simulação de Blockchain</h3>
              <p>Teste a performance da rede blockchain para validação de transações.</p>
              <Button 
                onClick={() => runSimulation('blockchain')}
                disabled={!!activeSimulation}
              >
                {activeSimulation === 'blockchain' ? 'Processando...' : 'Iniciar Simulação'}
              </Button>
            </TabsContent>
            
            <TabsContent value='mercado' className='space-y-4 mt-4'>
              <h3 className='text-lg font-medium'>Simulação de Mercado</h3>
              <p>Simule operações de compra e venda no marketplace de créditos.</p>
              <Button 
                onClick={() => runSimulation('mercado')}
                disabled={!!activeSimulation}
              >
                {activeSimulation === 'mercado' ? 'Processando...' : 'Iniciar Simulação'}
              </Button>
            </TabsContent>
            
            <TabsContent value='carga' className='space-y-4 mt-4'>
              <h3 className='text-lg font-medium'>Teste de Carga</h3>
              <p>Avalie a capacidade do sistema sob diferentes níveis de carga.</p>
              <Button 
                onClick={() => runSimulation('carga')}
                disabled={!!activeSimulation}
              >
                {activeSimulation === 'carga' ? 'Processando...' : 'Iniciar Simulação'}
              </Button>
            </TabsContent>
          </Tabs>
          
          {simulationResults && (
            <Alert className='mt-6'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Resultado da Simulação</AlertTitle>
              <AlertDescription>{simulationResults}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
