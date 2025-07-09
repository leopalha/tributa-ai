import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ObrigacaoFiscalFiltros } from '@/types/obrigacao-fiscal';
import { Search, X } from 'lucide-react';

interface ObrigacaoFiscalFiltrosProps {
  filtros: ObrigacaoFiscalFiltros;
  onFiltrosChange: (filtros: ObrigacaoFiscalFiltros) => void;
  onLimparFiltros: () => void;
}

export function ObrigacaoFiscalFiltros({
  filtros,
  onFiltrosChange,
  onLimparFiltros,
}: ObrigacaoFiscalFiltrosProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({ ...filtros, searchTerm: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    onFiltrosChange({ ...filtros, status: value });
  };

  const handleTipoChange = (value: string) => {
    onFiltrosChange({ ...filtros, tipo: value });
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar obrigações..."
            value={filtros.searchTerm}
            onChange={handleSearchChange}
            className="w-full"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <Select value={filtros.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="declaracao_pendente">Pendente</SelectItem>
            <SelectItem value="declaracao_em_andamento">Em Andamento</SelectItem>
            <SelectItem value="declaracao_concluida">Concluída</SelectItem>
            <SelectItem value="declaracao_atrasada">Atrasada</SelectItem>
            <SelectItem value="declaracao_cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtros.tipo} onValueChange={handleTipoChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="darf">DARF</SelectItem>
            <SelectItem value="gare">GARE</SelectItem>
            <SelectItem value="dctf">DCTF</SelectItem>
            <SelectItem value="sped">SPED</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={onLimparFiltros}>
          <X className="h-4 w-4 mr-2" />
          Limpar
        </Button>
      </div>
    </div>
  );
}
