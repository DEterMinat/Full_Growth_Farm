@echo off
cd /d "%~dp0"
echo Starting Growth Farm API Development Server...
echo.
D:\Full_Growth_Farm\.venv\Scripts\fastapi.exe dev app\main.py --port 8000 --host 127.0.0.1
pause
