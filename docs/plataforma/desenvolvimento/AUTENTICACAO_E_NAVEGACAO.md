# Sistema de Autenticação e Navegação - Tributa.AI

## Visão Geral

Este documento descreve o sistema de autenticação e navegação da plataforma Tributa.AI, incluindo fluxos de trabalho, componentes principais e integrações com outros módulos do sistema.

## Sistema de Autenticação

### Componentes Principais

1. **Páginas de Autenticação**
   - `LoginPage.tsx`: Página de login com suporte a credenciais de demonstração
   - `RegisterPage.tsx`: Página de registro de novos usuários
   - `RecuperarSenhaPage.tsx`: Página para recuperação de senha

2. **Componentes de Autenticação**
   - `RegisterForm.tsx`: Formulário de registro com validação
   - `TermsAcceptance.tsx`: Componente para aceitação de termos e condições
   - `TwoFactorAuthSetup.tsx`: Configuração de autenticação de dois fatores

3. **Serviços**
   - `auth.service.ts`: Serviço que gerencia todas as operações de autenticação
   - `api.ts`: Configuração de interceptores para tokens de autenticação

### Fluxos de Autenticação

1. **Login**
   - Usuário insere credenciais (email/senha)
   - Sistema valida credenciais contra a API
   - Token JWT é armazenado em cookies seguros
   - Redirecionamento para dashboard

2. **Registro**
   - Usuário preenche formulário com dados pessoais
   - Sistema valida dados e disponibilidade de email
   - Conta é criada e email de verificação é enviado
   - Redirecionamento para dashboard ou página de confirmação

3. **Recuperação de Senha**
   - Usuário solicita recuperação com seu email
   - Sistema envia link de redefinição
   - Usuário define nova senha
   - Redirecionamento para login

4. **Autenticação de Dois Fatores**
   - Após login bem-sucedido, solicitação de código 2FA (se habilitado)
   - Usuário insere código de aplicativo autenticador ou SMS
   - Sistema valida código e completa autenticação

### Segurança

1. **Tokens JWT**
   - Access Token: Curta duração (1 hora)
   - Refresh Token: Longa duração (7 dias)
   - Armazenamento em cookies HttpOnly

2. **Proteção contra Ataques**
   - Rate limiting para tentativas de login
   - Proteção contra CSRF
   - Validação de força de senha
   - Bloqueio temporário após múltiplas falhas

3. **Permissões e Roles**
   - Sistema baseado em roles (administrador, contador, analista, consultor, cliente)
   - Permissões granulares por recurso e ação
   - Validação de permissões em nível de API e UI

## Sistema de Navegação

### Estrutura de Rotas

1. **Rotas Públicas**
   - `/`: Página inicial
   - `/login`: Login
   - `/register`: Registro
   - `/recuperar-senha`: Recuperação de senha
   - `/termos`: Termos de uso
   - `/privacidade`: Política de privacidade

2. **Rotas Protegidas**
   - `/dashboard`: Dashboard principal
   - `/dashboard/marketplace/*`: Rotas do marketplace
   - `/dashboard/recuperacao/*`: Rotas de recuperação de créditos
   - `/dashboard/tokenizacao/*`: Rotas de tokenização
   - `/dashboard/blockchain/*`: Rotas relacionadas à blockchain
   - `/dashboard/admin/*`: Rotas administrativas (acesso restrito)

### Componentes de Navegação

1. **Layout**
   - `DashboardLayout.tsx`: Layout principal do dashboard
   - `Header.tsx`: Cabeçalho com navegação e perfil
   - `Navbar.tsx`: Barra de navegação lateral

2. **Navegação Responsiva**
   - Design adaptativo para desktop, tablet e mobile
   - Menu hambúrguer para dispositivos móveis
   - Sidebar colapsável

3. **Breadcrumbs**
   - Navegação hierárquica
   - Indicação visual do caminho atual
   - Links para níveis superiores

### Experiência do Usuário

1. **Feedback Visual**
   - Indicadores de carregamento
   - Notificações toast para ações
   - Animações de transição entre páginas

2. **Persistência de Estado**
   - Memorização da última seção visitada
   - Restauração de filtros e preferências
   - Salvamento automático de rascunhos

3. **Atalhos e Acessibilidade**
   - Suporte a navegação por teclado
   - Atalhos personalizáveis
   - Conformidade com WCAG 2.1 AA

## Integração com Outros Módulos

### Carteira Digital

- Acesso rápido ao saldo e transações recentes no header
- Redirecionamento para páginas de depósito/saque
- Notificações de transações importantes

### Marketplace

- Navegação contextual baseada em itens visualizados
- Acesso rápido a favoritos e itens recentes
- Notificações de alterações em lances e ofertas

### ARIA Assistente

- Disponível globalmente em todas as páginas
- Sugestões contextuais baseadas na navegação atual
- Ajuda interativa para funcionalidades complexas

## Próximos Passos

1. **Melhorias de Desempenho**
   - Implementação de lazy loading para rotas
   - Otimização de carregamento de recursos
   - Caching inteligente de dados frequentes

2. **Expansão de Funcionalidades**
   - Autenticação via Google/Microsoft
   - Suporte a múltiplas empresas por usuário
   - Sistema de convites e colaboração

3. **Aprimoramentos de UX**
   - Tour guiado para novos usuários
   - Personalização de dashboard
   - Temas claro/escuro

---

**Última atualização**: 16/10/2024

**Responsável**: Equipe de Desenvolvimento Tributa.AI 