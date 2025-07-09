import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calculator, Play, BarChart, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SimulacaoResult {
  valorDebito: number;
  valorCredito: number;
  compensacaoPossivel: number;
  saldoRemanescente: number;
  economia: number;
  multa: number;
  juros: number;
  tipo: 'total' | 'parcial' | 'impossivel';
}

export default function SimuladorFiscalPage() {
  const [formData, setFormData] = useState({
    valorDebito: '',
    tipoDebito: '',
    valorCredito: '',
    tipoCredito: '',
    competencia: '',
    observacoes: '',
  });

  const [resultado, setResultado] = useState<SimulacaoResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleSimular = async () => {
    setIsCalculating(true);
    
    // Simular cálculo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const valorDebito = parseFloat(formData.valorDebito) || 0;
    const valorCredito = parseFloat(formData.valorCredito) || 0;
    const multa = valorDebito * 0.05; // 5% de multa
    const juros = valorDebito * 0.03; // 3% de juros
    const valorTotalDebito = valorDebito + multa + juros;
    
    let compensacaoPossivel = 0;
    let saldoRemanescente = 0;
    let tipo: 'total' | 'parcial' | 'impossivel' = 'impossivel';
    
    if (valorCredito >= valorTotalDebito) {
      compensacaoPossivel = valorTotalDebito;
      saldoRemanescente = valorCredito - valorTotalDebito;
      tipo = 'total';
    } else if (valorCredito > 0) {
      compensacaoPossivel = valorCredito;
      saldoRemanescente = valorTotalDebito - valorCredito;
      tipo = 'parcial';
    }
    
    const economia = compensacaoPossivel - (multa + juros);
    
    setResultado({
      valorDebito,
      valorCredito,
      compensacaoPossivel,
      saldoRemanescente,
      economia,
      multa,
      juros,
      tipo,
    });
    
    setIsCalculating(false);
  };

  const getResultColor = (tipo: string) => {
    switch (tipo) {
      case 'total': return 'text-green-600';
      case 'parcial': return 'text-yellow-600';
      case 'impossivel': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getResultIcon = (tipo: string) => {
    switch (tipo) {
      case 'total': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'parcial': return <BarChart className="h-5 w-5 text-yellow-600" />;
      case 'impossivel': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Calculator className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Simulador Fiscal</h1>
          <p className="text-muted-foreground">
            Simule compensações entre débitos e créditos fiscais
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Formulário de Simulação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Dados para Simulação
            </CardTitle>
            <CardDescription>
              Informe os valores dos débitos e créditos para simular a compensação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="valorDebito">Valor do Débito (R$)</Label>
              <Input
                id="valorDebito"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.valorDebito}
                onChange={(e) => setFormData({ ...formData, valorDebito: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoDebito">Tipo do Débito</Label>
              <Select
                value={formData.tipoDebito}
                onValueChange={(value) => setFormData({ ...formData, tipoDebito: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="icms">ICMS</SelectItem>
                  <SelectItem value="ipi">IPI</SelectItem>
                  <SelectItem value="iss">ISS</SelectItem>
                  <SelectItem value="pis">PIS</SelectItem>
                  <SelectItem value="cofins">COFINS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorCredito">Valor do Crédito (R$)</Label>
              <Input
                id="valorCredito"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.valorCredito}
                onChange={(e) => setFormData({ ...formData, valorCredito: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoCredito">Tipo do Crédito</Label>
              <Select
                value={formData.tipoCredito}
                onValueChange={(value) => setFormData({ ...formData, tipoCredito: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="icms">ICMS</SelectItem>
                  <SelectItem value="ipi">IPI</SelectItem>
                  <SelectItem value="iss">ISS</SelectItem>
                  <SelectItem value="pis">PIS</SelectItem>
                  <SelectItem value="cofins">COFINS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="competencia">Competência</Label>
              <Input
                id="competencia"
                type="month"
                value={formData.competencia}
                onChange={(e) => setFormData({ ...formData, competencia: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações adicionais..."
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleSimular} 
              className="w-full"
              disabled={isCalculating || !formData.valorDebito || !formData.valorCredito}
            >
              {isCalculating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                  Calculando...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Simular Compensação
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Resultado da Simulação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Resultado da Simulação
            </CardTitle>
            <CardDescription>
              Análise detalhada da compensação possível
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resultado ? (
              <div className="space-y-4">
                {/* Status da Compensação */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {getResultIcon(resultado.tipo)}
                  <div>
                    <p className={`font-semibold ${getResultColor(resultado.tipo)}`}>
                      {resultado.tipo === 'total' && 'Compensação Total Possível'}
                      {resultado.tipo === 'parcial' && 'Compensação Parcial Possível'}
                      {resultado.tipo === 'impossivel' && 'Compensação Impossível'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {resultado.tipo === 'total' && 'Débito pode ser totalmente compensado'}
                      {resultado.tipo === 'parcial' && 'Débito pode ser parcialmente compensado'}
                      {resultado.tipo === 'impossivel' && 'Crédito insuficiente para compensação'}
                    </p>
                  </div>
                </div>

                {/* Detalhes da Simulação */}
                <div className="grid gap-3">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="text-sm font-medium">Valor do Débito</span>
                    <span className="font-semibold">
                      {resultado.valorDebito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="text-sm font-medium">Multa Estimada (5%)</span>
                    <span className="font-semibold text-red-600">
                      {resultado.multa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="text-sm font-medium">Juros Estimados (3%)</span>
                    <span className="font-semibold text-red-600">
                      {resultado.juros.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="text-sm font-medium">Valor do Crédito</span>
                    <span className="font-semibold text-green-600">
                      {resultado.valorCredito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded">
                    <span className="text-sm font-medium">Compensação Possível</span>
                    <span className="font-bold text-blue-600">
                      {resultado.compensacaoPossivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  
                  {resultado.economia > 0 && (
                    <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded">
                      <span className="text-sm font-medium">Economia Estimada</span>
                      <span className="font-bold text-green-600">
                        {resultado.economia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  )}
                  
                  {resultado.saldoRemanescente > 0 && (
                    <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <span className="text-sm font-medium">
                        {resultado.tipo === 'total' ? 'Saldo de Crédito' : 'Saldo de Débito'}
                      </span>
                      <span className={`font-bold ${resultado.tipo === 'total' ? 'text-green-600' : 'text-red-600'}`}>
                        {resultado.saldoRemanescente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Alertas */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Esta simulação é baseada em cálculos estimados. 
                    Consulte um especialista tributário para análise precisa.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Preencha os dados ao lado e clique em "Simular Compensação" para ver o resultado
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}