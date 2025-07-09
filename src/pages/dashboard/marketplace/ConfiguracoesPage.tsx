import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Shield, Eye, Mail, Phone } from 'lucide-react';

export default function ConfiguracoesMarketplacePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações do Marketplace</h1>
        <p className="text-gray-600">Gerencie suas preferências de compra e venda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações de Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Perfil do Vendedor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nome-empresa">Nome da Empresa</Label>
              <Input id="nome-empresa" defaultValue="Minha Empresa Ltda" />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <textarea
                id="descricao"
                className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                rows={3}
                defaultValue="Empresa especializada em créditos tributários com mais de 10 anos de experiência no mercado."
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone de Contato</Label>
              <Input id="telefone" defaultValue="(11) 99999-9999" />
            </div>

            <div>
              <Label htmlFor="email">Email de Contato</Label>
              <Input id="email" type="email" defaultValue="contato@empresa.com" />
            </div>

            <Button className="w-full">Salvar Perfil</Button>
          </CardContent>
        </Card>

        {/* Configurações de Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Novas Propostas</Label>
                <p className="text-sm text-gray-600">Receber notificações de novas propostas</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Leilões Ativos</Label>
                <p className="text-sm text-gray-600">Atualizações sobre leilões em andamento</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Mensagens</Label>
                <p className="text-sm text-gray-600">Notificações de novas mensagens</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Relatórios Semanais</Label>
                <p className="text-sm text-gray-600">Resumo semanal de atividades</p>
              </div>
              <Switch />
            </div>

            <div>
              <Label>Método de Notificação</Label>
              <Select defaultValue="email">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="ambos">Email + SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Privacidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacidade e Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Perfil Público</Label>
                <p className="text-sm text-gray-600">Permitir que outros vejam seu perfil</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Histórico de Transações</Label>
                <p className="text-sm text-gray-600">Mostrar histórico público de vendas</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Contato Direto</Label>
                <p className="text-sm text-gray-600">Permitir contato direto via plataforma</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div>
              <Label>Nível de Verificação</Label>
              <Select defaultValue="completo">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basico">Básico</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                  <SelectItem value="completo">Completo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preferências de Venda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Desconto Máximo Padrão</Label>
              <Input type="number" defaultValue="15" />
              <p className="text-sm text-gray-600 mt-1">Desconto máximo aplicado automaticamente</p>
            </div>

            <div>
              <Label>Prazo de Venda Padrão</Label>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 dias</SelectItem>
                  <SelectItem value="30">30 dias</SelectItem>
                  <SelectItem value="45">45 dias</SelectItem>
                  <SelectItem value="60">60 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-renovação</Label>
                <p className="text-sm text-gray-600">Renovar automaticamente anúncios expirados</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Negociação Automática</Label>
                <p className="text-sm text-gray-600">Aceitar propostas dentro do limite</p>
              </div>
              <Switch />
            </div>

            <div>
              <Label>Categorias Preferidas</Label>
              <Select defaultValue="todas">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Categorias</SelectItem>
                  <SelectItem value="icms">ICMS</SelectItem>
                  <SelectItem value="pis-cofins">PIS/COFINS</SelectItem>
                  <SelectItem value="irpj">IRPJ</SelectItem>
                  <SelectItem value="csll">CSLL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar Todas as Configurações</Button>
      </div>
    </div>
  );
}
