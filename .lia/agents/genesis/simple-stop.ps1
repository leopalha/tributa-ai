# Script simples para parar o Genesis
$GenesisDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$PidFile = "$GenesisDir\status\service.pid"

Write-Host "GENESIS LIA - Parar Servico" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path $PidFile) {
    try {
        $pidData = Get-Content $PidFile | ConvertFrom-Json
        $process = Get-Process -Id $pidData.pid -ErrorAction SilentlyContinue
        
        if ($process) {
            Write-Host "Parando processo PID: $($pidData.pid)" -ForegroundColor Yellow
            Stop-Process -Id $pidData.pid -Force
            Start-Sleep -Seconds 2
            
            # Verificar se parou
            $stillRunning = Get-Process -Id $pidData.pid -ErrorAction SilentlyContinue
            if ($stillRunning) {
                Write-Host "ERRO: Processo ainda executando" -ForegroundColor Red
            }
            else {
                Write-Host "Genesis parado com sucesso" -ForegroundColor Green
                Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
            }
        }
        else {
            Write-Host "Processo ja estava parado" -ForegroundColor Yellow
            Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
        }
    }
    catch {
        Write-Host "Erro ao parar Genesis: $($_.Exception.Message)" -ForegroundColor Red
    }
}
else {
    Write-Host "Genesis nao esta executando (PID file nao encontrado)" -ForegroundColor Yellow
}

Write-Host ""
