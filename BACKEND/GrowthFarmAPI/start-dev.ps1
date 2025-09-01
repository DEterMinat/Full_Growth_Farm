#!/usr/bin/env pwsh
# Growth Farm API Development Server Start Script

Write-Host "Starting Growth Farm API Development Server..." -ForegroundColor Green
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Start FastAPI development server
& "D:\Full_Growth_Farm\.venv\Scripts\fastapi.exe" dev app\main.py --port 8000 --host 127.0.0.1

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
