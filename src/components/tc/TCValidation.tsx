import React, { useState } from 'react';
import { TituloDeCredito } from '@/types/tc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Check, X, AlertCircle, ArrowRight } from 'lucide-react';

interface TCValidationProps {
  tc: TituloDeCredito;
  onValidationComplete?: (isValid: boolean) => void;
}

export function TCValidation({ tc, onValidationComplete }: TCValidationProps) {
  const [loading, setLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{
    autenticidade: boolean | null;
    documentacao: boolean | null;
    valor: boolean | null;
    emissor: boolean | null;
  }>({
    autenticidade: null,
    documentacao: null,
    valor: null,
    emissor: null,
  });

  const [validationComplete, setValidationComplete] = useState(false);

  const runValidation = async () => {
    setLoading(true);

    // Simulando validação dos diferentes aspectos do TC
    await new Promise(resolve => setTimeout(resolve, 1000));
    setValidationStatus(prev => ({ ...prev, autenticidade: true }));

    await new Promise(resolve => setTimeout(resolve, 1000));
    setValidationStatus(prev => ({ ...prev, documentacao: true }));

    await new Promise(resolve => setTimeout(resolve, 1000));
    setValidationStatus(prev => ({ ...prev, valor: true }));

    await new Promise(resolve => setTimeout(resolve, 1000));
    setValidationStatus(prev => ({ ...prev, emissor: true }));

    setLoading(false);
    setValidationComplete(true);
  };

  const handleCompleteValidation = () => {
    const isValid = Object.values(validationStatus).every(status => status === true);
    if (onValidationComplete) {
      onValidationComplete(isValid);
    }
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) {
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
    } else if (status) {
      return <Check className="h-5 w-5 text-green-500" />;
    } else {
      return <X className="h-5 w-5 text-red-500" />;
    }
  };

  const allValid = Object.values(validationStatus).every(status => status === true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Validação de Título</CardTitle>
        <CardDescription>Validando o título {tc.numero}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Detalhes do Título</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Número:</span> {tc.numero}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Tipo:</span> {tc.tipo.toUpperCase()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Valor:</span> {formatCurrency(tc.valor)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Emissor:</span> {tc.emissor.nome}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Origem:</span> {tc.origemCredito}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Tributo:</span> {tc.tipoTributo}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Emissão:</span> {tc.dataEmissao}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Validade:</span> {tc.dataValidade}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Status de Validação</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(validationStatus.autenticidade)}
                  <span className="text-sm">Autenticidade</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(validationStatus.documentacao)}
                  <span className="text-sm">Documentação</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(validationStatus.valor)}
                  <span className="text-sm">Valor</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(validationStatus.emissor)}
                  <span className="text-sm">Emissor</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            {!validationComplete ? (
              <Button onClick={runValidation} disabled={loading} className="w-full">
                {loading ? 'Validando...' : 'Iniciar Validação'}
              </Button>
            ) : (
              <Button
                onClick={handleCompleteValidation}
                disabled={!allValid}
                className="w-full"
                variant={allValid ? 'default' : 'outline'}
              >
                {allValid ? 'Confirmar Validação' : 'Validação Falhou'}
                {allValid && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
