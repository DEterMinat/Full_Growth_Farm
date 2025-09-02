# 🛠️ การติดตั้ง Node.js สำหรับ Growth Farm Backend

## 📋 ขั้นตอนการติดตั้ง Node.js

### สำหรับ Windows

1. **ดาวน์โหลด Node.js**
   - ไปที่ https://nodejs.org/
   - ดาวน์โหลด "LTS Version" (แนะนำเวอร์ชัน 18.x หรือใหม่กว่า)

2. **ติดตั้ง Node.js**
   - รันไฟล์ติดตั้งที่ดาวน์โหลดมา
   - ทำตาม wizard การติดตั้ง
   - ตรวจสอบ checkbox "Add to PATH" 

3. **ตรวจสอบการติดตั้ง**
   ```powershell
   # เปิด PowerShell ใหม่และรันคำสั่ง
   node --version
   npm --version
   ```

### หลังจากติดตั้ง Node.js แล้ว

4. **ติดตั้ง Dependencies**
   ```bash
   cd BACKEND/GrowthFarmAPI
   npm install
   ```

5. **ตั้งค่า Environment Variables**
   ```bash
   # แก้ไขไฟล์ .env ตั้งค่า database และ API keys
   # DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
   # JWT_SECRET, GEMINI_API_KEY
   ```

6. **รัน Backend Server**
   ```bash
   # ใช้ script ที่เตรียมไว้
   dev.bat
   
   # หรือรันด้วย npm
   npm run dev
   
   # หรือรันโดยตรง
   node src/server.js
   ```

## 🔍 การตรวจสอบการทำงาน

หลังจากรัน server แล้ว ให้ทดสอบ:

- **API Health Check**: http://localhost:8000/health
- **API Root**: http://localhost:8000
- **ตรวจสอบ logs** ในหน้าต่าง terminal

## 🚨 หากมีปัญหา

### ปัญหาที่พบบ่อย:

1. **"node is not recognized"**
   - Node.js ยังไม่ได้ติดตั้ง หรือไม่อยู่ใน PATH
   - แก้ไข: ติดตั้ง Node.js ใหม่และรีสตาร์ท PowerShell

2. **"Cannot connect to database"**
   - MySQL ยังไม่รัน หรือการตั้งค่าใน .env ผิด
   - แก้ไข: ตรวจสอบ MySQL service และการตั้งค่า

3. **"Port 8000 already in use"**
   - มีโปรแกรมอื่นใช้พอร์ต 8000
   - แก้ไข: เปลี่ยนพอร์ตใน .env หรือปิดโปรแกรมที่ใช้พอร์ตนั้น

## 💡 เคล็ดลับ

- ใช้ **nodemon** สำหรับ development (จะ restart อัตโนมัติเมื่อไฟล์เปลี่ยน)
- ตรวจสอบ logs เสมอเมื่อมีปัญหา
- ใช้ **Postman** หรือ **Thunder Client** ทดสอบ API

---

**คำสั่งสำคัญที่ควรจำ:**

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# ตรวจสอบสถานะ
curl http://localhost:8000/health

# ดู logs
# จาก terminal ที่รัน server
```
