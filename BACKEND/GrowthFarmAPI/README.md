# 🌱 Growth Farm Express.js API

ระบบ Backend API สำหรับ Growth Farm Application พัฒนาด้วย Express.js และ Node.js

## 🚀 เทคโนโลยีที่ใช้

- **Express.js** - Node.js Web Framework
- **Sequelize** - ORM สำหรับ MySQL Database
- **JWT** - Authentication และ Authorization
- **Google Gemini AI** - AI Assistant
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
# - ข้อมูล Database
# - JWT Secret Key  
# - Google Gemini API Key (optional)

# 5. รัน development server
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
PORT=8000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=growthfarm_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Google Gemini AI (Optional)
GEMINI_API_KEY=your-gemini-api-key-here

# Weather API (Optional)
WEATHER_API_KEY=your-weather-api-key

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006,exp://192.168.1.100:8081
```

## 📊 Database Models

### User Model
- id, email, username, password
- firstName, lastName, phoneNumber
- isActive, createdAt, updatedAt

### Farm Model
- id, name, description, location
- size, farmType, isActive
- userId (foreign key)

### FarmZone Model  
- id, name, description, cropType
- size, status, farmId (foreign key)

### MarketplaceProduct Model
- id, name, description, category
- price, unit, quantity, imageUrl
- status, sellerId (foreign key)

### Order & OrderItem Models
- Order: id, orderNumber, totalAmount, status, paymentStatus
- OrderItem: quantity, price, subtotal, productId, orderId

## 🛠️ Development Commands

```bash
# Development server with auto-reload
npm run dev

# Production server
npm start

# Run tests
npm test

# Check code style (if configured)
npm run lint
```

## 📱 Integration กับ Frontend

API นี้ถูกออกแบบให้ใช้งานกับ React Native Frontend ที่มีอยู่

### API Base URL
- Development: `http://localhost:8000`
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

- Server running: http://localhost:8000
- Health check: http://localhost:8000/health
- All endpoints: http://localhost:8000 (ดู root endpoint)

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
