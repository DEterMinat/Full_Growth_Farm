const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { User } = require('./User');

const Farm = sequelize.define('Farm', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  size: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Size in hectares'
  },
  farmType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'farms_GrowthFarm'
});

const FarmZone = sequelize.define('FarmZone', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cropType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  size: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('planning', 'planted', 'growing', 'harvesting', 'fallow'),
    defaultValue: 'planning'
  },
  farmId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Farm,
      key: 'id'
    }
  }
}, {
  tableName: 'farm_zones_GrowthFarm'
});

// --- 🔽 ส่วนของ Associations ที่ซ้ำซ้อน ถูกลบออกไปจากที่นี่แล้ว 🔽 ---

module.exports = { Farm, FarmZone };