const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { FarmZone } = require('./Farm');

// Crop Model
const Crop = sequelize.define('Crop', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cropName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  variety: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('VEGETABLE', 'FRUIT', 'GRAIN', 'HERB', 'FLOWER', 'TREE', 'OTHER'),
    defaultValue: 'VEGETABLE'
  },
  plantingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  expectedHarvestDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  actualHarvestDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  unit: {
    type: DataTypes.STRING(20),
    defaultValue: 'kg'
  },
  status: {
    type: DataTypes.ENUM('PLANTED', 'GROWING', 'FLOWERING', 'FRUITING', 'READY_TO_HARVEST', 'HARVESTED', 'FAILED'),
    defaultValue: 'PLANTED'
  },
  growthStage: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  healthStatus: {
    type: DataTypes.ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DISEASED'),
    defaultValue: 'GOOD'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true
  },
  careInstructions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  diseases: {
    type: DataTypes.JSON,
    allowNull: true
  },
  treatments: {
    type: DataTypes.JSON,
    allowNull: true
  },
  zoneId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'farm_zones_GrowthFarm',
      key: 'id'
    }
  }
}, {
  tableName: 'crops_GrowthFarm'
});

module.exports = { Crop };
