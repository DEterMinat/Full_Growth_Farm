# Growth Farm API - Quick Start Guide

## วิธีการรัน FastAPI Server แบบง่ายๆ

### ตัวเลือกที่ 1: ใช้ Batch File (แนะนำสำหรับ Windows)
```bash
# เพียงแค่ double-click หรือรันใน Command Prompt
start-dev.bat
```

### ตัวเลือกที่ 2: ใช้ PowerShell Script  
```powershell
# รันใน PowerShell
.\start-dev.ps1
```

### ตัวเลือกที่ 3: ใช้ FastAPI CLI โดยตรง (ต้อง activate environment ก่อน)
```bash
# เปิด Command Prompt หรือ PowerShell แล้วรัน
activate-env.bat

# หลังจากนั้นจะสามารถใช้คำสั่งนี้ได้
fastapi dev app\main.py

# หรือสำหรับ production
fastapi run app\main.py
```

### ตัวเลือกที่ 4: รันด้วย Python path เต็ม
```bash
cd d:\Full_Growth_Farm\BACKEND\GrowthFarmAPI
D:\Full_Growth_Farm\.venv\Scripts\fastapi.exe dev app\main.py --port 8000
```

## การใช้งาน

เมื่อเซิร์ฟเวอร์รันแล้ว จะสามารถเข้าถึงได้ที่:

- **API Server**: http://127.0.0.1:8000
- **API Documentation (Swagger)**: http://127.0.0.1:8000/docs  
- **Alternative API Documentation (ReDoc)**: http://127.0.0.1:8000/redoc

## หมายเหตุ

- `fastapi dev` จะรันในโหมด development พร้อม auto-reload
- `fastapi run` จะรันในโหมด production
- Server จะรันที่ port 8000 โดยค่าเริ่มต้น
- ใช้ Ctrl+C เพื่อหยุดเซิร์ฟเวอร์
