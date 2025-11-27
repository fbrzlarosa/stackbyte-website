# PowerShell script to configure automatic startup of the tracker on Windows
# Run this script as Administrator

$ErrorActionPreference = "Stop"

Write-Host "[*] Configuring automatic startup for Status Tracker..." -ForegroundColor Cyan

# Get the absolute path of the script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath
$trackerScript = Join-Path $projectRoot "scripts\tracker.js"
$nodePath = (Get-Command node -ErrorAction SilentlyContinue).Source

if (-not $nodePath) {
    Write-Host "[ERROR] Node.js not found in PATH. Make sure Node.js is installed." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $trackerScript)) {
    Write-Host "[ERROR] tracker.js script not found: $trackerScript" -ForegroundColor Red
    exit 1
}

Write-Host "[*] Project path: $projectRoot" -ForegroundColor Yellow
Write-Host "[*] Node.js path: $nodePath" -ForegroundColor Yellow
Write-Host "[*] Tracker script: $trackerScript" -ForegroundColor Yellow

# Task name
$taskName = "StackbyteStatusTracker"

# Remove existing task if present
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "[*] Removing existing task..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# Create the action (command to execute)
$action = New-ScheduledTaskAction -Execute $nodePath -Argument "`"$trackerScript`"" -WorkingDirectory $projectRoot

# Create the trigger (at startup)
$trigger = New-ScheduledTaskTrigger -AtStartup

# Create settings
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable

# Create principal (run as current user)
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Highest

# Register the task
try {
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Automatically starts Stackbyte Status Tracker on system startup" | Out-Null
    Write-Host "[SUCCESS] Task scheduled successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "[INFO] Task details:" -ForegroundColor Cyan
    Write-Host "   Name: $taskName" -ForegroundColor White
    Write-Host "   Trigger: At system startup" -ForegroundColor White
    Write-Host "   Script: $trackerScript" -ForegroundColor White
    Write-Host ""
    Write-Host "[TIP] To manage the task:" -ForegroundColor Yellow
    Write-Host "   - Open Task Scheduler (taskschd.msc)" -ForegroundColor White
    Write-Host "   - Search for '$taskName' in the library" -ForegroundColor White
    Write-Host "   - You can enable/disable or modify the task" -ForegroundColor White
    Write-Host ""
    Write-Host "[TIP] To test immediately:" -ForegroundColor Yellow
    Write-Host "   Start-ScheduledTask -TaskName '$taskName'" -ForegroundColor White
} catch {
    Write-Host "[ERROR] Error creating task: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "[TIP] Make sure to run this script as Administrator:" -ForegroundColor Yellow
    Write-Host "   Right-click PowerShell > Run as administrator" -ForegroundColor White
    exit 1
}

