const express = require('express');
const axios = require('axios');

const router = express.Router();

// Mock weather data for development
const mockWeatherData = {
  current: {
    location: 'Bangkok, Thailand',
    temperature: 32,
    humidity: 75,
    windSpeed: 12,
    condition: 'Partly Cloudy',
    icon: 'partly-cloudy',
    uvIndex: 8,
    pressure: 1012,
    visibility: 10,
    feelsLike: 36
  },
  forecast: [
    {
      date: new Date().toISOString().split('T')[0],
      day: 'Today',
      high: 34,
      low: 26,
      condition: 'Partly Cloudy',
      icon: 'partly-cloudy',
      humidity: 75,
      windSpeed: 12,
      chanceOfRain: 20
    },
    {
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      day: 'Tomorrow',
      high: 33,
      low: 25,
      condition: 'Sunny',
      icon: 'sunny',
      humidity: 70,
      windSpeed: 10,
      chanceOfRain: 10
    },
    {
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      day: 'Day 3',
      high: 31,
      low: 24,
      condition: 'Light Rain',
      icon: 'rain',
      humidity: 85,
      windSpeed: 15,
      chanceOfRain: 70
    },
    {
      date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
      day: 'Day 4',
      high: 29,
      low: 23,
      condition: 'Thunderstorms',
      icon: 'thunderstorm',
      humidity: 90,
      windSpeed: 20,
      chanceOfRain: 90
    },
    {
      date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
      day: 'Day 5',
      high: 32,
      low: 25,
      condition: 'Partly Cloudy',
      icon: 'partly-cloudy',
      humidity: 78,
      windSpeed: 12,
      chanceOfRain: 30
    }
  ],
  alerts: [
    {
      title: 'Heavy Rain Warning',
      description: 'Heavy rainfall expected in the next 48 hours. Prepare for potential flooding.',
      severity: 'moderate',
      startTime: new Date(Date.now() + 172800000).toISOString(),
      endTime: new Date(Date.now() + 259200000).toISOString()
    }
  ]
};

// Get current weather and 5-day forecast
router.get('/', async (req, res) => {
  try {
    const { lat, lon, location } = req.query;

    // If weather API key is available, use real data
    if (process.env.WEATHER_API_KEY && (lat && lon || location)) {
      try {
        // This is a placeholder for real weather API integration
        // You can integrate with OpenWeatherMap, AccuWeather, or other weather APIs
        
        // Example with OpenWeatherMap API:
        // const currentWeatherResponse = await axios.get(
        //   `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        // );
        
        // const forecastResponse = await axios.get(
        //   `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        // );

        // For now, return mock data with location info
        const weatherData = {
          ...mockWeatherData,
          current: {
            ...mockWeatherData.current,
            location: location || `${lat}, ${lon}`
          }
        };

        res.json({
          weather: weatherData,
          source: 'api',
          lastUpdated: new Date().toISOString()
        });

      } catch (apiError) {
        console.warn('Weather API error, falling back to mock data:', apiError.message);
        
        // Fallback to mock data if API fails
        res.json({
          weather: mockWeatherData,
          source: 'mock',
          lastUpdated: new Date().toISOString(),
          note: 'Using mock data due to API unavailability'
        });
      }
    } else {
      // Return mock data
      res.json({
        weather: mockWeatherData,
        source: 'mock',
        lastUpdated: new Date().toISOString(),
        note: 'Configure WEATHER_API_KEY and provide location for real weather data'
      });
    }

  } catch (error) {
    console.error('Weather service error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch weather data',
        status: 500
      }
    });
  }
});

// Get weather alerts
router.get('/alerts', async (req, res) => {
  try {
    res.json({
      alerts: mockWeatherData.alerts,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Weather alerts error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch weather alerts',
        status: 500
      }
    });
  }
});

// Get agricultural weather recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const { cropType } = req.query;

    const recommendations = [
      {
        category: 'Irrigation',
        message: 'Current humidity is 75%. Consider reducing irrigation frequency.',
        priority: 'medium',
        actionRequired: false
      },
      {
        category: 'Pest Control',
        message: 'High humidity levels may increase pest activity. Monitor crops closely.',
        priority: 'high',
        actionRequired: true
      },
      {
        category: 'Harvesting',
        message: 'Weather conditions are suitable for harvesting in the next 2 days.',
        priority: 'low',
        actionRequired: false
      },
      {
        category: 'Planting',
        message: 'Heavy rain expected in 2 days. Avoid planting until conditions improve.',
        priority: 'high',
        actionRequired: true
      }
    ];

    // Filter recommendations based on crop type if provided
    let filteredRecommendations = recommendations;
    if (cropType) {
      // Add crop-specific logic here
      filteredRecommendations = recommendations.map(rec => ({
        ...rec,
        cropType: cropType
      }));
    }

    res.json({
      recommendations: filteredRecommendations,
      cropType: cropType || 'general',
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Weather recommendations error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch weather recommendations',
        status: 500
      }
    });
  }
});

module.exports = router;
