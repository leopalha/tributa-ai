import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, ExternalLink, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useSimpleToast } from '@/components/ui/simple-toast';

interface RegistrarCompensacaoBlockchainProps {
  compensacaoId: string;
}

export function RegistrarCompensacaoBlockchain({
  compensacaoId,
}: RegistrarCompensacaoBlockchainProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [isComplete, setIsComplete] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const { toast } = useSimpleToast();

  const steps = [
    { id: 'prepare', name: 'Preparando dados', duration: 2000 },
    { id: 'connect', name: 'Conectando à blockchain', duration: 3000 },
    { id: 'validate', name: 'Validando compensação', duration: 2500 },
    { id: 'register', name: 'Registrando transação', duration: 4000 },
    { id: 'confirm', name: 'Confirmando registro', duration: 3500 },
  ];

  // Função que simula o registro na blockchain (em projeto real, faria a integração com a blockchain escolhida)
  const registerOnBlockchain = async () => {
    setIsRegistering(true);
    setProgress(0);
    setCurrentStep('');
    setIsComplete(false);
    setTransactionHash('');

    let cumulativeProgress = 0;

    // Simular os passos do processo
    for (const step of steps) {
      setCurrentStep(step.id);

      // Atualizar o progresso durante este passo
      const startProgress = cumulativeProgress;
      const stepProgressIncrement = 100 / steps.length;

      // Simular progresso incremental em cada etapa
      const updateInterval = step.duration / 10;
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, updateInterval));
        const stepProgress = startProgress + (stepProgressIncrement * (i + 1)) / 10;
        setProgress(stepProgress);
      }

      cumulativeProgress += stepProgressIncrement;

      // Aguardar a conclusão deste passo
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Gerar um hash de transação aleatório (apenas para simulação)
    const hash =
      '0x' +
      Array.from({ length: 64 })
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');

    setTransactionHash(hash);
    setIsComplete(true);
    setIsRegistering(false);

    toast({
      title: 'Registro concluído na blockchain',
      description: 'A compensação foi registrada com sucesso na blockchain.',
    });
  };

  // Formatação do step para exibição
  const getStepName = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    return step ? step.name : '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300"
        >
          <Shield className="h-4 w-4" />
          Registrar na Blockchain
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Compensação na Blockchain</DialogTitle>
          <DialogDescription>
            O registro em blockchain garante a imutabilidade e transparência da operação fiscal
            realizada.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {!isComplete ? (
            <div className="space-y-6">
              {!isRegistering ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                      Benefícios do Registro Blockchain
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                      <li>• Imutabilidade dos dados fiscais</li>
                      <li>• Audibilidade transparente</li>
                      <li>• Comprovação para autoridades fiscais</li>
                      <li>• Segurança contra fraudes</li>
                    </ul>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>
                      ID da compensação: <span className="font-mono">{compensacaoId}</span>
                    </p>
                    <p className="mt-2">
                      Ao registrar, os dados fiscais serão armazenados em hash criptográfico na
                      blockchain, mantendo a privacidade da operação.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    {steps.map(step => (
                      <div
                        key={step.id}
                        className={`flex items-center py-1 ${
                          currentStep === step.id
                            ? 'text-blue-600 dark:text-blue-400 font-medium'
                            : currentStep &&
                                steps.findIndex(s => s.id === currentStep) >
                                  steps.findIndex(s => s.id === step.id)
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-muted-foreground'
                        }`}
                      >
                        {currentStep &&
                        steps.findIndex(s => s.id === currentStep) >
                          steps.findIndex(s => s.id === step.id) ? (
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                        ) : currentStep === step.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border mr-2" />
                        )}
                        {step.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
                    Registro Concluído com Sucesso
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    A compensação fiscal foi registrada na blockchain e agora é imutável.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Hash da Transação:</p>
                <div className="p-2 bg-muted rounded-md">
                  <p className="font-mono text-xs break-all">{transactionHash}</p>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs text-blue-600 dark:text-blue-400"
                    onClick={() => {
                      navigator.clipboard.writeText(transactionHash);
                      toast({
                        title: 'Hash copiado',
                        description:
                          'O hash da transação foi copiado para a área de transferência.',
                      });
                    }}
                  >
                    Copiar hash
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() =>
                    window.open(`https://etherscan.io/tx/${transactionHash}`, '_blank')
                  }
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver na Blockchain
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {!isComplete ? (
            isRegistering ? (
              <Button disabled className="w-full">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Registrando...
              </Button>
            ) : (
              <Button onClick={registerOnBlockchain} className="w-full">
                Iniciar Registro
              </Button>
            )
          ) : (
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Concluir
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
