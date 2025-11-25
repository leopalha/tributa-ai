@echo off
echo ========================================
echo   🧠 INICIANDO SISTEMA LIA REAL
echo   Hierarquia: VOCE → LIA → 9 AGENTES
echo ========================================
echo.

REM Verifica Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado! Instale primeiro.
    pause
    exit
)

REM Configura variáveis
set OPENROUTER_API_KEY=sk-or-v1-[SUA-KEY-AQUI]
set NODE_ENV=production
set PORT=3003

echo 📋 Configuração:
echo    - Porta: %PORT%
echo    - API Key: Configurada
echo    - Modo: REAL (modificações verdadeiras)
echo.

echo 🚀 Iniciando GENESIS Enterprise System...
echo    (LIA coordenando 9 agentes reais)
echo.

REM Inicia o sistema
node genesis-enterprise-system.js

pause