# 🌱 Growth Farm API - เอกสารภาษาไทย

## ภาพรวม
Growth Farm API เป็นระบบหลังบ้านสำหรับแอปพลิเคชันการเกษตรอัจฉริยะ ซึ่งรองรับการใช้งานภาษาไทยอย่างเต็มรูปแบบ

## URL หลัก
```
http://119.59.102.61:30007
```

## 🔐 ระบบสมาชิก (Authentication)

### สมัครสมาชิก
```http
POST /auth/th/register
```

**Body**:
```json
{
  "email": "farmer@example.com",
  "username": "farmer01",
  "password": "password123",
  "firstName": "สมชาย",
  "lastName": "เกษตรกร",
  "phoneNumber": "081-234-5678"
}
```

**Response สำเร็จ**:
```json
{
  "success": true,
  "message": "สมัครสมาชิกสำเร็จ",
  "data": {
    "user": {
      "id": 1,
      "email": "farmer@example.com",
      "username": "farmer01",
      "firstName": "สมชาย",
      "lastName": "เกษตรกร",
      "role": "FARMER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "24h"
  }
}
```

### เข้าสู่ระบบ
```http
POST /auth/th/login
```

**Body**:
```json
{
  "login": "farmer@example.com",
  "password": "password123"
}
```

### ข้อมูลผู้ใช้ปัจจุบัน
```http
GET /auth/th/me
```

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### อัพเดทข้อมูลส่วนตัว
```http
PUT /auth/th/profile
```

### เปลี่ยนรหัสผ่าน
```http
PUT /auth/th/change-password
```

### ออกจากระบบ
```http
POST /auth/th/logout
```

## 🤖 ปัญญาประดิษฐ์ (AI Assistant)

### แชทกับ AI (ไม่ต้อง Authentication)
```http
POST /ai/demo/chat
```

**Body**:
```json
{
  "message": "วิธีดูแลต้นมะเขือเทศในหน้าฝนยังไง",
  "context": "เกษตรกรปลูกผักในไร่ขนาดเล็ก"
}
```

**Response**:
```json
{
  "success": true,
  "response": "ในหน้าฝนควรให้ความสำคัญกับการระบายน้ำที่ดี...",
  "conversation": {
    "id": "demo_conv_123",
    "userMessage": "วิธีดูแลต้นมะเขือเทศในหน้าฝนยังไง",
    "aiResponse": "ในหน้าฝนควรให้ความสำคัญกับการระบายน้ำที่ดี...",
    "source": "gemini-1.5-flash"
  },
  "suggestions": [
    "วิธีป้องกันโรคราเชื้อรา",
    "การใส่ปุ๋ยในหน้าฝน",
    "เทคนิคการให้น้ำที่เหมาะสม"
  ]
}
```

### คำแนะนำจาก AI (ไม่ต้อง Authentication)
```http
GET /ai/demo/recommendations?cropType=มะเขือเทศ&farmId=1
```

**Response**:
```json
{
  "success": true,
  "recommendations": [
    {
      "category": "คำแนะนำสภาพอากาศ",
      "title": "เตรียมรับมือฝนตก",
      "description": "คาดการณ์ฝนตกหนักใน 48 ชั่วโมง ควรเตรียมการระบายน้ำ",
      "priority": "สูง",
      "actionRequired": true,
      "estimatedBenefit": "ป้องกันความเสียหาย 15,000-30,000 บาท",
      "icon": "🌧️"
    }
  ]
}
```

### ประวัติการสนทนา (ไม่ต้อง Authentication)
```http
GET /ai/demo/conversations
```

### สถานะ AI
```http
GET /ai/status
```

## 📊 สุขภาพระบบ

### ตรวจสอบสถานะระบบ
```http
GET /health
```

**Response**:
```json
{
  "success": true,
  "status": "สุขภาพดี",
  "message": "ระบบทำงานปกติ",
  "services": {
    "api": "ออนไลน์",
    "database": "เชื่อมต่อแล้ว",
    "auth": "พร้อมใช้งาน",
    "ai": "พร้อมใช้งาน"
  }
}
```

## 📋 ข้อมูลตาราง

### ดูข้อมูลผู้ใช้ทั้งหมด
```http
GET /api/tables/users
```

### ดูข้อมูลฟาร์มทั้งหมด
```http
GET /api/tables/farms
```

### ดูข้อมูลพืชผลทั้งหมด
```http
GET /api/tables/crops
```

### ดูข้อมูลทุกตารางพร้อมจำนวนข้อมูล
```http
GET /api/tables/all
```

## 🔧 ตัวอย่างการใช้งาน

### 1. ทดสอบด้วย curl

**แชทกับ AI**:
```bash
curl -X POST http://119.59.102.61:30007/ai/demo/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "วิธีป้องกันแมลงศัตรูพืชในหน้าฝน",
    "context": "เกษตรกรปลูกข้าวโพด"
  }'
```

**เช็คสถานะระบบ**:
```bash
curl http://119.59.102.61:30007/health
```

### 2. ทดสอบด้วย JavaScript

```javascript
// แชทกับ AI
const chatWithAI = async (message, context) => {
  const response = await fetch('http://119.59.102.61:30007/ai/demo/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, context })
  });
  
  const data = await response.json();
  console.log('AI Response:', data.response);
};

// ใช้งาน
chatWithAI('วิธีปลูกผักในฤดูแล้ง', 'เกษตรกรมือใหม่');
```

## 📱 Response Format

### รูปแบบ Response ที่สำเร็จ
```json
{
  "success": true,
  "message": "ข้อความแสดงผลสำเร็จ",
  "data": {
    // ข้อมูลที่ต้องการ
  },
  "timestamp": "2025-09-06T10:30:00.000Z"
}
```

### รูปแบบ Response ที่มีข้อผิดพลาด
```json
{
  "success": false,
  "message": "ข้อความแสดงข้อผิดพลาด",
  "errors": [
    {
      "field": "email",
      "message": "อีเมลไม่ถูกต้อง",
      "value": "invalid-email"
    }
  ],
  "timestamp": "2025-09-06T10:30:00.000Z"
}
```

## 🚀 คุณสมบัติเด่น

- ✅ **รองรับภาษาไทยเต็มรูปแบบ**
- ✅ **Gemini 1.5 Flash AI สำหรับคำแนะนำเกษตรกรรม**
- ✅ **API Demo ที่ไม่ต้อง Authentication**
- ✅ **ระบบสมาชิกที่ปลอดภัย**
- ✅ **เอกสารและข้อความภาษาไทย**
- ✅ **Error Messages ที่เข้าใจง่าย**

## 📞 การสนับสนุน

หากมีปัญหาหรือข้อสงสัย:
1. ตรวจสอบ server logs
2. ทดสอบการเชื่อมต่อด้วย `/health` endpoint
3. ตรวจสอบ JWT Token หากใช้ endpoints ที่ต้อง authentication
4. ดู response errors สำหรับรายละเอียดเพิ่มเติม

---

**อัพเดทล่าสุด**: กันยายน 2025  
**เวอร์ชั่น API**: 1.0.0  
**ภาษา**: ไทย + English
