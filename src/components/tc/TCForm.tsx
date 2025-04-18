"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TituloDeCredito, TipoTitulo, StatusTitulo } from '@/types/tc';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface TCFormProps {
  tc?: TituloDeCredito;
  onSubmit: (data: Partial<TituloDeCredito>) => Promise<void>;
}

export function TCForm({ tc, onSubmit }: TCFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<TituloDeCredito>>({
    numero: tc?.numero || '',
    valorOriginal: tc?.valorOriginal || 0,
    dataEmissao: tc?.dataEmissao || new Date().toISOString(),
    dataVencimento: tc?.dataVencimento || new Date().toISOString(),
    status: tc?.status || 'pendente',
    tipo: tc?.tipo || 'precatorio',
    descricao: tc?.descricao || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      toast({
        title: "Sucesso",
        description: tc ? "Titulo atualizado com sucesso!" : "Titulo criado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o titulo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tc ? 'Editar Titulo de Credito' : 'Novo Titulo de Credito'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Numero</Label>
              <Input
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorOriginal">Valor Original</Label>
              <Input
                id="valorOriginal"
                name="valorOriginal"
                type="number"
                value={formData.valorOriginal}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataEmissao">Data de Emissao</Label>
              <Input
                id="dataEmissao"
                name="dataEmissao"
                type="date"
                value={formData.dataEmissao?.split('T')[0]}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataVencimento">Data de Vencimento</Label>
              <Input
                id="dataVencimento"
                name="dataVencimento"
                type="date"
                value={formData.dataVencimento?.split('T')[0]}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: StatusTitulo) => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="validado">Validado</SelectItem>
                  <SelectItem value="em_negociacao">Em Negociacao</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="compensado">Compensado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select 
                value={formData.tipo} 
                onValueChange={(value: TipoTitulo) => 
                  setFormData(prev => ({ ...prev, tipo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="precatorio">Precatorio</SelectItem>
                  <SelectItem value="honorarios">Honorarios</SelectItem>
                  <SelectItem value="contrato_extrajudicial">Contrato Extrajudicial</SelectItem>
                  <SelectItem value="excedente_tributario">Excedente Tributario</SelectItem>
                  <SelectItem value="credito_tributario">Credito Tributario</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descricao</Label>
            <Input
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
            />
          </div>

          <Button type="submit" className="w-full">
            {tc ? 'Atualizar' : 'Criar'} Titulo de Credito
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 