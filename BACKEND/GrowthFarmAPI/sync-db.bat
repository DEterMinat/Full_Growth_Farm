@echo off
echo ===================================
echo Growth Farm Database Synchronization
echo ===================================
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
echo Installing/updating Node.js dependencies...
call npm install

echo.
echo Choose an option:
echo 1. Sync database (safe - alter existing tables)
echo 2. Reset database (force - recreate all tables)  
echo 3. Check database connection only
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Running database synchronization with alter...
    node src/scripts/sync-database.js --alter
) else if "%choice%"=="2" (
    echo.
    echo WARNING: This will recreate all tables and delete existing data!
    set /p confirm="Are you sure? (y/N): "
    if /i "%confirm%"=="y" (
        echo Running database reset with force...
        node src/scripts/sync-database.js --force
    ) else (
        echo Operation cancelled.
    )
) else if "%choice%"=="3" (
    echo.
    echo Testing database connection...
    node -e "const db = require('./src/config/database'); db.authenticate().then(() => { console.log('✅ Database connection successful!'); process.exit(0); }).catch(err => { console.error('❌ Database connection failed:', err.message); process.exit(1); });"
) else (
    echo Invalid choice. Please run the script again.
)

echo.
echo Press any key to continue...
pause >nul
