@echo off
echo ======================================
echo   GENESIS Enterprise System v4.1
echo   Iniciando Backend de Agentes IA
echo ======================================
echo.

cd .lia\agents\genesis

echo Verificando dependencias...
if not exist "node_modules\" (
    echo Instalando dependencias...
    call npm install
)

echo.
echo Iniciando GENESIS na porta 3003...
echo.
echo Aguarde mensagens:
echo   - Genesis Enterprise System inicializado
echo   - ARIA ativado
echo   - HTTP Server rodando na porta 3003
echo.
echo ======================================
echo.

node genesis-enterprise-system.js
