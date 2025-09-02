const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const { Farm, FarmZone } = require('./Farm');
const { Crop } = require('./Crop');

// Activity Model
const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  activityType: {
    type: DataTypes.ENUM('PLANTING', 'WATERING', 'FERTILIZING', 'PRUNING', 'HARVESTING', 'PEST_CONTROL', 'DISEASE_TREATMENT', 'SOIL_PREPARATION', 'MAINTENANCE', 'MONITORING', 'OTHER'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in minutes'
  },
  materials: {
    type: DataTypes.JSON,
    allowNull: true
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  result: {
    type: DataTypes.ENUM('SUCCESS', 'PARTIAL', 'FAILED', 'PENDING'),
    defaultValue: 'PENDING'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true
  },
  weatherConditions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users_GrowthFarm',
      key: 'id'
    }
  },
  farmId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'farms_GrowthFarm',
      key: 'id'
    }
  },
  zoneId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'farm_zones_GrowthFarm',
      key: 'id'
    }
  },
  cropId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'crops_GrowthFarm',
      key: 'id'
    }
  }
}, {
  tableName: 'activities_GrowthFarm'
});

// Weather Data Model
const WeatherData = sequelize.define('WeatherData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  location: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  temperature: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  humidity: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  pressure: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: true
  },
  windSpeed: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true
  },
  windDirection: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 360
    }
  },
  rainfall: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  visibility: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true
  },
  uvIndex: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  cloudCover: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  weatherCondition: {
    type: DataTypes.ENUM('CLEAR', 'PARTLY_CLOUDY', 'CLOUDY', 'OVERCAST', 'RAIN', 'HEAVY_RAIN', 'STORM', 'FOG', 'SNOW'),
    allowNull: true
  },
  recordedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  source: {
    type: DataTypes.ENUM('API', 'WEATHER_STATION', 'SENSOR', 'MANUAL'),
    defaultValue: 'API'
  },
  farmId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'farms_GrowthFarm',
      key: 'id'
    }
  }
}, {
  tableName: 'weather_data_GrowthFarm',
  updatedAt: false
});

module.exports = { Activity, WeatherData };
