import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  DeclaracaoFiltros as DeclaracaoFiltrosType,
  TipoDeclaracao,
  StatusDeclaracao,
} from '@/types/declaracao';

interface DeclaracaoFiltrosProps {
  filtros: DeclaracaoFiltrosType;
  onFiltrosChange: (filtros: DeclaracaoFiltrosType) => void;
}

export function DeclaracaoFiltros({ filtros, onFiltrosChange }: DeclaracaoFiltrosProps) {
  const handleDateChange = (date: Date | undefined) => {
    onFiltrosChange({
      ...filtros,
      dataInicio: date ? format(date, 'yyyy-MM-dd') : undefined,
    });
  };

  const handleTipoChange = (tipo: string) => {
    onFiltrosChange({
      ...filtros,
      tipo: (tipo as TipoDeclaracao) || undefined,
    });
  };

  const handleStatusChange = (status: string) => {
    onFiltrosChange({
      ...filtros,
      status: (status as StatusDeclaracao) || undefined,
    });
  };

  const handleValorMinChange = (valor: string) => {
    onFiltrosChange({
      ...filtros,
      valorMin: valor ? parseFloat(valor) : undefined,
    });
  };

  const handleValorMaxChange = (valor: string) => {
    onFiltrosChange({
      ...filtros,
      valorMax: valor ? parseFloat(valor) : undefined,
    });
  };

  const handleLimparFiltros = () => {
    onFiltrosChange({});
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Data de Vencimento</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filtros.dataInicio ? (
                  format(new Date(filtros.dataInicio), 'dd/MM/yyyy')
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filtros.dataInicio ? new Date(filtros.dataInicio) : undefined}
                onSelect={handleDateChange}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select value={filtros.tipo} onValueChange={handleTipoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ICMS">ICMS</SelectItem>
              <SelectItem value="IPI">IPI</SelectItem>
              <SelectItem value="PIS">PIS</SelectItem>
              <SelectItem value="COFINS">COFINS</SelectItem>
              <SelectItem value="IRPJ">IRPJ</SelectItem>
              <SelectItem value="CSLL">CSLL</SelectItem>
              <SelectItem value="ISS">ISS</SelectItem>
              <SelectItem value="INSS">INSS</SelectItem>
              <SelectItem value="FGTS">FGTS</SelectItem>
              <SelectItem value="SIMPLES">SIMPLES</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={filtros.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="declaracao_pendente">Pendente</SelectItem>
              <SelectItem value="declaracao_em_andamento">Em Andamento</SelectItem>
              <SelectItem value="declaracao_concluida">Concluída</SelectItem>
              <SelectItem value="declaracao_atrasada">Atrasada</SelectItem>
              <SelectItem value="declaracao_cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Valor</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Mín"
              value={filtros.valorMin || ''}
              onChange={e => handleValorMinChange(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Máx"
              value={filtros.valorMax || ''}
              onChange={e => handleValorMaxChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={handleLimparFiltros}>
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}
