import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Search, X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FiltrosTC, TipoTC, StatusTC } from '@/types/titulo-credito';

interface TituloFiltrosProps {
  filtros: FiltrosTC;
  onFiltrosChange: (filtros: FiltrosTC) => void;
}

const tipoOptions: { value: TipoTC; label: string }[] = [
  { value: 'tributario', label: 'Tributário' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'judicial', label: 'Judicial' },
  { value: 'rural', label: 'Rural' },
  { value: 'imobiliario', label: 'Imobiliário' },
  { value: 'ambiental', label: 'Ambiental' },
  { value: 'especial', label: 'Especial' },
];

const statusOptions: { value: StatusTC; label: string }[] = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'tokenizado', label: 'Tokenizado' },
  { value: 'compensado', label: 'Compensado' },
  { value: 'vencido', label: 'Vencido' },
  { value: 'cancelado', label: 'Cancelado' },
];

export function TituloFiltros({ filtros, onFiltrosChange }: TituloFiltrosProps) {
  const [dataEmissaoInicio, setDataEmissaoInicio] = React.useState<Date | undefined>(
    filtros.dataEmissaoInicio ? new Date(filtros.dataEmissaoInicio) : undefined
  );
  const [dataEmissaoFim, setDataEmissaoFim] = React.useState<Date | undefined>(
    filtros.dataEmissaoFim ? new Date(filtros.dataEmissaoFim) : undefined
  );
  const [dataVencimentoInicio, setDataVencimentoInicio] = React.useState<Date | undefined>(
    filtros.dataVencimentoInicio ? new Date(filtros.dataVencimentoInicio) : undefined
  );
  const [dataVencimentoFim, setDataVencimentoFim] = React.useState<Date | undefined>(
    filtros.dataVencimentoFim ? new Date(filtros.dataVencimentoFim) : undefined
  );

  const handleTipoChange = (tipo: TipoTC, checked: boolean) => {
    const tiposAtuais = filtros.tipo || [];
    const novosTipos = checked ? [...tiposAtuais, tipo] : tiposAtuais.filter(t => t !== tipo);

    onFiltrosChange({
      ...filtros,
      tipo: novosTipos.length > 0 ? novosTipos : undefined,
    });
  };

  const handleStatusChange = (status: StatusTC, checked: boolean) => {
    const statusAtuais = filtros.status || [];
    const novosStatus = checked
      ? [...statusAtuais, status]
      : statusAtuais.filter(s => s !== status);

    onFiltrosChange({
      ...filtros,
      status: novosStatus.length > 0 ? novosStatus : undefined,
    });
  };

  const handleValorMinChange = (value: string) => {
    const valor = value ? parseFloat(value) : undefined;
    onFiltrosChange({ ...filtros, valorMin: valor });
  };

  const handleValorMaxChange = (value: string) => {
    const valor = value ? parseFloat(value) : undefined;
    onFiltrosChange({ ...filtros, valorMax: valor });
  };

  const handleEmissorChange = (value: string) => {
    onFiltrosChange({ ...filtros, emissor: value || undefined });
  };

  const handleValidadoChange = (checked: boolean) => {
    onFiltrosChange({ ...filtros, validado: checked ? true : undefined });
  };

  const handleDataEmissaoInicioChange = (date: Date | undefined) => {
    setDataEmissaoInicio(date);
    onFiltrosChange({
      ...filtros,
      dataEmissaoInicio: date,
    });
  };

  const handleDataEmissaoFimChange = (date: Date | undefined) => {
    setDataEmissaoFim(date);
    onFiltrosChange({
      ...filtros,
      dataEmissaoFim: date,
    });
  };

  const handleDataVencimentoInicioChange = (date: Date | undefined) => {
    setDataVencimentoInicio(date);
    onFiltrosChange({
      ...filtros,
      dataVencimentoInicio: date,
    });
  };

  const handleDataVencimentoFimChange = (date: Date | undefined) => {
    setDataVencimentoFim(date);
    onFiltrosChange({
      ...filtros,
      dataVencimentoFim: date,
    });
  };

  const handleOrdenacaoChange = (value: string) => {
    onFiltrosChange({
      ...filtros,
      ordenacao: value as FiltrosTC['ordenacao'],
    });
  };

  const handleDirecaoChange = (value: string) => {
    onFiltrosChange({
      ...filtros,
      direcao: value as FiltrosTC['direcao'],
    });
  };

  const handleLimparFiltros = () => {
    setDataEmissaoInicio(undefined);
    setDataEmissaoFim(undefined);
    setDataVencimentoInicio(undefined);
    setDataVencimentoFim(undefined);
    onFiltrosChange({});
  };

  const filtrosAtivos = Object.keys(filtros).length > 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Linha 1: Filtros básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valorMin">Valor Mínimo</Label>
              <Input
                id="valorMin"
                type="number"
                step="0.01"
                value={filtros.valorMin || ''}
                onChange={e => handleValorMinChange(e.target.value)}
                placeholder="R$ 0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorMax">Valor Máximo</Label>
              <Input
                id="valorMax"
                type="number"
                step="0.01"
                value={filtros.valorMax || ''}
                onChange={e => handleValorMaxChange(e.target.value)}
                placeholder="R$ 0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emissor">Emissor</Label>
              <Input
                id="emissor"
                value={filtros.emissor || ''}
                onChange={e => handleEmissorChange(e.target.value)}
                placeholder="Nome do emissor"
              />
            </div>

            <div className="space-y-2">
              <Label>Ordenar por</Label>
              <div className="flex gap-2">
                <Select value={filtros.ordenacao || 'valor'} onValueChange={handleOrdenacaoChange}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="valor">Valor</SelectItem>
                    <SelectItem value="data_emissao">Data Emissão</SelectItem>
                    <SelectItem value="data_vencimento">Vencimento</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="rendimento">Rendimento</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtros.direcao || 'desc'} onValueChange={handleDirecaoChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">↑</SelectItem>
                    <SelectItem value="desc">↓</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Linha 2: Tipos de TC */}
          <div className="space-y-2">
            <Label>Tipos de Título</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {tipoOptions.map(tipo => (
                <div key={tipo.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tipo-${tipo.value}`}
                    checked={filtros.tipo?.includes(tipo.value) || false}
                    onCheckedChange={checked => handleTipoChange(tipo.value, checked as boolean)}
                  />
                  <Label
                    htmlFor={`tipo-${tipo.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {tipo.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Linha 3: Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {statusOptions.map(status => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={filtros.status?.includes(status.value) || false}
                    onCheckedChange={checked =>
                      handleStatusChange(status.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`status-${status.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {status.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Linha 4: Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Emissão</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dataEmissaoInicio && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataEmissaoInicio ? format(dataEmissaoInicio, 'dd/MM/yyyy') : 'Início'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dataEmissaoInicio}
                      onSelect={handleDataEmissaoInicioChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dataEmissaoFim && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataEmissaoFim ? format(dataEmissaoFim, 'dd/MM/yyyy') : 'Fim'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dataEmissaoFim}
                      onSelect={handleDataEmissaoFimChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Data de Vencimento</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dataVencimentoInicio && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataVencimentoInicio ? format(dataVencimentoInicio, 'dd/MM/yyyy') : 'Início'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dataVencimentoInicio}
                      onSelect={handleDataVencimentoInicioChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dataVencimentoFim && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataVencimentoFim ? format(dataVencimentoFim, 'dd/MM/yyyy') : 'Fim'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dataVencimentoFim}
                      onSelect={handleDataVencimentoFimChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Linha 5: Opções adicionais */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="validado"
                  checked={filtros.validado || false}
                  onCheckedChange={handleValidadoChange}
                />
                <Label htmlFor="validado" className="text-sm font-normal cursor-pointer">
                  Apenas títulos validados
                </Label>
              </div>
            </div>

            <div className="flex gap-2">
              {filtrosAtivos && (
                <Button variant="outline" onClick={handleLimparFiltros}>
                  <X className="mr-2 h-4 w-4" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
