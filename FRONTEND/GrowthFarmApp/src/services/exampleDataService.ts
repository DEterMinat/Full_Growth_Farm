// Example data service for guest/demo mode
export interface ExampleCrop {
  id: number;
  name: string;
  type: string;
  plantedDate: string;
  harvestDate: string;
  status: string;
  health: string;
  area: number;
  location: string;
  description: string;
}

export interface ExampleIOTDevice {
  id: number;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'warning';
  location: string;
  lastUpdate: string;
  batteryLevel?: number;
  temperature?: number;
  humidity?: number;
  soilMoisture?: number;
}

export interface ExampleNotification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  category: string;
  timestamp: string;
  isRead: boolean;
}

export interface ExampleFarm {
  id: number;
  name: string;
  location: string;
  totalArea: number;
  crops: ExampleCrop[];
  devices: ExampleIOTDevice[];
  description: string;
}

class ExampleDataService {
  // Example Farms Data
  private exampleFarms: ExampleFarm[] = [
    {
      id: 1,
      name: 'Green Valley Farm',
      location: 'Chiang Mai, Thailand',
      totalArea: 50,
      description: 'A sustainable organic farm focusing on rice and vegetable production',
      crops: [
        {
          id: 1,
          name: 'Jasmine Rice',
          type: 'Rice',
          plantedDate: '2024-11-01',
          harvestDate: '2025-03-15',
          status: 'Growing',
          health: 'Excellent',
          area: 20,
          location: 'North Field',
          description: 'Premium jasmine rice variety with high market value'
        },
        {
          id: 2,
          name: 'Organic Tomatoes',
          type: 'Vegetable',
          plantedDate: '2024-12-01',
          harvestDate: '2025-02-28',
          status: 'Flowering',
          health: 'Good',
          area: 15,
          location: 'Greenhouse A',
          description: 'Organic cherry tomatoes for local market'
        },
        {
          id: 3,
          name: 'Thai Basil',
          type: 'Herb',
          plantedDate: '2024-12-15',
          harvestDate: '2025-01-30',
          status: 'Ready to Harvest',
          health: 'Excellent',
          area: 5,
          location: 'Herb Garden',
          description: 'Fresh Thai basil for restaurants and local market'
        }
      ],
      devices: [
        {
          id: 1,
          name: 'Weather Station A',
          type: 'Weather Monitor',
          status: 'online',
          location: 'Central Field',
          lastUpdate: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          temperature: 28.5,
          humidity: 65
        },
        {
          id: 2,
          name: 'Soil Sensor B1',
          type: 'Soil Monitor',
          status: 'online',
          location: 'North Field',
          lastUpdate: new Date(Date.now() - 180000).toISOString(), // 3 minutes ago
          soilMoisture: 72,
          batteryLevel: 85
        },
        {
          id: 3,
          name: 'Irrigation Controller',
          type: 'Water System',
          status: 'warning',
          location: 'Greenhouse A',
          lastUpdate: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
          batteryLevel: 25
        }
      ]
    },
    {
      id: 2,
      name: 'Sunrise Organic Farm',
      location: 'Nakhon Ratchasima, Thailand',
      totalArea: 75,
      description: 'Large-scale organic farming with modern IoT technology',
      crops: [
        {
          id: 4,
          name: 'Organic Corn',
          type: 'Grain',
          plantedDate: '2024-10-15',
          harvestDate: '2025-01-20',
          status: 'Mature',
          health: 'Good',
          area: 30,
          location: 'East Field',
          description: 'Sweet corn for both fresh market and processing'
        },
        {
          id: 5,
          name: 'Lettuce Varieties',
          type: 'Vegetable',
          plantedDate: '2024-12-10',
          harvestDate: '2025-01-25',
          status: 'Growing',
          health: 'Excellent',
          area: 10,
          location: 'Hydroponic House',
          description: 'Multiple lettuce varieties grown hydroponically'
        }
      ],
      devices: [
        {
          id: 4,
          name: 'Drone Monitor',
          type: 'Aerial Survey',
          status: 'online',
          location: 'Mobile',
          lastUpdate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          batteryLevel: 95
        }
      ]
    }
  ];

  // Example Notifications
  private exampleNotifications: ExampleNotification[] = [
    {
      id: 1,
      title: 'Rain Expected',
      message: '80% chance of rain in the next 6 hours. Consider adjusting irrigation schedule.',
      type: 'info',
      category: 'Weather',
      timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
      isRead: false
    },
    {
      id: 2,
      title: 'Sensor Battery Low',
      message: 'Irrigation Controller in Greenhouse A needs battery replacement (25% remaining).',
      type: 'warning',
      category: 'IoT',
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      isRead: false
    },
    {
      id: 3,
      title: 'Harvest Ready',
      message: 'Thai Basil in Herb Garden is ready for harvest. Optimal quality achieved.',
      type: 'success',
      category: 'Harvest',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      isRead: true
    },
    {
      id: 4,
      title: 'Temperature Alert',
      message: 'High temperature detected in Greenhouse A (35°C). Check ventilation system.',
      type: 'alert',
      category: 'Environment',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      isRead: true
    },
    {
      id: 5,
      title: 'Irrigation Scheduled',
      message: 'Automatic irrigation completed for North Field. Water usage: 450L.',
      type: 'info',
      category: 'Irrigation',
      timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
      isRead: true
    }
  ];

  // Get example farms
  getExampleFarms(): ExampleFarm[] {
    return this.exampleFarms;
  }

  // Get example farm by ID
  getExampleFarm(id: number): ExampleFarm | null {
    return this.exampleFarms.find(farm => farm.id === id) || null;
  }

  // Get example crops
  getExampleCrops(): ExampleCrop[] {
    return this.exampleFarms.flatMap(farm => farm.crops);
  }

  // Get example IoT devices
  getExampleIOTDevices(): ExampleIOTDevice[] {
    return this.exampleFarms.flatMap(farm => farm.devices);
  }

  // Get example notifications
  getExampleNotifications(): ExampleNotification[] {
    return this.exampleNotifications;
  }

  // Get unread notifications count
  getUnreadNotificationsCount(): number {
    return this.exampleNotifications.filter(n => !n.isRead).length;
  }

  // Mark notification as read
  markNotificationAsRead(id: number): void {
    const notification = this.exampleNotifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
  }

  // Get weather data
  getExampleWeatherData() {
    return {
      current: {
        temperature: 28.5,
        humidity: 65,
        windSpeed: 8.2,
        condition: 'Partly Cloudy',
        icon: 'partly-cloudy',
        feelsLike: 30.1,
        pressure: 1013,
        visibility: 10,
        uvIndex: 6
      },
      forecast: [
        {
          date: new Date().toISOString(),
          day: 'Today',
          high: 32,
          low: 24,
          condition: 'Partly Cloudy',
          icon: 'partly-cloudy',
          rainChance: 20
        },
        {
          date: new Date(Date.now() + 86400000).toISOString(),
          day: 'Tomorrow',
          high: 29,
          low: 22,
          condition: 'Rainy',
          icon: 'rainy',
          rainChance: 80
        },
        {
          date: new Date(Date.now() + 172800000).toISOString(),
          day: 'Saturday',
          high: 31,
          low: 23,
          condition: 'Sunny',
          icon: 'sunny',
          rainChance: 10
        },
        {
          date: new Date(Date.now() + 259200000).toISOString(),
          day: 'Sunday',
          high: 33,
          low: 25,
          condition: 'Sunny',
          icon: 'sunny',
          rainChance: 5
        },
        {
          date: new Date(Date.now() + 345600000).toISOString(),
          day: 'Monday',
          high: 30,
          low: 24,
          condition: 'Cloudy',
          icon: 'cloudy',
          rainChance: 30
        }
      ]
    };
  }

  // Get analytics data
  getExampleAnalyticsData() {
    return {
      totalFarms: 2,
      totalCrops: 5,
      totalArea: 125,
      totalDevices: 4,
      activeDevices: 3,
      offlineDevices: 0,
      warningDevices: 1,
      harvestReadyCrops: 1,
      growingCrops: 3,
      matureCrops: 1,
      avgSoilMoisture: 72,
      avgTemperature: 28.5,
      avgHumidity: 65,
      monthlyYield: 2.5, // tons
      waterUsage: 15000, // liters
      powerUsage: 450 // kWh
    };
  }
}

export const exampleDataService = new ExampleDataService();
export default exampleDataService;
