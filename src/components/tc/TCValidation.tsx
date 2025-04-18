import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Loader2, AlertTriangle } from 'lucide-react';
import { TítuloDeCrédito } from '@/types/tc';
import { api } from '@/lib/api';
import { Label } from '@/components/ui/label';

interface PropsValidaçãoTC {
  título: TítuloDeCrédito;
  aoCompletarValidação: (resultado: ResultadoValidação) => void;
}

interface ResultadoValidação {
  válido: boolean;
  mensagem: string;
  detalhes: string[];
  avisos?: string[];
}

export function ValidaçãoTC({ título, aoCompletarValidação }: PropsValidaçãoTC) {
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoValidação | null>(null);

  const validarTC = async () => {
    try {
      setCarregando(true);
      const response = await api.post('/api/tc/validate', {
        tcId: título.id,
        número: título.número,
        tipo: título.tipo,
        valor: título.valorOriginal,
        dataEmissão: título.dataEmissão,
        dataVencimento: título.dataVencimento,
      });

      const resultadoValidação: ResultadoValidação = response.data;
      setResultado(resultadoValidação);
      aoCompletarValidação(resultadoValidação);
    } catch (error) {
      console.error('Erro ao validar título:', error);
      setResultado({
        válido: false,
        mensagem: 'Erro ao validar título',
        detalhes: ['Ocorreu um erro durante a validação'],
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Validação de Título de Crédito</CardTitle>
        <CardDescription>
          Verifique a validade e autenticidade do título de crédito
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numero">Número do Título</Label>
              <Input id="numero" value={título.número} disabled />
            </div>
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Input id="tipo" value={título.tipo} disabled />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor">Valor Original</Label>
              <Input
                id="valor"
                value={título.valorOriginal.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="dataEmissao">Data de Emissão</Label>
              <Input
                id="dataEmissao"
                value={new Date(título.dataEmissão).toLocaleDateString('pt-BR')}
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataVencimento">Data de Vencimento</Label>
              <Input value={new Date(título.dataVencimento).toLocaleDateString('pt-BR')} disabled />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input value={título.status} disabled />
            </div>
          </div>
        </div>

        <Button onClick={validarTC} disabled={carregando} className="w-full">
          {carregando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Validando...
            </>
          ) : (
            'Validar Título'
          )}
        </Button>

        {resultado && (
          <div className="space-y-4">
            <Alert variant={resultado.válido ? 'default' : 'destructive'}>
              {resultado.válido ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {resultado.válido ? 'Título Válido' : 'Título Inválido'}
              </AlertTitle>
              <AlertDescription>
                <p className="mb-2">{resultado.mensagem}</p>
                {resultado.detalhes.length > 0 && (
                  <ul className="list-disc pl-4">
                    {resultado.detalhes.map((detalhe, index) => (
                      <li key={index}>{detalhe}</li>
                    ))}
                  </ul>
                )}
                {resultado.avisos && resultado.avisos.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Avisos:</p>
                    <ul className="list-disc pl-4">
                      {resultado.avisos.map((aviso, index) => (
                        <li key={index}>{aviso}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 