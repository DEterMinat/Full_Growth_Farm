# 🌱 Growth Farm Project

ระบบจัดการฟาร์มแบบครบวงจร พัฒนาด้วย React Native (Frontend) และ FastAPI Python (Backend)

## 📂 โครงสร้างโปรเจค

```
Full_Growth_Farm/
├── FRONTEND/
│   └── GrowthFarmApp/          # React Native Expo App
│       ├── app/                # App Router (screens)
│       ├── components/         # UI Components
│       ├── src/
│       │   ├── services/       # API Services
│       │   ├── contexts/       # React Contexts
│       │   └── config/         # Configuration files
│       ├── assets/             # Images, fonts
│       └── package.json        # Dependencies
└── BACKEND/
    └── GrowthFarmAPI/          # Express.js Node.js API
        ├── src/                # Source code
        │   ├── routes/         # API endpoints
        │   ├── models/         # Database models
        │   ├── middleware/     # Custom middleware
        │   ├── controllers/    # Route controllers
        │   ├── services/       # Business logic
        │   └── config/         # Configuration files
        ├── dev.bat             # Quick start script (Windows)
        ├── dev.ps1             # Quick start script (PowerShell)
        ├── package.json        # Dependencies and scripts
        └── .env                # Environment variables
```

## 🚀 เทคโนโลยีที่ใช้

### Frontend

- **React Native with Expo** - Mobile app framework
- **TypeScript** - Type-safe JavaScript  
- **Expo Router** - File-based routing
- **Axios** - HTTP client
- **React Context** - State management

### Backend

- **Express.js** - Fast Node.js web framework
- **Sequelize** - Modern ORM for MySQL
- **JWT Authentication** - Secure user authentication
- **Google Gemini AI** - AI integration
- **MySQL** - Primary database
- **Modern ES6+** - Latest JavaScript features

## 🛠️ การติดตั้งและรันระบบ

### ✅ Prerequisites

- Node.js 18+
- MySQL 8.0+
- Git

### 🖥️ รัน Backend (Express.js) - วิธีที่ง่ายที่สุด

#### ตัวเลือกที่ 1: ใช้ Script ที่เตรียมไว้ (แนะนำ)

```bash
# เข้าไปในโฟลเดอร์ backend
cd BACKEND/GrowthFarmAPI

# รันด้วย batch file (Windows)
dev.bat

# หรือ PowerShell
.\dev.ps1
```

#### ตัวเลือกที่ 2: ใช้ npm commands

```bash
cd BACKEND/GrowthFarmAPI

# ติดตั้ง dependencies (ครั้งแรกเท่านั้น)
npm install

# รัน development server
npm run dev
```

#### ตัวเลือกที่ 3: Manual start

```bash
cd BACKEND/GrowthFarmAPI
node src/server.js
```

**🌐 เข้าถึง API ได้ที่:**

- API Server: <http://localhost:8000>
- API Documentation: <http://localhost:8000/docs>
- Alternative Docs: <http://localhost:8000/redoc>

### 📱 รัน Frontend (React Native + Expo)

#### ตัวเลือกที่ 1: Development Build (แนะนำ)

```bash
# เข้าไปในโฟลเดอร์ frontend
cd FRONTEND/GrowthFarmApp

# ติดตั้ง dependencies (ครั้งแรกเท่านั้น)
npm install

# รัน Expo development server
npx expo start
```

#### ตัวเลือกที่ 2: รันบน Simulator/Emulator

```bash
# รันบน iOS Simulator
npx expo run:ios

# รันบน Android Emulator
npx expo run:android
```

#### ตัวเลือกที่ 3: รันบนมือถือจริง

```bash
# สแกน QR Code ด้วย Expo Go app
npx expo start --tunnel
```

**📲 ติดตั้ง Expo Go:**

- iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
- Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🔧 การตั้งค่าเพิ่มเติม

### 🗄️ Database Configuration

```bash
# Copy environment file
cd BACKEND/GrowthFarmAPI
cp .env.example .env

# แก้ไขไฟล์ .env ตามต้องการ
# DATABASE_URL=mysql+pymysql://username:password@localhost/growthfarm_db
# SECRET_KEY=your-secret-key-here
```

### 🔐 Authentication Setup

ระบบรองรับ JWT Authentication:

- User registration/login
- Token-based authentication
- Protected API routes

### 🤖 AI Integration (Gemini)

```bash
# เพิ่ม Google Gemini API Key ใน .env
GEMINI_API_KEY=your-gemini-api-key
```

## 📍 API Endpoints หลัก

### 👤 Authentication

- `POST /auth/register` - สมัครสมาชิก
- `POST /auth/login` - เข้าสู่ระบบ  
- `POST /auth/logout` - ออกจากระบบ

### 🌾 Farm Management

- `GET /farms` - ดูฟาร์มทั้งหมด
- `POST /farms` - เพิ่มฟาร์มใหม่
- `PUT /farms/{id}` - อัปเดตฟาร์ม
- `DELETE /farms/{id}` - ลบฟาร์ม

### 🛒 Marketplace

- `GET /marketplace/products` - ดูสินค้าทั้งหมด
- `POST /marketplace/products` - เพิ่มสินค้า
- `GET /marketplace/orders` - ดูคำสั่งซื้อ

### 🌤️ Weather

- `GET /weather` - ดูสภาพอากาศ 5 วัน

### 🤖 AI Assistant

- `POST /ai/chat` - แชทกับ AI

### 💊 Health Check

- `GET /health` - ตรวจสอบสถานะ API

## ⚡ การใช้งานแบบ Quick Start

### 🚀 เริ่มต้นใช้งาน (5 นาที)

```bash
# 1. Clone repository
git clone https://github.com/DEterMinat/Full_Growth_Farm.git
cd Full_Growth_Farm

# 2. เริ่ม Backend
cd BACKEND/GrowthFarmAPI
dev.bat  # หรือ .\dev.ps1

# 3. เริ่ม Frontend (เปิด terminal ใหม่)
cd FRONTEND/GrowthFarmApp
npm install
npx expo start
```

### 📱 สำหรับการใช้งานบนมือถือจริง

1. **Android**: เปลี่ยน API base URL ใน `src/config/apiConfig.ts`:

   ```typescript
   export const API_BASE_URL = 'http://YOUR_COMPUTER_IP:8000';
   ```

2. **iOS**: ใช้ `localhost:8000` ได้เลย

## 🎯 Features ปัจจุบัน

### ✅ ที่ใช้งานได้แล้ว

- 🔐 ระบบ Authentication (JWT)
- 🌾 จัดการฟาร์มและโซนปลูก
- 🛒 ระบบ Marketplace
- 🌤️ การพยากรณ์อากาศ
- 🤖 AI Assistant (Google Gemini)
- 📊 Dashboard และ Analytics
- 📱 Responsive Mobile UI
- 🔄 Real-time data synchronization

### 🚧 กำลังพัฒนา

- 📊 IoT Device Integration
- 🔔 Push Notifications
- 📈 Advanced Analytics
- 🌱 Crop Planning System
- 👥 Team Collaboration
- 📷 Image Recognition

## 🛠️ เครื่องมือการพัฒนา

### Backend Development

```bash
# ติดตั้ง development dependencies
npm install

# รัน tests
npm test

# รัน development server
npm run dev

# ตรวจสอบ API health
curl http://localhost:8000/health
```

### Frontend Development

```bash
# Type checking
npx tsc --noEmit

# Linting
npx expo lint

# Build for production
npx expo build:android
npx expo build:ios
```

## 📚 เอกสารเพิ่มเติม

- [Backend API Documentation](BACKEND/GrowthFarmAPI/API_DOCUMENTATION.md)
- [Frontend Development Guide](FRONTEND/GrowthFarmApp/FRONTEND_README.md)
- [Database Migration Guide](BACKEND/GrowthFarmAPI/MIGRATION_SUMMARY.md)
- [Quick Start Guide](BACKEND/GrowthFarmAPI/QUICK_START.md)

## 🤝 การมีส่วนร่วม

1. Fork repository นี้
2. สร้าง feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

## 📄 License

โปรเจคนี้อยู่ภายใต้ MIT License - ดูรายละเอียดใน [LICENSE](LICENSE) file

## 📞 ติดต่อและสนับสนุน

- 🐛 รายงานปัญหา: [GitHub Issues](https://github.com/DEterMinat/Full_Growth_Farm/issues)
- 💬 คำถาม: [GitHub Discussions](https://github.com/DEterMinat/Full_Growth_Farm/discussions)
- 📧 Email: [project-email@example.com]

---

⭐ หากโปรเจคนี้มีประโยชน์ อย่าลืม Star ให้กับเราด้วย!

Made with ❤️ by Growth Farm Team
