@echo off
echo.
echo 🚀 Growth Farm API - Development Server
echo =====================================
echo.

cd /d "%~dp0"
echo 📍 Current Directory: %CD%
echo 🐍 Starting FastAPI Development Server...
echo.

REM Try fastapi dev command first
D:\Full_Growth_Farm\.venv\Scripts\fastapi.exe dev app\main.py --port 8000 --host 0.0.0.0

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ FastAPI dev command failed. Trying alternative...
    echo.
    D:\Full_Growth_Farm\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
)

echo.
echo Server stopped.
pause
