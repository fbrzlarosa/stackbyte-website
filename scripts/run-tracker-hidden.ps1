# Hidden PowerShell wrapper to run tracker in background
# This script can be used for manual testing, but the task scheduler uses run-tracker-hidden.vbs instead

$ErrorActionPreference = "SilentlyContinue"

# Get script directory and project root dynamically
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath
$trackerScript = Join-Path $projectRoot "scripts\tracker.js"

# Find Node.js
$nodePath = (Get-Command node -ErrorAction SilentlyContinue).Source

if (-not $nodePath) {
    Write-Host "Node.js not found" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $trackerScript)) {
    Write-Host "Tracker script not found: $trackerScript" -ForegroundColor Red
    exit 1
}

# Change to project directory and run tracker
Set-Location -LiteralPath $projectRoot
& $nodePath $trackerScript

