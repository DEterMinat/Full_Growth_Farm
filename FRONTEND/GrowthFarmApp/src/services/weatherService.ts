import apiClient from './apiClient';

// กำหนดหน้าตาของข้อมูลสภาพอากาศที่เราคาดว่าจะได้รับจาก API
export interface WeatherData {
  city: string;
  temperature: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy' | 'Windy';
  humidity: number;
  windSpeed: number;
  source?: string; // แหล่งที่มาของข้อมูล (openweathermap, database_cache, fallback)
  lastUpdated?: string; // เวลาที่อัปเดตล่าสุด
  note?: string; // หมายเหตุเพิ่มเติม
}

export const weatherService = {
  /**
   * ดึงข้อมูลสภาพอากาศปัจจุบัน
   */
  getCurrentWeather: async (): Promise<WeatherData> => {
    console.log('--- weatherService.getCurrentWeather called ---');
    
    try {
      // ทำการเรียก API ไปยัง endpoint /weather (จะได้ข้อมูลจาก OpenWeatherMap API)
      const response = await apiClient<WeatherData>('/weather');
      
      // Log ข้อมูลที่ได้รับเพื่อ debug
      console.log('Weather data received:', {
        city: response.city,
        temperature: response.temperature,
        condition: response.condition,
        source: response.source || 'unknown'
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      
      // ในกรณีที่เกิดข้อผิดพลาด ส่งข้อมูล fallback กลับไป
      const fallbackData: WeatherData = {
        city: 'ชลบุรี, ประเทศไทย',
        temperature: 30,
        condition: 'Cloudy',
        humidity: 75,
        windSpeed: 10,
        source: 'frontend_fallback',
        note: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้'
      };
      
      return fallbackData;
    }
  },

  /**
   * สร้างข้อความสถานะอากาศสำหรับแสดงใน UI
   */
  getWeatherStatusMessage: (weather: WeatherData): string => {
    if (weather.source === 'openweathermap') {
      return 'ข้อมูลล่าสุดจาก OpenWeatherMap';
    } else if (weather.source === 'database_cache') {
      return 'ข้อมูลจากแคช (API ไม่พร้อมใช้งาน)';
    } else if (weather.source === 'fallback') {
      return 'ข้อมูลตัวอย่าง';
    } else if (weather.source === 'frontend_fallback') {
      return 'ไม่สามารถเชื่อมต่อได้';
    }
    return 'ข้อมูลสภาพอากาศ';
  },

  /**
   * ตรวจสอบว่าข้อมูลเป็น real-time หรือไม่
   */
  isRealTimeData: (weather: WeatherData): boolean => {
    return weather.source === 'openweathermap';
  }
};