# Script simples para verificar status do Genesis
param([string]$Action = "status")

$GenesisDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$PidFile = "$GenesisDir\status\service.pid"
$StatusFile = "$GenesisDir\status\genesis-status.json"
$LogFile = "$GenesisDir\logs\background-service.log"

Write-Host "GENESIS LIA - Status Check" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o serviço está rodando
if (Test-Path $PidFile) {
    try {
        $pidData = Get-Content $PidFile | ConvertFrom-Json
        $process = Get-Process -Id $pidData.pid -ErrorAction SilentlyContinue
        
        if ($process) {
            Write-Host "Status: EXECUTANDO" -ForegroundColor Green
            Write-Host "PID: $($pidData.pid)" -ForegroundColor Gray
            Write-Host "Iniciado em: $($pidData.startTime)" -ForegroundColor Gray
        } else {
            Write-Host "Status: PARADO (PID file existe mas processo nao)" -ForegroundColor Yellow
            Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
        }
    } catch {
        Write-Host "Status: ERRO ao ler PID file" -ForegroundColor Red
    }
} else {
    Write-Host "Status: PARADO" -ForegroundColor Red
}

Write-Host ""

# Mostrar status detalhado se disponível
if (Test-Path $StatusFile) {
    try {
        $status = Get-Content $StatusFile | ConvertFrom-Json
        Write-Host "Detalhes do Genesis:" -ForegroundColor Cyan
        Write-Host "  Versao: $($status.version)" -ForegroundColor Gray
        Write-Host "  Status: $($status.status)" -ForegroundColor Gray
        Write-Host "  Ultima atualizacao: $($status.lastUpdate)" -ForegroundColor Gray
        Write-Host "  Tarefas completadas: $($status.tasksCompleted)" -ForegroundColor Gray
        Write-Host "  Capacidades: $($status.capabilities -join ', ')" -ForegroundColor Gray
    } catch {
        Write-Host "Erro ao ler status detalhado" -ForegroundColor Yellow
    }
}

Write-Host ""

# Mostrar últimas linhas do log se disponível
if (Test-Path $LogFile) {
    Write-Host "Ultimas 5 linhas do log:" -ForegroundColor Cyan
    try {
        $logs = Get-Content $LogFile -Tail 5
        $logs | ForEach-Object {
            Write-Host "  $_" -ForegroundColor Gray
        }
    } catch {
        Write-Host "  Erro ao ler logs" -ForegroundColor Yellow
    }
} else {
    Write-Host "Arquivo de log nao encontrado" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Para mais detalhes, verifique:" -ForegroundColor Cyan
Write-Host "  Status: $StatusFile" -ForegroundColor Gray
Write-Host "  Logs: $LogFile" -ForegroundColor Gray
Write-Host "  PID: $PidFile" -ForegroundColor Gray
