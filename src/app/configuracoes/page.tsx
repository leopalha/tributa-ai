'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Building2,
  Bell,
  Shield,
  Mail,
  Phone,
  Globe,
  Settings,
  Save,
  AlertTriangle,
  Check,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';

interface ConfigForm {
  // Personal Information
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  
  // Company Information
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  telefoneEmpresa: string;
  
  // Notification Settings
  notificacoesEmail: boolean;
  notificacoesPush: boolean;
  lembretesDiarios: boolean;
  relatoriosSemanais: boolean;
  alertasVencimento: boolean;
  
  // Security Settings
  autenticacaoDoisFatores: boolean;
  notificarLoginDesconhecido: boolean;
  backupAutomatico: boolean;
}

type TabType = "pessoal" | "empresa" | "notificacoes" | "seguranca"

export default function Configuracoes() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('pessoal');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ConfigForm>({
    // Personal Information
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    
    // Company Information
    razaoSocial: '',
    cnpj: '',
    endereco: '',
    telefoneEmpresa: '',
    
    // Notification Settings
    notificacoesEmail: true,
    notificacoesPush: true,
    lembretesDiarios: false,
    relatoriosSemanais: true,
    alertasVencimento: true,
    
    // Security Settings
    autenticacaoDoisFatores: false,
    notificarLoginDesconhecido: true,
    backupAutomatico: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (field: keyof ConfigForm) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar as configurações.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabStyle = (tab: typeof activeTab) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
      activeTab === tab
        ? 'bg-primary text-white'
        : 'hover:bg-gray-100'
    }`;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Configurações</h1>
      
      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'pessoal' ? 'default' : 'outline'}
          onClick={() => setActiveTab('pessoal')}
        >
          <User className="w-4 h-4 mr-2" />
          Pessoal
        </Button>
        <Button
          variant={activeTab === 'empresa' ? 'default' : 'outline'}
          onClick={() => setActiveTab('empresa')}
        >
          <Building2 className="w-4 h-4 mr-2" />
          Empresa
        </Button>
        <Button
          variant={activeTab === 'notificacoes' ? 'default' : 'outline'}
          onClick={() => setActiveTab('notificacoes')}
        >
          <Bell className="w-4 h-4 mr-2" />
          Notificações
        </Button>
        <Button
          variant={activeTab === 'seguranca' ? 'default' : 'outline'}
          onClick={() => setActiveTab('seguranca')}
        >
          <Lock className="w-4 h-4 mr-2" />
          Segurança
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {activeTab === 'pessoal' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Informações Pessoais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="nome" className="text-sm font-medium">
                  Nome Completo
                </label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Digite seu nome completo"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Digite seu email"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="telefone" className="text-sm font-medium">
                  Telefone
                </label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="Digite seu telefone"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="cargo" className="text-sm font-medium">
                  Cargo
                </label>
                <Input
                  id="cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  placeholder="Digite seu cargo"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'empresa' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Informações da Empresa</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="razaoSocial" className="text-sm font-medium">
                  Razão Social
                </label>
                <Input
                  id="razaoSocial"
                  name="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={handleInputChange}
                  placeholder="Digite a razão social"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="cnpj" className="text-sm font-medium">
                  CNPJ
                </label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                  placeholder="Digite o CNPJ"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="endereco" className="text-sm font-medium">
                  Endereço
                </label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  placeholder="Digite o endereço"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="telefoneEmpresa" className="text-sm font-medium">
                  Telefone da Empresa
                </label>
                <Input
                  id="telefoneEmpresa"
                  name="telefoneEmpresa"
                  value={formData.telefoneEmpresa}
                  onChange={handleInputChange}
                  placeholder="Digite o telefone da empresa"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notificacoes' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Preferências de Notificação</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notificações por Email</h3>
                <p className="text-sm text-gray-500">Receba atualizações importantes por email</p>
              </div>
              <Switch
                checked={formData.notificacoesEmail}
                onCheckedChange={() => handleSwitchChange('notificacoesEmail')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notificações Push</h3>
                <p className="text-sm text-gray-500">Receba notificações em tempo real</p>
              </div>
              <Switch
                checked={formData.notificacoesPush}
                onCheckedChange={() => handleSwitchChange('notificacoesPush')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Lembretes Diários</h3>
                <p className="text-sm text-gray-500">Receba um resumo diário das suas obrigações</p>
              </div>
              <Switch
                checked={formData.lembretesDiarios}
                onCheckedChange={() => handleSwitchChange('lembretesDiarios')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Relatórios Semanais</h3>
                <p className="text-sm text-gray-500">Receba relatórios semanais de atividades</p>
              </div>
              <Switch
                checked={formData.relatoriosSemanais}
                onCheckedChange={() => handleSwitchChange('relatoriosSemanais')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Alertas de Vencimento</h3>
                <p className="text-sm text-gray-500">Seja notificado sobre obrigações próximas do vencimento</p>
              </div>
              <Switch
                checked={formData.alertasVencimento}
                onCheckedChange={() => handleSwitchChange('alertasVencimento')}
              />
            </div>
          </div>
        )}

        {activeTab === 'seguranca' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Configurações de Segurança</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Autenticação de Dois Fatores</h3>
                <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
              </div>
              <Switch
                checked={formData.autenticacaoDoisFatores}
                onCheckedChange={() => handleSwitchChange('autenticacaoDoisFatores')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notificar Login Desconhecido</h3>
                <p className="text-sm text-gray-500">Receba alertas de tentativas de login suspeitas</p>
              </div>
              <Switch
                checked={formData.notificarLoginDesconhecido}
                onCheckedChange={() => handleSwitchChange('notificarLoginDesconhecido')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Backup Automático</h3>
                <p className="text-sm text-gray-500">Mantenha seus dados seguros com backup automático</p>
              </div>
              <Switch
                checked={formData.backupAutomatico}
                onCheckedChange={() => handleSwitchChange('backupAutomatico')}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-6">
          <Button type="submit" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
} 