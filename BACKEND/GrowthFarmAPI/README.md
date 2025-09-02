# 🌱 Growth Farm Express.js API

ระบบ Backend API สำหรับ Growth Farm Application พัฒนาด้วย Express.js และ Node.js

## 🚀 เทคโนโลยีที่ใช้

- **Express.js** - Node.js Web Framework
- **Sequelize** - ORM สำหรับ MySQL Database
- **JWT** - Authentication และ Authorization
- **Google Gemini AI** - AI Assistant พร้อม API Key
- **bcryptjs** - Password Hashing
- **Helmet** - Security Middleware
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - HTTP Request Logger

## 📦 การติดตั้ง

### ✅ ข้อกำหนดเบื้องต้น

- Node.js 18+
- MySQL 8.0+
- npm หรือ yarn

### 🛠️ วิธีการติดตั้ง

```bash
# 1. เข้าไปในโฟลเดอร์ backend
cd BACKEND/GrowthFarmAPI

# 2. ติดตั้ง dependencies
npm install

# 3. สร้างไฟล์ .env (คัดลอกจาก .env.example)
cp .env.example .env

# 4. แก้ไขการตั้งค่าในไฟล์ .env
# - ตั้งค่า Server: API_SERVER_HOST=119.59.102.61, PORT=30007
# - ข้อมูล Database: it_std6630202261
# - JWT Secret Key (มีให้แล้ว)
# - Google Gemini API Key (พร้อมใช้งาน)

# 5. ตั้งค่า Database Tables (เพิ่มขั้นตอนใหม่)
npm run db:sync
# หรือ
sync-db.bat

# 6. รัน development server
npm run dev
```

### ⚡ Quick Start

```bash
# รันด้วย batch file (Windows)
dev.bat

# หรือ PowerShell
.\dev.ps1

# หรือ npm command
npm run dev
```

## 🌐 API Endpoints

### 🔐 Authentication
```
POST   /auth/register        - สมัครสมาชิก
POST   /auth/login           - เข้าสู่ระบบ
GET    /auth/me              - ข้อมูล user ปัจจุบัน
POST   /auth/logout          - ออกจากระบบ
PUT    /auth/profile         - อัปเดต profile
PUT    /auth/password        - เปลี่ยนรหัสผ่าน
```

### 🌾 Farm Management
```
GET    /farms                - ดูฟาร์มทั้งหมด
GET    /farms/:id            - ดูฟาร์มเฉพาะ
POST   /farms                - เพิ่มฟาร์มใหม่ [Auth Required]
PUT    /farms/:id            - อัปเดตฟาร์ม [Auth Required]
DELETE /farms/:id            - ลบฟาร์ม [Auth Required]

GET    /farms/:id/zones      - ดูโซนในฟาร์ม
POST   /farms/:id/zones      - เพิ่มโซนใหม่ [Auth Required]
PUT    /farms/:id/zones/:zid - อัปเดตโซน [Auth Required]
DELETE /farms/:id/zones/:zid - ลบโซน [Auth Required]
```

### 🛒 Marketplace
```
GET    /marketplace/products         - ดูสินค้าทั้งหมด
GET    /marketplace/products/:id     - ดูสินค้าเฉพาะ
POST   /marketplace/products         - เพิ่มสินค้า [Auth Required]
PUT    /marketplace/products/:id     - อัปเดตสินค้า [Auth Required]
DELETE /marketplace/products/:id     - ลบสินค้า [Auth Required]

GET    /marketplace/orders           - ดูคำสั่งซื้อ [Auth Required]
GET    /marketplace/orders/:id       - ดูคำสั่งซื้อเฉพาะ [Auth Required]
POST   /marketplace/orders           - สั่งซื้อสินค้า [Auth Required]
PUT    /marketplace/orders/:id/status - อัปเดตสถานะ [Auth Required]
```

### 🌤️ Weather
```
GET    /weather                 - ดูสภาพอากาศปัจจุบันและพยากรณ์ 5 วัน
GET    /weather/alerts          - ดูแจ้งเตือนสภาพอากาศ
GET    /weather/recommendations - ดูคำแนะนำเกษตรตามสภาพอากาศ
```

### 🤖 AI Assistant
```
POST   /ai/chat               - แชทกับ AI [Auth Required]
GET    /ai/conversations      - ดูประวัติการสนทนา [Auth Required]
GET    /ai/recommendations    - ดูคำแนะนำจาก AI [Auth Required]
GET    /ai/status             - สถานะของ AI service
```

### 💊 Health Check
```
GET    /health               - ตรวจสอบสถานะ API และ Database
```

## 🔧 การตั้งค่า Environment Variables

```bash
# Server Configuration
PORT=30007
NODE_ENV=development
API_SERVER_HOST=119.59.102.61

# Database Configuration
DB_HOST=localhost
DB_USER=std6630202261
DB_PASSWORD=M3@zWq7L
DB_NAME=it_std6630202261
DB_PORT=3306

# JWT Configuration
JWT_SECRET=ZaRmuh+iTmjR0zCamIA0IYXP6F1hWH9UEeOgL8W7JIs=
JWT_EXPIRES_IN=24h

# Google Gemini AI
GEMINI_API_KEY=AIzaSyDIMKNsHV8ibLwfSNV5Sq4b7iEb3DFmgpk

# Weather API (Optional)
WEATHER_API_KEY=your-weather-api-key

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006,exp://192.168.1.100:8081,http://localhost:30007,http://119.59.102.61:30007
```

## 📊 Database Models

### 🗄️ ตารางฐานข้อมูล (ใช้ naming convention *_GrowthFarm)

- **users_GrowthFarm** - ข้อมูลผู้ใช้และโปรไฟล์
- **farms_GrowthFarm** - ข้อมูลฟาร์มและรายละเอียด  
- **farm_zones_GrowthFarm** - โซนในฟาร์มและการจัดการพืช
- **marketplace_products_GrowthFarm** - สินค้าในตลาดกลาง
- **orders_GrowthFarm** - คำสั่งซื้อและธุรกรรม
- **order_items_GrowthFarm** - รายการสินค้าในแต่ละคำสั่งซื้อ

### User Model
- id, email, password, firstName, lastName
- phoneNumber, profileImage, role, isActive
- createdAt, updatedAt

### Farm Model
- id, name, description, location, latitude, longitude
- size, sizeUnit, farmType, status, establishedDate
- certifications, images, contactInfo
- userId (foreign key)

### FarmZone Model  
- id, name, description, zoneType, size, sizeUnit
- currentCrop, soilType, irrigationSystem, sensors, equipment
- status, plantingDate, expectedHarvestDate
- farmId, managerId (foreign keys)

### MarketplaceProduct Model
- id, name, description, category, subcategory
- price, currency, unit, quantity, minOrderQuantity
- images, specifications, harvestDate, expirationDate
- organicCertified, location, shippingOptions
- status, viewCount, favoriteCount, sellerId (foreign key)

### Order & OrderItem Models
- Order: id, orderNumber, totalAmount, currency, status, paymentStatus
- OrderItem: quantity, unitPrice, totalPrice, specifications, productId, orderId

## 🛠️ Development Commands

```bash
# Development server with auto-reload
npm run dev

# Database synchronization (สร้าง/อัปเดตตาราง)
npm run db:sync
# หรือ
sync-db.bat    # Windows
sync-db.ps1    # PowerShell

# Check database connection
node -e "const db = require('./src/config/database'); db.authenticate().then(() => console.log('✅ Connected')).catch(err => console.error('❌ Failed:', err));"

# Production server
npm start

# Run tests (ถ้าได้ configure ไว้)
npm test

# Check code style (ถ้าได้ configure ไว้)
npm run lint
```

## 📱 Integration กับ Frontend

API นี้ถูกออกแบบให้ใช้งานกับ React Native Frontend ที่มีอยู่

### API Base URL
- Development: `http://119.59.102.61:30007`
- Production: Configure ตาม deployment

### Authentication
- ใช้ JWT Bearer Token
- Header: `Authorization: Bearer <token>`

### Response Format
```json
{
  "data": {},
  "message": "Success message",
  "error": {
    "message": "Error message",
    "status": 400
  }
}
```

## 🔒 Security Features

- **Helmet** - Security headers
- **CORS** - Configured origins
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **Input Validation** - express-validator
- **Rate Limiting** - To be implemented
- **SQL Injection Protection** - Sequelize ORM

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
# Set NODE_ENV=production in .env
npm start
```

### Docker (Optional)
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Test coverage
npm run test:coverage
```

## 📚 API Documentation

- Server running: http://119.59.102.61:30007
- Health check: http://119.59.102.61:30007/health
- All endpoints: http://119.59.102.61:30007 (ดู root endpoint)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License

---

**Made with ❤️ by Growth Farm Team**
