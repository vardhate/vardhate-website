# VARDHATE OS - Portable Frontend Launcher
# Automatically downloads portable Node.js if missing, installs dependencies, and runs the dev server.

$ErrorActionPreference = "Stop"

# Create tools directory
if (-not (Test-Path "tools")) {
    New-Item -ItemType Directory -Path "tools" | Out-Null
}

# 1. Setup Portable Node.js
if (-not (Test-Path "tools\node\node.exe")) {
    Write-Host "Downloading portable Node.js 20 (approx. 30MB)..." -ForegroundColor Cyan
    $nodeUrl = "https://nodejs.org/dist/v20.9.0/node-v20.9.0-win-x64.zip"
    Invoke-WebRequest -Uri $nodeUrl -OutFile "tools\node.zip"
    
    Write-Host "Extracting Node.js..." -ForegroundColor Cyan
    Expand-Archive -Path "tools\node.zip" -DestinationPath "tools" -Force
    if (Test-Path "tools\node-v20.9.0-win-x64") {
        Rename-Item -Path "tools\node-v20.9.0-win-x64" -NewName "node" -Force
    }
    Remove-Item "tools\node.zip" -Force
}

Write-Host "Runtimes are verified." -ForegroundColor Green

# Add tools to process PATH
$currentDir = Get-Location
$env:PATH = "$currentDir\tools\node;$env:PATH"

# 2. Install React Dependencies
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    Set-Location frontend
    Start-Process -FilePath "..\tools\node\npm.cmd" -ArgumentList "install" -NoNewWindow -Wait
    Set-Location ..
}

# 3. Start React Dev Server
Write-Host "Starting React Frontend Server..." -ForegroundColor Green
Set-Location frontend
Start-Process -FilePath "..\tools\node\npm.cmd" -ArgumentList "run", "dev" -NoNewWindow
Set-Location ..

