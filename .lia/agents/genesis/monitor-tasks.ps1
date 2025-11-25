# Monitor de Tarefas do Genesis LIA
param([int]$Seconds = 30)

$GenesisDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$TaskQueueFile = "$GenesisDir\tasks\task-queue.json"
$LogFile = "$GenesisDir\logs\background-service.log"

Write-Host "GENESIS TASK MONITOR - Monitorando por $Seconds segundos" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

$startTime = Get-Date
$endTime = $startTime.AddSeconds($Seconds)

while ((Get-Date) -lt $endTime) {
    Clear-Host
    Write-Host "GENESIS TASK MONITOR - $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Cyan
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Ler fila de tarefas
    if (Test-Path $TaskQueueFile) {
        try {
            $taskQueue = Get-Content $TaskQueueFile | ConvertFrom-Json
            
            Write-Host "RESUMO DAS TAREFAS:" -ForegroundColor Yellow
            Write-Host ""
            
            $completed = @($taskQueue.tasks | Where-Object { $_.status -eq "completed" })
            $executing = @($taskQueue.tasks | Where-Object { $_.status -eq "executing" })
            $pending = @($taskQueue.tasks | Where-Object { $_.status -eq "pending" })
            $failed = @($taskQueue.tasks | Where-Object { $_.status -eq "failed" })
            
            Write-Host "  Completadas: $($completed.Count)" -ForegroundColor Green
            Write-Host "  Executando:  $($executing.Count)" -ForegroundColor Yellow  
            Write-Host "  Pendentes:   $($pending.Count)" -ForegroundColor Cyan
            Write-Host "  Falharam:    $($failed.Count)" -ForegroundColor Red
            Write-Host ""
            
            # Mostrar tarefas em execução
            if ($executing.Count -gt 0) {
                Write-Host "TAREFAS EM EXECUCAO:" -ForegroundColor Yellow
                foreach ($task in $executing) {
                    $elapsed = ""
                    if ($task.startTime) {
                        $start = [DateTime]::Parse($task.startTime)
                        $elapsed = " ($(((Get-Date) - $start).TotalMinutes.ToString('F1')) min)"
                    }
                    Write-Host "  - $($task.type): $($task.description)$elapsed" -ForegroundColor Gray
                }
                Write-Host ""
            }
            
            # Mostrar últimas tarefas completadas
            if ($completed.Count -gt 0) {
                Write-Host "ULTIMAS COMPLETADAS:" -ForegroundColor Green
                $recentCompleted = $completed | Sort-Object { [DateTime]::Parse($_.endTime) } -Descending | Select-Object -First 3
                foreach ($task in $recentCompleted) {
                    $duration = ""
                    if ($task.startTime -and $task.endTime) {
                        $start = [DateTime]::Parse($task.startTime)
                        $end = [DateTime]::Parse($task.endTime)
                        $duration = " ($(($end - $start).TotalMinutes.ToString('F1')) min)"
                    }
                    $icon = if ($task.success) { "OK" } else { "ERRO" }
                    Write-Host "  $icon $($task.type): $($task.description)$duration" -ForegroundColor Gray
                }
                Write-Host ""
            }
            
        }
        catch {
            Write-Host "Erro ao ler fila de tarefas: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    # Mostrar últimas linhas do log
    if (Test-Path $LogFile) {
        Write-Host "ULTIMAS ATIVIDADES:" -ForegroundColor Cyan
        try {
            $logs = Get-Content $LogFile -Tail 5
            foreach ($log in $logs) {
                $line = $log -replace '\[.*?\]', ''
                Write-Host "  $line" -ForegroundColor Gray
            }
        }
        catch {
            Write-Host "  Erro ao ler logs" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    $remaining = ($endTime - (Get-Date)).TotalSeconds
    Write-Host "Atualizando em 3 segundos... (restam $([math]::Max(0, [math]::Round($remaining))) seg)" -ForegroundColor DarkGray
    
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host "Monitoramento concluido!" -ForegroundColor Green
