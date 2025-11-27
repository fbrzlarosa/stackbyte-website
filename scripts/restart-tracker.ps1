# Quick restart script for StackbyteStatusTracker
# This script stops the current tracker instance and starts a new one

Write-Host "[*] Restarting StackbyteStatusTracker..." -ForegroundColor Cyan

# Stop the current task
try {
    Stop-ScheduledTask -TaskName "StackbyteStatusTracker" -ErrorAction Stop
    Write-Host "[*] Task stopped successfully" -ForegroundColor Yellow
} catch {
    Write-Host "[WARNING] Task was not running or could not be stopped: $_" -ForegroundColor Yellow
}

# Wait a moment for the process to terminate
Start-Sleep -Seconds 2

# Start the task again
try {
    Start-ScheduledTask -TaskName "StackbyteStatusTracker"
    Write-Host "[SUCCESS] Tracker restarted successfully!" -ForegroundColor Green
    
    # Verify the task is running
    Start-Sleep -Seconds 1
    $taskInfo = Get-ScheduledTaskInfo -TaskName "StackbyteStatusTracker"
    $taskState = (Get-ScheduledTask -TaskName "StackbyteStatusTracker").State
    
    Write-Host "[INFO] Task state: $taskState" -ForegroundColor Cyan
} catch {
    Write-Host "[ERROR] Failed to start task: $_" -ForegroundColor Red
    Write-Host "[TIP] Make sure the task exists. Run setup-windows-autostart.ps1 if needed." -ForegroundColor Yellow
    exit 1
}

