import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, FileText, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function NovoTCPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numero: '',
    tipo: '',
    valor: '',
    devedor: '',
    vencimento: '',
    origem: '',
    observacoes: '',
    arquivo: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular salvamento
    console.log('Dados do título:', formData);
    // Redirecionar para lista de títulos
    navigate('/dashboard/tc');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, arquivo: file });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link to="/dashboard/tc">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Novo Título de Crédito</h1>
          <p className="text-muted-foreground">
            Cadastre um novo título de crédito tributário
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informações do Título
          </CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios para cadastrar o título
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="numero">Número do Título *</Label>
                <Input
                  id="numero"
                  placeholder="Ex: TC-2024-001"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo do Título *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nota-fiscal">Nota Fiscal</SelectItem>
                    <SelectItem value="duplicata">Duplicata</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="promissoria">Promissória</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor do Título *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vencimento">Data de Vencimento *</Label>
                <Input
                  id="vencimento"
                  type="date"
                  value={formData.vencimento}
                  onChange={(e) => setFormData({ ...formData, vencimento: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="devedor">Devedor *</Label>
                <Input
                  id="devedor"
                  placeholder="Nome do devedor"
                  value={formData.devedor}
                  onChange={(e) => setFormData({ ...formData, devedor: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="origem">Origem do Crédito *</Label>
                <Select
                  value={formData.origem}
                  onValueChange={(value) => setFormData({ ...formData, origem: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="icms">ICMS</SelectItem>
                    <SelectItem value="ipi">IPI</SelectItem>
                    <SelectItem value="iss">ISS</SelectItem>
                    <SelectItem value="pis">PIS</SelectItem>
                    <SelectItem value="cofins">COFINS</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações adicionais sobre o título"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arquivo">Arquivo do Título</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="arquivo"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button type="button" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Formatos aceitos: PDF, JPG, PNG (máx. 5MB)
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link to="/dashboard/tc">
                  Cancelar
                </Link>
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Salvar Título
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}