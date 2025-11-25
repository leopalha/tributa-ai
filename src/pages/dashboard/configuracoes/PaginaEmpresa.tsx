import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Phone, Mail, FileText, Save, Upload, Shield } from 'lucide-react';

export default function EmpresaPage() {
  const [formData, setFormData] = useState({
    razaoSocial: 'Empresa Exemplo Ltda',
    nomeFantasia: 'Exemplo Corp',
    cnpj: '12.345.678/0001-90',
    inscricaoEstadual: '123.456.789.123',
    inscricaoMunicipal: '98765432',
    endereco: 'Av. Paulista, 1000',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-100',
    telefone: '(11) 3000-0000',
    email: 'contato@exemplo.com',
    website: 'www.exemplo.com',
    regimeTributario: 'lucro-real',
    atividadePrincipal: 'Consultoria em gestão empresarial',
    capitalSocial: '1000000',
    dataConstituicao: '2010-01-15',
    situacaoReceita: 'Ativa',
    observacoes: 'Empresa especializada em consultoria fiscal e tributária.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular salvamento
    console.log('Dados da empresa:', formData);
    alert('Dados da empresa atualizados com sucesso!');
  };

  const handleDocumentUpload = (tipo: string) => {
    // Simular upload de documento
    console.log(`Upload de documento: ${tipo}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dados da Empresa</h1>
          <p className="text-muted-foreground">
            Gerencie as informações da sua empresa
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800">
            <Shield className="mr-1 h-3 w-3" />
            Verificada
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Básicos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Dados Básicos
            </CardTitle>
            <CardDescription>
              Informações fundamentais da empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="razaoSocial">Razão Social</Label>
                <Input
                  id="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                <Input
                  id="nomeFantasia"
                  value={formData.nomeFantasia}
                  onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                <Input
                  id="inscricaoEstadual"
                  value={formData.inscricaoEstadual}
                  onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
                <Input
                  id="inscricaoMunicipal"
                  value={formData.inscricaoMunicipal}
                  onChange={(e) => setFormData({ ...formData, inscricaoMunicipal: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataConstituicao">Data de Constituição</Label>
                <Input
                  id="dataConstituicao"
                  type="date"
                  value={formData.dataConstituicao}
                  onChange={(e) => setFormData({ ...formData, dataConstituicao: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => setFormData({ ...formData, estado: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                    <SelectItem value="SC">Santa Catarina</SelectItem>
                    <SelectItem value="GO">Goiás</SelectItem>
                    <SelectItem value="MT">Mato Grosso</SelectItem>
                    <SelectItem value="BA">Bahia</SelectItem>
                    <SelectItem value="PE">Pernambuco</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Informações de Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Fiscais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informações Fiscais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="regimeTributario">Regime Tributário</Label>
                <Select
                  value={formData.regimeTributario}
                  onValueChange={(value) => setFormData({ ...formData, regimeTributario: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simples-nacional">Simples Nacional</SelectItem>
                    <SelectItem value="lucro-presumido">Lucro Presumido</SelectItem>
                    <SelectItem value="lucro-real">Lucro Real</SelectItem>
                    <SelectItem value="lucro-arbitrado">Lucro Arbitrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="situacaoReceita">Situação na Receita</Label>
                <Select
                  value={formData.situacaoReceita}
                  onValueChange={(value) => setFormData({ ...formData, situacaoReceita: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativa">Ativa</SelectItem>
                    <SelectItem value="Suspensa">Suspensa</SelectItem>
                    <SelectItem value="Inapta">Inapta</SelectItem>
                    <SelectItem value="Baixada">Baixada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capitalSocial">Capital Social (R$)</Label>
                <Input
                  id="capitalSocial"
                  type="number"
                  step="0.01"
                  value={formData.capitalSocial}
                  onChange={(e) => setFormData({ ...formData, capitalSocial: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="atividadePrincipal">Atividade Principal</Label>
              <Input
                id="atividadePrincipal"
                value={formData.atividadePrincipal}
                onChange={(e) => setFormData({ ...formData, atividadePrincipal: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Informações adicionais sobre a empresa..."
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos da Empresa</CardTitle>
            <CardDescription>
              Faça upload dos documentos necessários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Contrato Social</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDocumentUpload('contrato-social')}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                  <span className="text-sm text-green-600">✓ Documento enviado</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cartão CNPJ</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDocumentUpload('cartao-cnpj')}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                  <span className="text-sm text-green-600">✓ Documento enviado</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Inscrição Estadual</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDocumentUpload('inscricao-estadual')}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                  <span className="text-sm text-muted-foreground">Documento pendente</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Comprovante de Endereço</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDocumentUpload('comprovante-endereco')}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                  <span className="text-sm text-green-600">✓ Documento enviado</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  );
}