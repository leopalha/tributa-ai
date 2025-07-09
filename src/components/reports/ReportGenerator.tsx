import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Download, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const reportTypes = [
  {
    value: 'FINANCIAL_SUMMARY',
    label: 'Resumo Financeiro',
    description: 'Visão completa do seu portfólio de créditos',
  },
  {
    value: 'TAX_CREDITS_REPORT',
    label: 'Relatório de Créditos Tributários',
    description: 'Detalhamento de todos os créditos tributários',
  },
  {
    value: 'COMPENSATION_REPORT',
    label: 'Relatório de Compensações',
    description: 'Histórico de compensações realizadas',
  },
  {
    value: 'AUDIT_TRAIL',
    label: 'Trilha de Auditoria',
    description: 'Registro completo para compliance',
  },
];

export function ReportGenerator() {
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    if (!reportType) {
      toast({
        title: 'Erro',
        description: 'Selecione um tipo de relatório',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: reportType,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          format: 'pdf',
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório');
      }

      // Download do arquivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_${reportType}_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Sucesso!',
        description: 'Relatório gerado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao gerar relatório',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedReport = reportTypes.find(r => r.value === reportType);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Gerador de Relatórios
        </CardTitle>
        <CardDescription>
          Gere relatórios detalhados em PDF para análise e compliance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seleção do Tipo de Relatório */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Relatório</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedReport && (
            <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
          )}
        </div>

        {/* Seleção de Período */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Inicial</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate
                    ? format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : 'Selecione a data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data Final</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate
                    ? format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : 'Selecione a data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} locale={ptBR} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateReport}
            disabled={loading || !reportType}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Gerar Relatório PDF
              </>
            )}
          </Button>
        </div>

        {/* Preview Visual */}
        {reportType && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">O relatório incluirá:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Dados completos do período selecionado</li>
              <li>• Gráficos e visualizações</li>
              <li>• Resumo executivo</li>
              <li>• Detalhes para compliance fiscal</li>
              <li>• Assinatura digital e timestamp</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
