#!/usr/bin/env pwsh

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Growth Farm Database Synchronization" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Install Node.js dependencies
Write-Host "Installing/updating Node.js dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Choose an option:" -ForegroundColor Green
Write-Host "1. Sync database (safe - alter existing tables)" -ForegroundColor White
Write-Host "2. Reset database (force - recreate all tables)" -ForegroundColor Red  
Write-Host "3. Check database connection only" -ForegroundColor Blue
Write-Host ""

$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Running database synchronization with alter..." -ForegroundColor Yellow
        node src/scripts/sync-database.js --alter
    }
    "2" {
        Write-Host ""
        Write-Host "WARNING: This will recreate all tables and delete existing data!" -ForegroundColor Red
        $confirm = Read-Host "Are you sure? (y/N)"
        if ($confirm -eq "y" -or $confirm -eq "Y") {
            Write-Host "Running database reset with force..." -ForegroundColor Red
            node src/scripts/sync-database.js --force
        } else {
            Write-Host "Operation cancelled." -ForegroundColor Yellow
        }
    }
    "3" {
        Write-Host ""
        Write-Host "Testing database connection..." -ForegroundColor Blue
        node -e "const db = require('./src/config/database'); db.authenticate().then(() => { console.log('✅ Database connection successful!'); process.exit(0); }).catch(err => { console.error('❌ Database connection failed:', err.message); process.exit(1); });"
    }
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
