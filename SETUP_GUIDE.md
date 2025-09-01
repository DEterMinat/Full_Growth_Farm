# 🔧 Setup Guide - Growth Farm Project

คู่มือการตั้งค่าระบบ Growth Farm ฉบับละเอียด

## 🚀 Quick Setup (5 นาที)

### Step 1: Clone Repository

```bash
git clone https://github.com/DEterMinat/Full_Growth_Farm.git
cd Full_Growth_Farm
```

### Step 2: Setup Backend

```bash
cd BACKEND/GrowthFarmAPI

# วิธีที่ 1: ใช้ Script (แนะนำ)
dev.bat

# วิธีที่ 2: Manual setup
pip install -r requirements.txt
fastapi dev app/main.py
```

### Step 3: Setup Frontend

```bash
# เปิด Terminal ใหม่
cd FRONTEND/GrowthFarmApp

npm install
npx expo start
```

## 🐍 Python Environment Setup

### การใช้ Virtual Environment (แนะนำ)

```bash
# สร้าง virtual environment
python -m venv .venv

# Activate environment
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# ติดตั้ง dependencies
pip install -r requirements.txt
```

### การใช้ Conda

```bash
# สร้าง conda environment
conda create -n growthfarm python=3.11
conda activate growthfarm

# ติดตั้ง dependencies
pip install -r requirements.txt
```

## 🗄️ Database Setup

### SQLite (Default - สำหรับ Development)

```bash
# ไม่ต้องตั้งค่าเพิ่มเติม ระบบจะสร้าง SQLite database อัตโนมัติ
```

### MySQL (สำหรับ Production)

```bash
# 1. ติดตั้ง MySQL Server
# 2. สร้าง database
mysql -u root -p
CREATE DATABASE growthfarm_db;

# 3. แก้ไข .env file
DATABASE_URL=mysql+pymysql://username:password@localhost/growthfarm_db
```

### PostgreSQL

```bash
# 1. ติดตั้ง PostgreSQL
# 2. สร้าง database
psql -U postgres
CREATE DATABASE growthfarm_db;

# 3. แก้ไข .env file  
DATABASE_URL=postgresql://username:password@localhost/growthfarm_db
```

## 🔐 Environment Variables

สร้างไฟล์ `.env` ใน `BACKEND/GrowthFarmAPI/`:

```bash
# Database
DATABASE_URL=sqlite:///./growthfarm.db

# Security
SECRET_KEY=your-super-secret-key-minimum-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Weather API (ถ้าต้องการ)
WEATHER_API_KEY=your-openweathermap-api-key

# Google Gemini AI
GEMINI_API_KEY=your-google-gemini-api-key

# CORS Settings
CORS_ORIGINS=["http://localhost:19006", "http://localhost:8081"]
```

### การสร้าง SECRET_KEY

```bash
# วิธีที่ 1: ใช้ Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# วิธีที่ 2: ใช้ OpenSSL
openssl rand -hex 32
```

## 📱 Mobile Development Setup

### สำหรับ Android

1. **ติดตั้ง Android Studio**
2. **ตั้งค่า Android SDK**
3. **เปิด Android Emulator**
4. **แก้ไข API URL** ใน `src/config/apiConfig.ts`:

```typescript
// สำหรับ Android Emulator
export const API_BASE_URL = 'http://10.0.2.2:8000';

// สำหรับมือถือจริง
export const API_BASE_URL = 'http://YOUR_COMPUTER_IP:8000';
```

### สำหรับ iOS

1. **ติดตั้ง Xcode** (macOS เท่านั้น)
2. **ติดตั้ง iOS Simulator**
3. **ไม่ต้องแก้ไข API URL** (ใช้ localhost:8000 ได้เลย)

### สำหรับ Physical Device

1. **ติดตั้ง Expo Go** จาก App Store/Google Play
2. **เชื่อมต่อ WiFi เดียวกัน** กับคอมพิวเตอร์
3. **แก้ไข API URL** เป็น IP ของคอมพิวเตอร์

## 🔧 Development Tools

### Backend Development

```bash
# Hot reload development
fastapi dev app/main.py

# Production server
fastapi run app/main.py

# API Documentation
# http://localhost:8000/docs (Swagger)
# http://localhost:8000/redoc (ReDoc)
```

### Frontend Development

```bash
# Development server
npx expo start

# Clear cache
npx expo start --clear

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

## 🐛 Common Issues & Solutions

### Backend Issues

**ปัญหา: ModuleNotFoundError**
```bash
# ตรวจสอบ virtual environment
pip list

# ติดตั้ง dependencies ใหม่
pip install -r requirements.txt
```

**ปัญหา: Database Connection Error**
```bash
# ตรวจสอบ DATABASE_URL ใน .env
# ตรวจสอบ database server running
```

**ปัญหา: Port already in use**
```bash
# ใช้ port อื่น
fastapi dev app/main.py --port 8001

# หรือ kill process
# Windows: netstat -ano | findstr :8000
# Kill: taskkill /PID <PID> /F
```

### Frontend Issues

**ปัญหา: Network Error**
```bash
# ตรวจสอบ API URL ใน src/config/apiConfig.ts
# ตรวจสอบ Backend server running
# ตรวจสอบ firewall/antivirus
```

**ปัญหา: Expo CLI Error**
```bash
# อัปเดต Expo CLI
npm install -g @expo/cli

# Clear cache
npx expo start --clear
```

**ปัญหา: Metro bundler Error**
```bash
# Reset Metro cache
npx expo start --clear

# Reset npm cache
npm start -- --reset-cache
```

## 🔄 Update & Maintenance

### อัปเดต Dependencies

```bash
# Backend
pip install -r requirements.txt --upgrade

# Frontend
npm update
npx expo install --fix
```

### Database Migration

```bash
# สำหรับการเปลี่ยน database schema
python -c "from app.database import create_tables; create_tables()"
```

## 📊 Performance Optimization

### Backend Optimization

```bash
# Use production WSGI server
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Database connection pooling (ใน .env)
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=30
```

### Frontend Optimization

```bash
# Build optimized bundle
npx expo build:android --release-channel production
npx expo build:ios --release-channel production
```

## 🚀 Deployment

### Backend Deployment

```bash
# Docker deployment
docker build -t growthfarm-api .
docker run -p 8000:8000 growthfarm-api

# Railway/Heroku deployment
# ใช้ Procfile: web: fastapi run app/main.py --port $PORT
```

### Frontend Deployment

```bash
# EAS Build (แนะนำ)
npx eas build --platform android
npx eas build --platform ios

# Submit to stores  
npx eas submit --platform android
npx eas submit --platform ios
```

---

หากมีปัญหาเพิ่มเติม กรุณาเปิด [GitHub Issue](https://github.com/DEterMinat/Full_Growth_Farm/issues) 🐛
