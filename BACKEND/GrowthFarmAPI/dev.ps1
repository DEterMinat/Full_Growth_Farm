# FastAPI Development Server - Quick Start
# This script works in both PowerShell and Command Prompt

Write-Host "🚀 Growth Farm API - Development Server" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Get the script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

Write-Host "📍 Current Directory: $pwd" -ForegroundColor Cyan
Write-Host "🐍 Starting FastAPI Development Server..." -ForegroundColor Yellow
Write-Host ""

# Start the FastAPI development server
try {
    & "D:\Full_Growth_Farm\.venv\Scripts\fastapi.exe" dev app\main.py --port 8000 --host 0.0.0.0
} catch {
    Write-Host "❌ Error starting server: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Alternative commands to try:" -ForegroundColor Yellow
    Write-Host "1. D:\Full_Growth_Farm\.venv\Scripts\fastapi.exe dev app\main.py" -ForegroundColor White
    Write-Host "2. D:\Full_Growth_Farm\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
