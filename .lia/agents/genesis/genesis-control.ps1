# 🚀 GENESIS CONTROL SCRIPT - Tributa.AI
# Script PowerShell para controlar o Genesis LIA em background

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("start", "stop", "status", "restart", "logs", "health")]
    [string]$Action,
    
    [switch]$Detached,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$GenesisDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectRoot = Resolve-Path "$GenesisDir\..\..\..\"
$NodeScript = "$GenesisDir\start-genesis-background.js"
$PidFile = "$GenesisDir\status\service.pid"
$LogFile = "$GenesisDir\logs\background-service.log"
$StatusFile = "$GenesisDir\status\background-service.json"
$HealthFile = "$GenesisDir\status\health.json"

Write-Host "🚀 GENESIS CONTROL - Tributa.AI" -ForegroundColor Cyan
Write-Host "📁 Genesis Directory: $GenesisDir" -ForegroundColor Gray
Write-Host "📁 Project Root: $ProjectRoot" -ForegroundColor Gray
Write-Host ""

function Test-NodeInstalled {
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
            return $true
        }
    }
    catch {}
    
    Write-Host "❌ Node.js não encontrado. Por favor instale Node.js primeiro." -ForegroundColor Red
    return $false
}

function Test-ServiceRunning {
    if (Test-Path $PidFile) {
        try {
            $pidData = Get-Content $PidFile | ConvertFrom-Json
            $process = Get-Process -Id $pidData.pid -ErrorAction SilentlyContinue
            
            if ($process) {
                return @{
                    Running   = $true
                    PID       = $pidData.pid
                    StartTime = $pidData.startTime
                }
            }
            else {
                # PID file existe mas processo não, limpar arquivo
                Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
            }
        }
        catch {
            Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
        }
    }
    
    return @{ Running = $false }
}

function Start-GenesisService {
    Write-Host "🚀 Iniciando Genesis LIA..." -ForegroundColor Yellow
    
    $serviceStatus = Test-ServiceRunning
    if ($serviceStatus.Running) {
        Write-Host "⚠️ Genesis já está executando (PID: $($serviceStatus.PID))" -ForegroundColor Yellow
        return
    }
    
    # Verificar se Node.js está disponível
    if (-not (Test-NodeInstalled)) {
        return
    }
    
    # Criar diretórios necessários
    @("logs", "status", "tasks", "backups", "config") | ForEach-Object {
        $dir = "$GenesisDir\$_"
        if (-not (Test-Path $dir)) {
            New-Item -Path $dir -ItemType Directory -Force | Out-Null
            Write-Host "📁 Diretório criado: $_" -ForegroundColor Gray
        }
    }
    
    try {
        if ($Detached) {
            # Iniciar em background completo (detached)
            $startInfo = New-Object System.Diagnostics.ProcessStartInfo
            $startInfo.FileName = "node"
            $startInfo.Arguments = "`"$NodeScript`" start"
            $startInfo.WorkingDirectory = $ProjectRoot
            $startInfo.UseShellExecute = $false
            $startInfo.CreateNoWindow = $true
            $startInfo.RedirectStandardOutput = $true
            $startInfo.RedirectStandardError = $true
            
            $process = [System.Diagnostics.Process]::Start($startInfo)
            
            Write-Host "✅ Genesis iniciado em background (PID: $($process.Id))" -ForegroundColor Green
            Write-Host "📝 Logs: $LogFile" -ForegroundColor Gray
            Write-Host "📊 Status: $StatusFile" -ForegroundColor Gray
        }
        else {
            # Iniciar em foreground para desenvolvimento
            Write-Host "🔄 Iniciando Genesis em foreground (Ctrl+C para parar)..." -ForegroundColor Yellow
            
            Push-Location $ProjectRoot
            try {
                & node $NodeScript start
            }
            finally {
                Pop-Location
            }
        }
        
    }
    catch {
        Write-Host "❌ Erro ao iniciar Genesis: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Stop-GenesisService {
    Write-Host "🛑 Parando Genesis LIA..." -ForegroundColor Yellow
    
    $serviceStatus = Test-ServiceRunning
    if (-not $serviceStatus.Running) {
        Write-Host "⚠️ Genesis não está executando" -ForegroundColor Yellow
        return
    }
    
    try {
        # Tentar parada graceful primeiro
        Push-Location $ProjectRoot
        try {
            & node $NodeScript stop
            Start-Sleep -Seconds 2
        }
        finally {
            Pop-Location
        }
        
        # Verificar se ainda está rodando
        $serviceStatus = Test-ServiceRunning
        if ($serviceStatus.Running) {
            Write-Host "⚠️ Forçando parada do processo PID: $($serviceStatus.PID)" -ForegroundColor Yellow
            Stop-Process -Id $serviceStatus.PID -Force
        }
        
        Write-Host "✅ Genesis parado com sucesso" -ForegroundColor Green
        
    }
    catch {
        Write-Host "❌ Erro ao parar Genesis: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Show-ServiceStatus {
    Write-Host "📊 Status do Genesis LIA:" -ForegroundColor Cyan
    Write-Host ""
    
    $serviceStatus = Test-ServiceRunning
    
    if ($serviceStatus.Running) {
        Write-Host "🟢 Status: EXECUTANDO" -ForegroundColor Green
        Write-Host "🆔 PID: $($serviceStatus.PID)" -ForegroundColor Gray
        Write-Host "⏰ Iniciado em: $($serviceStatus.StartTime)" -ForegroundColor Gray
        
        # Mostrar informações detalhadas se disponível
        if (Test-Path $StatusFile) {
            try {
                $status = Get-Content $StatusFile | ConvertFrom-Json
                Write-Host "📝 Versão: $($status.version)" -ForegroundColor Gray
                Write-Host "💾 Uso de memória: $([math]::Round($status.memoryUsage.heapUsed / 1MB, 2)) MB" -ForegroundColor Gray
                Write-Host "⏱️ Uptime: $([math]::Round($status.uptime / 60, 2)) minutos" -ForegroundColor Gray
                Write-Host "📋 Última atualização: $($status.timestamp)" -ForegroundColor Gray
            }
            catch {
                Write-Host "⚠️ Erro ao ler arquivo de status detalhado" -ForegroundColor Yellow
            }
        }
    }
    else {
        Write-Host "🔴 Status: PARADO" -ForegroundColor Red
    }
    
    Write-Host ""
    
    # Mostrar saúde do sistema se disponível
    if (Test-Path $HealthFile) {
        try {
            $health = Get-Content $HealthFile | ConvertFrom-Json
            Write-Host "🏥 Saúde do Sistema:" -ForegroundColor Cyan
            Write-Host "  📊 Status: $($health.status)" -ForegroundColor Gray
            Write-Host "  🔍 Última verificação: $($health.timestamp)" -ForegroundColor Gray
            
            if ($health.checks) {
                $health.checks.PSObject.Properties | ForEach-Object {
                    $icon = if ($_.Value) { "✅" } else { "❌" }
                    Write-Host "  $icon $($_.Name): $($_.Value)" -ForegroundColor Gray
                }
            }
        }
        catch {
            Write-Host "⚠️ Erro ao ler arquivo de saúde" -ForegroundColor Yellow
        }
    }
}

function Show-ServiceLogs {
    param([int]$Lines = 50)
    
    Write-Host "📝 Logs do Genesis (últimas $Lines linhas):" -ForegroundColor Cyan
    Write-Host ""
    
    if (Test-Path $LogFile) {
        try {
            $logs = Get-Content $LogFile -Tail $Lines
            $logs | ForEach-Object {
                $line = $_
                if ($line -match "\[ERROR\]") {
                    Write-Host $line -ForegroundColor Red
                }
                elseif ($line -match "\[WARN\]") {
                    Write-Host $line -ForegroundColor Yellow
                }
                elseif ($line -match "\[SUCCESS\]") {
                    Write-Host $line -ForegroundColor Green
                }
                else {
                    Write-Host $line -ForegroundColor Gray
                }
            }
        }
        catch {
            Write-Host "❌ Erro ao ler logs: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "⚠️ Arquivo de log não encontrado: $LogFile" -ForegroundColor Yellow
    }
}

function Restart-GenesisService {
    Write-Host "🔄 Reiniciando Genesis LIA..." -ForegroundColor Yellow
    Stop-GenesisService
    Start-Sleep -Seconds 3
    Start-GenesisService
}

function Show-ServiceHealth {
    Write-Host "🏥 Verificação de Saúde do Genesis:" -ForegroundColor Cyan
    Write-Host ""
    
    # Verificar Node.js
    if (Test-NodeInstalled) {
        Write-Host "OK Node.js: OK" -ForegroundColor Green
    }
    else {
        Write-Host "ERRO Node.js: ERRO" -ForegroundColor Red
    }
    
    # Verificar arquivos essenciais
    $essentialFiles = @{
        "Script Principal" = $NodeScript
        "Genesis Real"     = "$GenesisDir\real-genesis.js"
        "Configuração"     = "$GenesisDir\config\genesis-config.json"
    }
    
    $essentialFiles.GetEnumerator() | ForEach-Object {
        if (Test-Path $_.Value) {
            Write-Host "OK $($_.Key): OK" -ForegroundColor Green
        }
        else {
            Write-Host "ERRO $($_.Key): AUSENTE" -ForegroundColor Red
        }
    }
    
    # Verificar diretórios
    $essentialDirs = @("logs", "status", "tasks", "backups", "config")
    $essentialDirs | ForEach-Object {
        $dir = "$GenesisDir\$_"
        if (Test-Path $dir) {
            Write-Host "OK Diretorio ${_}: OK" -ForegroundColor Green
        }
        else {
            Write-Host "ERRO Diretorio ${_}: AUSENTE" -ForegroundColor Red
        }
    }
    
    # Verificar status do serviço
    $serviceStatus = Test-ServiceRunning
    if ($serviceStatus.Running) {
        Write-Host "OK Servico: EXECUTANDO (PID: $($serviceStatus.PID))" -ForegroundColor Green
    }
    else {
        Write-Host "WARN Servico: PARADO" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "📊 Resumo da Verificação:" -ForegroundColor Cyan
    
    if (Test-Path $HealthFile) {
        try {
            $health = Get-Content $HealthFile | ConvertFrom-Json
            Write-Host "🏥 Última verificação automática: $($health.timestamp)" -ForegroundColor Gray
            Write-Host "📊 Status geral: $($health.status)" -ForegroundColor Gray
        }
        catch {
            Write-Host "⚠️ Não foi possível ler verificação automática" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "⚠️ Nenhuma verificação automática disponível" -ForegroundColor Yellow
    }
}

# Executar ação baseada no parâmetro
try {
    switch ($Action.ToLower()) {
        "start" { Start-GenesisService }
        "stop" { Stop-GenesisService }
        "status" { Show-ServiceStatus }
        "restart" { Restart-GenesisService }
        "logs" { Show-ServiceLogs }
        "health" { Show-ServiceHealth }
        default { 
            Write-Host "❌ Ação desconhecida: $Action" -ForegroundColor Red
            exit 1
        }
    }
}
catch {
    Write-Host "❌ Erro durante execução: $($_.Exception.Message)" -ForegroundColor Red
    if ($Verbose) {
        Write-Host "Stack trace:" -ForegroundColor Yellow
        Write-Host $_.Exception.StackTrace -ForegroundColor Gray
    }
    exit 1
}

Write-Host ""
Write-Host "✅ Operação concluída!" -ForegroundColor Green
