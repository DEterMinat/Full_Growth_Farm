import google.generativeai as genai
import os
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class GeminiAIService:
    def __init__(self):
        # Configure Gemini API
        self.api_key = os.getenv("GEMINI_API_KEY", "AIzaSyDIMKNsHV8ibLwfSNV5Sq4b7iEb3DFmgpk")
        genai.configure(api_key=self.api_key)
        
        # Initialize the model
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Set up farming context
        self.farming_context = """
        คุณคือ AI Assistant ผู้เชี่ยวชาญด้านเกษตรกรรมและเทคโนโลยีการเกษตร สำหรับระบบ Growth Farm
        
        ความรู้ของคุณครอบคลุม:
        - การปลูกพืช การดูแลพืชผลไม้
        - เทคโนโลยี IoT และเซ็นเซอร์เกษตร
        - การวิเคราะห์ข้อมูลสภาพอากาศ
        - การจัดการฟาร์มอัจฉริยะ
        - ราคาสินค้าเกษตรและตลาด
        - การแก้ปัญหาโรคพืชและแมลงศัตรูพืช
        - การใช้ปุ่ยและสารเคมีการเกษตร
        - เทคนิคการเก็บเกี่ยวและหลังการเก็บเกี่ยว
        
        กรุณาตอบเป็นภาษาไทยที่เป็นมิตร เข้าใจง่าย และให้คำแนะนำที่เป็นประโยชน์
        """
    
    async def generate_response(self, user_message: str, conversation_history: List[Dict] = None) -> str:
        """
        Generate AI response for farming-related questions
        """
        try:
            print(f"Generating response for: {user_message}")
            print(f"API Key configured: {self.api_key[:10]}..." if self.api_key else "No API key")
            
            # Build conversation context
            context = self.farming_context + "\n\n"
            
            if conversation_history:
                context += "ประวัติการสนทนา:\n"
                for msg in conversation_history[-5:]:  # Last 5 messages for context
                    if isinstance(msg, dict) and 'type' in msg and 'text' in msg:
                        context += f"{msg['type']}: {msg['text']}\n"
            
            context += f"\nคำถามปัจจุบัน: {user_message}\n\nกรุณาตอบ:"
            
            print(f"Context length: {len(context)} characters")
            
            # Generate response
            response = self.model.generate_content(context)
            print(f"Gemini response object: {type(response)}")
            print(f"Response text available: {hasattr(response, 'text')}")
            
            if hasattr(response, 'text') and response.text:
                result = response.text.strip()
                print(f"Generated response length: {len(result)} characters")
                return result
            else:
                print("Gemini response is empty or has no text attribute")
                print(f"Response object attributes: {dir(response)}")
                return "ขออภัยครับ ไม่สามารถสร้างคำตอบได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง"
                
        except Exception as e:
            print(f"Gemini AI Error: {str(e)}")
            print(f"Error type: {type(e).__name__}")
            import traceback
            print(f"Full traceback: {traceback.format_exc()}")
            return "ขออภัยครับ เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง"
    
    async def get_weather_advice(self, weather_data: Dict) -> str:
        """
        Generate farming advice based on weather data
        """
        prompt = f"""
        ข้อมูลสภาพอากาศปัจจุบัน:
        - อุณหภูมิ: {weather_data.get('temperature', 'N/A')}°C
        - ความชื้น: {weather_data.get('humidity', 'N/A')}%
        - ปริมาณฝน: {weather_data.get('rainfall', 'N/A')}mm
        - ความเร็วลม: {weather_data.get('wind_speed', 'N/A')}km/h
        - สภาพอากาศ: {weather_data.get('condition', 'N/A')}
        
        กรุณาให้คำแนะนำการเกษตรที่เหมาะสมกับสภาพอากาศนี้
        """
        
        return await self.generate_response(prompt)
    
    async def get_crop_advice(self, crop_type: str, growth_stage: str = None) -> str:
        """
        Generate advice for specific crop type and growth stage
        """
        prompt = f"ให้คำแนะนำการดูแล{crop_type}"
        if growth_stage:
            prompt += f" ในระยะ{growth_stage}"
        
        return await self.generate_response(prompt)
    
    async def analyze_sensor_data(self, sensor_data: Dict) -> str:
        """
        Analyze IoT sensor data and provide recommendations
        """
        prompt = f"""
        ข้อมูลเซ็นเซอร์ IoT:
        - ความชื้นดิน: {sensor_data.get('soil_moisture', 'N/A')}%
        - pH ดิน: {sensor_data.get('ph_level', 'N/A')}
        - แสง: {sensor_data.get('light_intensity', 'N/A')} lux
        - อุณหภูมิดิน: {sensor_data.get('soil_temperature', 'N/A')}°C
        
        กรุณาวิเคราะห์ข้อมูลและให้คำแนะนำการปรับปรุง
        """
        
        return await self.generate_response(prompt)
    
    async def get_quick_answer(self, question_type: str) -> str:
        """
        Get quick answers for common questions
        """
        quick_responses = {
            "สภาพอากาศวันนี้": "วันนี้อากาศแจ่มใส อุณหภูมิ 28-32°C ความชื้น 65% เหมาะสำหรับการทำงานในไร่และการรดน้ำต้นไม้ครับ",
            "ราคาพืชล่าสุด": "ราคาข้าว 15,500 บาท/ตัน มันสำปะหลัง 3,200 บาท/ตัน อ้อย 1,100 บาท/ตัน (อัพเดทล่าสุด)",
            "การดูแลผลไม้": "ช่วงนี้ควรให้ปุ่ยโปแตสเซียม ตัดแต่งกิ่ง และระวังโรคราสนิม ตรวจสอบทุก 3-4 วันครับ",
            "วิเคราะห์ข้อมูล": "ผลผลิตเดือนนี้เพิ่มขึ้น 12% ต้นทุนลดลง 8% กำไรเพิ่มขึ้น 25% เทียบกับเดือนที่แล้วครับ",
            "แจ้งเตือนงาน": "งานที่ต้องทำวันนี้: รดน้ำโซน A (08:00), ตรวจสอบ IoT เซ็นเซอร์ (10:00), เก็บเกี่ยวมะม่วง (14:00)"
        }
        
        if question_type in quick_responses:
            return quick_responses[question_type]
        else:
            return await self.generate_response(question_type)

# Singleton instance
gemini_service = GeminiAIService()
