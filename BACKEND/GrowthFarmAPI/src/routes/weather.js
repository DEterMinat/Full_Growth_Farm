const express = require('express');
const axios = require('axios');
const router = express.Router();

// ลอง import Weather model แบบปลอดภัย
let Weather;
try {
  const weatherModel = require('../models/Weather');
  Weather = weatherModel.Weather;
  if (!Weather) {
    console.error('❌ Weather model not found in export');
    throw new Error('Weather model is undefined');
  }
  console.log('✅ Weather model loaded successfully');
} catch (error) {
  console.error('❌ Failed to load Weather model:', error.message);
  console.error('Full error:', error);
}

// Middleware ตรวจสอบว่า Weather model โหลดได้
router.use((req, res, next) => {
  if (!Weather) {
    return res.status(500).json({
      success: false,
      message: 'Weather model is not available',
      error: 'Failed to load Weather model'
    });
  }
  next();
});

// Function to map OpenWeatherMap weather codes to our conditions
const mapWeatherCondition = (weatherCode, weatherMain) => {
  switch(weatherMain.toLowerCase()) {
    case 'clear':
      return 'Sunny';
    case 'clouds':
      return 'Cloudy';
    case 'rain':
    case 'drizzle':
      return 'Rainy';
    case 'thunderstorm':
      return 'Stormy';
    case 'mist':
    case 'smoke':
    case 'haze':
    case 'dust':
    case 'fog':
    case 'sand':
    case 'ash':
    case 'squall':
    case 'tornado':
      return 'Windy';
    case 'snow':
      return 'Cloudy'; // No snow option, default to cloudy
    default:
      return 'Cloudy';
  }
};

// GET /weather - ดึงข้อมูลสภาพอากาศแบบ real-time จาก OpenWeatherMap API สำหรับชลบุรี
router.get('/', async (req, res) => {
  try {
    // ตรวจสอบว่ามี API key หรือไม่
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      console.log('No OpenWeatherMap API key found, using fallback data');
      return res.status(200).json({
        city: "ชลบุรี, ประเทศไทย",
        temperature: 31.0,
        condition: "Sunny",
        humidity: 70,
        windSpeed: 8.5,
        source: "fallback"
      });
    }

    // เรียก OpenWeatherMap API สำหรับชลบุรี ประเทศไทย
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: 'Chonburi,TH',
          appid: apiKey,
          units: 'metric',
          lang: 'th'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    const data = response.data;
    
    // แปลงข้อมูลจาก OpenWeatherMap API format เป็น format ของเรา
    const weatherData = {
      city: `${data.name}, ประเทศไทย`,
      temperature: Math.round(data.main.temp * 10) / 10,
      condition: mapWeatherCondition(data.weather[0].id, data.weather[0].main),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6 * 10) / 10, // Convert m/s to km/h
      source: "openweathermap",
      lastUpdated: new Date().toISOString()
    };

    // บันทึกข้อมูลลงฐานข้อมูลเพื่อเก็บประวัติ (optional)
    try {
      await Weather.create({
        city: weatherData.city,
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed
      });
    } catch (dbError) {
      console.log('Failed to save weather data to database:', dbError.message);
      // ไม่ throw error เพราะข้อมูลหลักมาจาก API แล้ว
    }

    res.status(200).json(weatherData);

  } catch (error) {
    console.error("Weather API Error:", error.message);
    
    // ถ้า API external ล้มเหลว ให้ลองดึงข้อมูลล่าสุดจาก database
    try {
      const latestWeather = await Weather.findOne({
        order: [['createdAt', 'DESC']]
      });

      if (latestWeather) {
        return res.status(200).json({
          ...latestWeather.dataValues,
          source: "database_cache",
          note: "ข้อมูลจากแคช เนื่องจาก API ภายนอกไม่พร้อมใช้งาน"
        });
      }
    } catch (dbError) {
      console.error("Database fallback error:", dbError.message);
    }

    // ถ้าทุกอย่างล้มเหลว ให้ส่งข้อมูล fallback
    res.status(200).json({
      city: "ชลบุรี, ประเทศไทย",
      temperature: 31.0,
      condition: "Sunny",
      humidity: 70,
      windSpeed: 8.5,
      source: "fallback",
      note: "ข้อมูลตัวอย่าง - ไม่สามารถเชื่อมต่อ API ได้"
    });
  }
});

// POST /weather - เพิ่มข้อมูลสภาพอากาศใหม่ลงในฐานข้อมูล
router.post('/', async (req, res) => {
  try {
    // ดึงข้อมูลจาก body ของ request ที่ส่งมา
    const { city, temperature, condition, humidity, windSpeed } = req.body;

    // ตรวจสอบว่าข้อมูลที่จำเป็นครบถ้วนหรือไม่
    if (!city || temperature == null || !condition || humidity == null || windSpeed == null) {
      return res.status(400).json({ message: 'Missing required fields for weather' });
    }

    // สร้าง record ใหม่ในตาราง Weather ด้วยข้อมูลที่ได้รับ
    const newWeather = await Weather.create({
      city,
      temperature,
      condition,
      humidity,
      windSpeed
    });

    // ส่งสถานะ 201 (Created) พร้อมข้อมูลที่เพิ่งสร้างกลับไป
    res.status(201).json({
      message: 'Weather data created successfully',
      data: newWeather
    });

  } catch (error) {
    console.error("Create Weather Error:", error);
    res.status(500).json({ message: 'Failed to create weather data' });
  }
});

module.exports = router;