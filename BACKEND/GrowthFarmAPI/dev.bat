@echo off
echo 🌱 Growth Farm Express.js API Server
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available!
    pause
    exit /b 1
)

echo ✅ npm is available

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules\" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🚀 Starting Express.js development server...
echo 🌐 Server will be available at: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
