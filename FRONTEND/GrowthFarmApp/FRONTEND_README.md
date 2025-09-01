# Growth Farm App - Frontend

Frontend application สำหรับระบบจัดการฟาร์ม พัฒนาด้วย React Native และ Expo

## การติดตั้งและเรียกใช้งาน

### Prerequisites
- Node.js (version 16 หรือสูงกว่า)
- npm หรือ yarn
- Expo CLI
- Android Studio หรือ Xcode (สำหรับ native development)

### การติดตั้ง

1. **Clone repository**
```bash
git clone <repository-url>
cd FRONTEND/GrowthFarmApp
```

2. **ติดตั้ง dependencies**
```bash
npm install
```

3. **เริ่มต้น development server**
```bash
npx expo start
```

## การกำหนดค่า API

### สำหรับการพัฒนา (Development)
แก้ไขไฟล์ `src/config/apiConfig.ts`:

```typescript
export const API_CONFIG = {
  DEVELOPMENT: {
    BASE_URL: 'http://localhost:8000', // สำหรับ simulator/emulator
    TIMEOUT: 10000,
  },
  
  DEVICE_DEVELOPMENT: {
    BASE_URL: 'http://192.168.1.100:8000', // สำหรับ physical device
    TIMEOUT: 10000,
  }
};
```

**หมายเหตุ:** หากทดสอบบน physical device ให้เปลี่ยน IP address ใน `DEVICE_DEVELOPMENT.BASE_URL` เป็น IP ของเครื่องคอมพิวเตอร์ที่รัน Backend server

### ตรวจสอบ IP address ของเครื่อง:
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
```

## โครงสร้างโปรเจค

```
src/
├── config/
│   └── apiConfig.ts          # การกำหนดค่า API
├── contexts/
│   └── AuthContext.tsx       # Context สำหรับ authentication
└── services/
    ├── authService.ts        # บริการสำหรับ authentication
    ├── apiClient.ts          # HTTP client
    └── farmService.ts        # บริการสำหรับฟาร์ม

app/
├── login.tsx                 # หน้า Login
├── register.tsx              # หน้า Register
├── dashboard.tsx             # หน้า Dashboard
├── profile.tsx               # หน้า Profile
└── welcome.tsx              # หน้า Welcome
```

## API Integration

### Authentication Service

แอปใช้ `authService` สำหรับจัดการ authentication:

```typescript
import authService from '../src/services/authService';

// Login
const response = await authService.login({
  username: 'user@example.com',
  password: 'password123'
});

// Register
const response = await authService.register({
  username: 'user@example.com',
  email: 'user@example.com',
  password: 'password123',
  full_name: 'John Doe',
  phone_number: '+1234567890',
  farm_name: 'My Farm'
});

// Get Profile
const user = await authService.getProfile();

// Logout
await authService.logout();
```

### หน้าจอที่มี API Integration

1. **Login (`app/login.tsx`)**
   - เชื่อมต่อกับ `/auth/login` endpoint
   - รองรับ form validation
   - จัดเก็บ JWT token

2. **Register (`app/register.tsx`)**
   - เชื่อมต่อกับ `/auth/register` endpoint
   - รองรับข้อมูลเพิ่มเติม (phone, farm_name)
   - จัดเก็บ JWT token

3. **Dashboard (`app/dashboard.tsx`)**
   - โหลดข้อมูล user profile
   - แสดงข้อมูลสถิติ
   - มีปุ่ม logout

4. **Profile (`app/profile.tsx`)**
   - แสดงข้อมูล user แบบละเอียด
   - มีปุ่ม logout

## การทดสอบ API Connection

### ตรวจสอบว่า Backend server ทำงาน:
```bash
curl http://localhost:8000/health
# หรือ
curl http://192.168.1.100:8000/health
```

### ทดสอบ Registration:
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

### ทดสอบ Login:
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=password123"
```

## Error Handling

แอปมี error handling สำหรับกรณีต่างๆ:

- **Network errors**: แสดง alert เมื่อไม่สามารถเชื่อมต่อ API
- **Authentication errors**: redirect ไปหน้า login
- **Validation errors**: แสดงข้อความ error ที่เหมาะสม

## การ Deploy

### สำหรับ Production
1. อัพเดท `API_CONFIG.PRODUCTION.BASE_URL` ใน `src/config/apiConfig.ts`
2. Build สำหรับแพลตฟอร์มที่ต้องการ:

```bash
# Android
npx expo build:android

# iOS
npx expo build:ios

# Web
npx expo build:web
```

## Troubleshooting

### ปัญหาการเชื่อมต่อ API
1. ตรวจสอบว่า Backend server ทำงานอยู่
2. ตรวจสอบ IP address ใน config
3. ตรวจสอบ firewall/network settings

### ปัญหา Authentication
1. ลบ cache ของแอป
2. ตรวจสอบ token ใน AsyncStorage
3. ตรวจสอบ Backend logs

### Debug Mode
```bash
# เปิด remote debugging
npx expo start --tunnel

# ดู logs
npx expo logs
```

## การพัฒนาต่อ

### เพิ่ม API endpoints ใหม่
1. เพิ่มฟังก์ชันใน `authService.ts`
2. อัพเดท TypeScript interfaces
3. เพิ่ม error handling

### เพิ่มหน้าจอใหม่
1. สร้างไฟล์ในโฟลเดอร์ `app/`
2. เชื่อมต่อกับ API service
3. เพิ่ม navigation logic

## API Endpoints ที่ใช้

- `POST /auth/register` - สมัครสมาชิก
- `POST /auth/login` - เข้าสู่ระบบ
- `GET /auth/profile` - ดูข้อมูล profile
- `POST /auth/logout` - ออกจากระบบ
- `GET /health` - ตรวจสอบสถานะ server

สำหรับ API documentation ละเอียด ดูที่ `BACKEND/GrowthFarmAPI/API_DOCUMENTATION.md`
