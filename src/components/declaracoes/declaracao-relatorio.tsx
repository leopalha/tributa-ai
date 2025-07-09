import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download } from 'lucide-react';
import { DeclaracaoService } from '@/services/declaracao.service';
import { useToast } from '@/components/ui/use-toast';
import { DeclaracaoFiltros } from '@/types/declaracao';

interface DeclaracaoRelatorioProps {
  onRelatorioGerado?: () => void;
}

export function DeclaracaoRelatorio({ onRelatorioGerado }: DeclaracaoRelatorioProps) {
  const { toast } = useToast();
  const [tipoRelatorio, setTipoRelatorio] = React.useState<string>('todos');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGerarRelatorio = async () => {
    try {
      setIsLoading(true);
      const service = DeclaracaoService.getInstance();

      const filtros: DeclaracaoFiltros = {
        status: tipoRelatorio === 'todos' ? undefined : (tipoRelatorio as any),
      };

      const relatorio = await service.gerarRelatorio(filtros, 'pdf');

      // Create a blob from the PDF data
      const blob = new Blob([relatorio], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-declaracoes-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Relatório gerado com sucesso',
        description: 'O arquivo PDF foi baixado automaticamente.',
      });

      onRelatorioGerado?.();
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: 'Erro ao gerar relatório',
        description: 'Ocorreu um erro ao gerar o relatório. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerar Relatório</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecione o tipo de relatório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="declaracao_pendente">Pendentes</SelectItem>
                <SelectItem value="declaracao_enviada">Enviadas</SelectItem>
                <SelectItem value="declaracao_processando">Em Processamento</SelectItem>
                <SelectItem value="declaracao_cancelada">Canceladas</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleGerarRelatorio} disabled={isLoading}>
              <Download className="mr-2 h-4 w-4" />
              {isLoading ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
