# 🚀 Instalação Tributa.AI - Sistema Yarn

## ⚡ Scripts Finais (Limpos)

### 📁 Scripts Disponíveis:
```
install.ps1       # 🎯 Script principal de instalação
setup-cache.ps1   # 📦 Setup inicial do cache (primeira vez)
check.ps1         # 🔍 Verificação da instalação
```

## 🎯 Como Usar

### 1️⃣ Primeira Instalação
```powershell
# Setup do cache (baixa todas as dependências - uma vez só)
.\setup-cache.ps1

# Instalar dependências
.\install.ps1
```

### 2️⃣ Instalações Futuras (Super Rápidas)
```powershell
# Instalação normal (cache primeiro)
.\install.ps1

# Instalação offline (sem internet)
.\install.ps1 -CacheOnly

# Forçar download de novas dependências
.\install.ps1 -ForceDownload

# Limpar e reinstalar
.\install.ps1 -Clean
```

### 3️⃣ Verificar Instalação
```powershell
# Verificar se tudo está funcionando
.\check.ps1
```

## 🧶 Sistema 100% Yarn

✅ **NPM removido completamente**  
✅ **Cache permanente (1.2GB)**  
✅ **Instalação offline em segundos**  
✅ **Sem conflitos de package managers**  

## 🚀 Comandos de Desenvolvimento

```powershell
# Iniciar desenvolvimento
yarn dev

# Build de produção
yarn build

# Verificar tipos
yarn type-check

# Verificar código
yarn lint
```

## 📊 O que foi Limpo

❌ **Removidos:**
- `fix-npm.ps1` (NPM não usado mais)
- `install-deps.ps1` (script antigo)
- `install-fast.ps1` (duplicado)
- `offline-install.ps1` (funcionalidade integrada)
- `check-install.ps1` (substituído por check.ps1)
- `package-lock.json` (conflito com Yarn)
- `.npmrc` (configuração NPM)

✅ **Mantidos:**
- `install.ps1` (principal)
- `setup-cache.ps1` (setup inicial)
- `check.ps1` (verificação)
- `.yarn-cache/` (cache permanente)
- `.yarnrc` (configuração Yarn)

---

**🎉 Sistema limpo e otimizado para máxima velocidade!** 