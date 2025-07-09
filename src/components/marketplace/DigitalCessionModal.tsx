import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FileSignature,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Building2,
  Fingerprint,
  Stamp,
  Link,
  Download,
  Upload,
  Eye,
  Zap,
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { digitalCessionContractService, CessionContract } from '@/services/digital-cession-contract.service';
import { toast } from 'sonner';

interface CreditTitle {
  id: string;
  title: string;
  creditType: string;
  creditValue: number;
  currentPrice: number;
  seller: {
    name: string;
    verified: boolean;
  };
}

interface DigitalCessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  credit: CreditTitle | null;
  purchaseData: any;
  onComplete: (cessionContract: CessionContract) => void;
}

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  icon: React.ReactNode;
}

export function DigitalCessionModal({
  isOpen,
  onClose,
  credit,
  purchaseData,
  onComplete
}: DigitalCessionModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [contract, setContract] = useState<CessionContract | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [buyerData, setBuyerData] = useState({
    name: '',
    document: '',
    email: '',
    address: {
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });
  const [icpCertificate, setIcpCertificate] = useState<File | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);

  const steps: ProcessStep[] = [
    {
      id: 'contract_generation',
      title: 'Geração do Contrato',
      description: 'Criando contrato de cessão personalizado',
      status: 'pending',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'buyer_data',
      title: 'Dados do Adquirente',
      description: 'Informações do cessionário',
      status: 'pending',
      icon: <User className="w-5 h-5" />,
    },
    {
      id: 'icp_validation',
      title: 'Certificado ICP-Brasil',
      description: 'Validação do certificado digital',
      status: 'pending',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: 'digital_signature',
      title: 'Assinatura Digital',
      description: 'Assinatura com certificado ICP-Brasil',
      status: 'pending',
      icon: <FileSignature className="w-5 h-5" />,
    },
    {
      id: 'notary_registration',
      title: 'Registro Cartorário',
      description: 'Registro em cartório digital',
      status: 'pending',
      icon: <Stamp className="w-5 h-5" />,
    },
    {
      id: 'blockchain_record',
      title: 'Registro Blockchain',
      description: 'Registro imutável na blockchain',
      status: 'pending',
      icon: <Link className="w-5 h-5" />,
    },
  ];

  const [processSteps, setProcessSteps] = useState(steps);

  useEffect(() => {
    if (isOpen && credit) {
      generateContract();
    }
  }, [isOpen, credit]);

  const generateContract = async () => {
    if (!credit) return;

    try {
      setIsProcessing(true);
      setProcessProgress(10);
      
      updateStepStatus(0, 'active');

      // Simulate contract generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const cedente = {
        type: 'cedente' as const,
        name: credit.seller.name,
        document: '12.345.678/0001-90', // Mock CNPJ
        email: 'vendedor@empresa.com.br',
        address: {
          street: 'Rua Exemplo',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01000-000',
        },
      };

      const creditObject = {
        id: credit.id,
        type: credit.creditType as any,
        originalValue: credit.creditValue,
        cessionValue: credit.currentPrice,
        issueDate: new Date(),
        debtor: {
          name: 'Governo Federal',
          document: '00.000.000/0001-00',
          governmentLevel: 'federal' as const,
        },
        documentation: {
          nfe: 'NFe-123456789',
          declarationNumber: 'DECL-987654321',
        },
        guarantees: ['Seguro de Crédito', 'Auditoria Externa'],
      };

      const generatedContract = await digitalCessionContractService.generateCessionContract(
        cedente,
        {} as any, // Will be filled with buyer data
        creditObject,
        credit.currentPrice
      );

      setContract(generatedContract);
      updateStepStatus(0, 'completed');
      setProcessProgress(20);
      setCurrentStep(1);
      updateStepStatus(1, 'active');
    } catch (error) {
      updateStepStatus(0, 'error');
      toast.error('Erro na geração do contrato');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateStepStatus = (stepIndex: number, status: ProcessStep['status']) => {
    setProcessSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Validate buyer data
      if (!buyerData.name || !buyerData.document || !buyerData.email) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }
      updateStepStatus(1, 'completed');
      setCurrentStep(2);
      updateStepStatus(2, 'active');
      setProcessProgress(40);
    } else if (currentStep === 2) {
      // Validate ICP certificate
      if (!icpCertificate) {
        toast.error('Selecione o certificado ICP-Brasil');
        return;
      }
      await validateICPCertificate();
    } else if (currentStep === 3) {
      await processDigitalSignature();
    } else if (currentStep === 4) {
      await processNotaryRegistration();
    } else if (currentStep === 5) {
      await processBlockchainRecord();
    }
  };

  const validateICPCertificate = async () => {
    try {
      setIsProcessing(true);
      
      const validation = await digitalCessionContractService.validateICPCertificate(
        'mock-certificate-data'
      );

      if (validation.isValid) {
        updateStepStatus(2, 'completed');
        setCurrentStep(3);
        updateStepStatus(3, 'active');
        setProcessProgress(60);
        toast.success('Certificado ICP-Brasil validado com sucesso');
      } else {
        updateStepStatus(2, 'error');
        toast.error('Certificado ICP-Brasil inválido');
      }
    } catch (error) {
      updateStepStatus(2, 'error');
      toast.error('Erro na validação do certificado');
    } finally {
      setIsProcessing(false);
    }
  };

  const processDigitalSignature = async () => {
    if (!contract) return;

    try {
      setIsProcessing(true);
      
      const signature = await digitalCessionContractService.applyDigitalSignature(
        contract.id,
        'cessionario',
        'mock-certificate-data',
        'mock-private-key'
      );

      if (signature.success) {
        updateStepStatus(3, 'completed');
        setCurrentStep(4);
        updateStepStatus(4, 'active');
        setProcessProgress(75);
        toast.success('Contrato assinado digitalmente');
      } else {
        updateStepStatus(3, 'error');
        toast.error('Erro na assinatura digital');
      }
    } catch (error) {
      updateStepStatus(3, 'error');
      toast.error('Erro na assinatura digital');
    } finally {
      setIsProcessing(false);
    }
  };

  const processNotaryRegistration = async () => {
    if (!contract) return;

    try {
      setIsProcessing(true);
      
      const registration = await digitalCessionContractService.registerInDigitalNotary(
        contract.id
      );

      updateStepStatus(4, 'completed');
      setCurrentStep(5);
      updateStepStatus(5, 'active');
      setProcessProgress(90);
      toast.success(`Registrado no cartório: ${registration.registrationNumber}`);
    } catch (error) {
      updateStepStatus(4, 'error');
      toast.error('Erro no registro cartorário');
    } finally {
      setIsProcessing(false);
    }
  };

  const processBlockchainRecord = async () => {
    if (!contract) return;

    try {
      setIsProcessing(true);
      
      const blockchainRecord = await digitalCessionContractService.recordOnBlockchain(
        contract.id,
        'mock-contract-hash'
      );

      updateStepStatus(5, 'completed');
      setProcessProgress(100);
      toast.success(`Registrado na blockchain: ${blockchainRecord.transactionHash}`);
      
      // Complete the process
      if (contract) {
        onComplete({
          ...contract,
          status: 'completed',
          blockchainRecord: {
            transactionHash: blockchainRecord.transactionHash,
            blockNumber: blockchainRecord.blockNumber,
            contractAddress: blockchainRecord.contractAddress,
            tokenId: blockchainRecord.tokenId,
            timestamp: new Date(),
          },
        });
      }
    } catch (error) {
      updateStepStatus(5, 'error');
      toast.error('Erro no registro blockchain');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Zap className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Gerando Contrato de Cessão</h3>
              <p className="text-gray-600">Criando contrato personalizado para {credit?.creditType}...</p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Dados do Adquirente (Cessionário)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={buyerData.name}
                    onChange={(e) => setBuyerData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome completo ou razão social"
                  />
                </div>
                <div>
                  <Label htmlFor="document">CPF/CNPJ *</Label>
                  <Input
                    id="document"
                    value={buyerData.document}
                    onChange={(e) => setBuyerData(prev => ({ ...prev, document: e.target.value }))}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={buyerData.email}
                    onChange={(e) => setBuyerData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@empresa.com.br"
                  />
                </div>
                <div>
                  <Label htmlFor="street">Endereço</Label>
                  <Input
                    id="street"
                    value={buyerData.address.street}
                    onChange={(e) => setBuyerData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, street: e.target.value }
                    }))}
                    placeholder="Rua, Avenida..."
                  />
                </div>
                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={buyerData.address.number}
                    onChange={(e) => setBuyerData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, number: e.target.value }
                    }))}
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Certificado Digital ICP-Brasil</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Selecione seu certificado ICP-Brasil</p>
                  <p className="text-sm text-gray-600">Arquivo .p12 ou .pfx do seu certificado digital</p>
                  <input
                    type="file"
                    accept=".p12,.pfx"
                    onChange={(e) => setIcpCertificate(e.target.files?.[0] || null)}
                    className="hidden"
                    id="certificate-upload"
                  />
                  <label htmlFor="certificate-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Selecionar Certificado
                    </Button>
                  </label>
                  {icpCertificate && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {icpCertificate.name}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Sobre a Assinatura Digital</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      A assinatura digital com certificado ICP-Brasil garante a validade jurídica 
                      do contrato de cessão, conforme a MP 2.200-2/2001.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Fingerprint className="w-12 h-12 mx-auto mb-4 text-green-600 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Processando Assinatura Digital</h3>
              <p className="text-gray-600">Aplicando assinatura ICP-Brasil no contrato...</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Stamp className="w-12 h-12 mx-auto mb-4 text-purple-600 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Registro Cartorário Digital</h3>
              <p className="text-gray-600">Registrando contrato em cartório digital...</p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Link className="w-12 h-12 mx-auto mb-4 text-indigo-600 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Registro Blockchain</h3>
              <p className="text-gray-600">Criando registro imutável na blockchain...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!credit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="mx-4 sm:mx-auto max-w-full sm:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="w-5 h-5" />
            Contrato de Cessão Digital
          </DialogTitle>
          <DialogDescription>
            Processo completo de cessão com validade jurídica garantida
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso do Processo</span>
              <span>{processProgress}%</span>
            </div>
            <Progress value={processProgress} className="w-full" />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-6 gap-2">
            {processSteps.map((step, index) => (
              <div key={step.id} className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  step.status === 'completed' ? 'bg-green-100 text-green-600' :
                  step.status === 'active' ? 'bg-blue-100 text-blue-600' :
                  step.status === 'error' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : step.status === 'error' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    step.icon
                  )}
                </div>
                <p className="text-xs text-gray-600">{step.title}</p>
              </div>
            ))}
          </div>

          {/* Contract Summary */}
          {contract && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Resumo do Contrato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Número do Contrato</p>
                    <p className="font-medium">{contract.contractNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tipo de Crédito</p>
                    <p className="font-medium">{contract.creditObject.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Valor da Cessão</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(contract.creditObject.cessionValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cedente</p>
                    <p className="font-medium">{contract.cedente.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step Content */}
          <Card>
            <CardContent className="p-6">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Legal Terms */}
          {currentStep === 1 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="legal-terms" 
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  />
                  <Label htmlFor="legal-terms" className="text-sm leading-relaxed cursor-pointer">
                    Declaro estar ciente de que este contrato de cessão terá validade jurídica 
                    plena conforme o Código Civil Arts. 286-298 e MP 2.200-2/2001, e que a 
                    assinatura digital ICP-Brasil equivale à assinatura manuscrita.
                  </Label>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            {processProgress === 100 ? 'Fechar' : 'Cancelar'}
          </Button>
          
          {processProgress < 100 && (
            <Button 
              onClick={handleNextStep} 
              disabled={isProcessing || (currentStep === 1 && (!acceptedTerms || !buyerData.name || !buyerData.document))}
            >
              {isProcessing ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : currentStep === 0 ? (
                'Aguarde...'
              ) : (
                'Continuar'
              )}
            </Button>
          )}

          {processProgress === 100 && (
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Baixar Contrato
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}