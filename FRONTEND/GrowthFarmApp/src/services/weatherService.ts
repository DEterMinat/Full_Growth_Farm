import apiClient from './apiClient';

// กำหนดหน้าตาของข้อมูลสภาพอากาศที่เราคาดว่าจะได้รับจาก API
export interface WeatherData {
  city: string;
  temperature: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy' | 'Windy';
  humidity: number;
  windSpeed: number;
}

export const weatherService = {
  /**
   * ดึงข้อมูลสภาพอากาศปัจจุบัน
   */
  getCurrentWeather: async (): Promise<WeatherData> => {
    console.log('--- weatherService.getCurrentWeather called ---');
    
    try {
      // ทำการเรียก API ไปยัง endpoint /weather
      const response = await apiClient<WeatherData>('/weather');
      return response;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // ในกรณีที่เกิดข้อผิดพลาด, เราจะโยน error ออกไปให้ UI จัดการ
      throw new Error('Unable to fetch weather data.');
    }
  },
};