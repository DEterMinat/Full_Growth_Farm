const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Farm, FarmZone } = require('./Farm');

// IOT Device Model
const IOTDevice = sequelize.define('IOTDevice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  deviceName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deviceType: {
    type: DataTypes.ENUM('SENSOR', 'ACTUATOR', 'CONTROLLER', 'CAMERA', 'WEATHER_STATION', 'IRRIGATION', 'OTHER'),
    defaultValue: 'SENSOR'
  },
  model: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  manufacturer: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  serialNumber: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: true
  },
  macAddress: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  firmwareVersion: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ONLINE', 'OFFLINE', 'MAINTENANCE', 'ERROR'),
    defaultValue: 'OFFLINE'
  },
  lastSeen: {
    type: DataTypes.DATE,
    allowNull: true
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
  specifications: {
    type: DataTypes.JSON,
    allowNull: true
  },
  configuration: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  installationDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  farmId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  }
}, {
  tableName: 'iot_devices_GrowthFarm'
});

// Sensor Data Model
const SensorData = sequelize.define('SensorData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sensorType: {
    type: DataTypes.ENUM('TEMPERATURE', 'HUMIDITY', 'SOIL_MOISTURE', 'PH', 'LIGHT', 'CO2', 'PRESSURE', 'WIND_SPEED', 'RAIN', 'OTHER'),
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  quality: {
    type: DataTypes.ENUM('GOOD', 'FAIR', 'POOR', 'ERROR'),
    defaultValue: 'GOOD'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  recordedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  deviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'iot_devices_GrowthFarm',
      key: 'id'
    }
  }
}, {
  tableName: 'sensor_data_GrowthFarm',
  updatedAt: false
});

module.exports = { IOTDevice, SensorData };
