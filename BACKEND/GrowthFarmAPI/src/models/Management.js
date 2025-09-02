const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const { Farm } = require('./Farm');

// Team Member Model
const TeamMember = sequelize.define('TeamMember', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role: {
    type: DataTypes.ENUM('OWNER', 'MANAGER', 'WORKER', 'ADVISOR', 'VIEWER'),
    defaultValue: 'WORKER'
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  workSchedule: {
    type: DataTypes.JSON,
    allowNull: true
  },
  joinedDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  leftDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notes: {
    type: DataTypes.TEXT,
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users_GrowthFarm',
      key: 'id'
    }
  }
}, {
  tableName: 'team_members_GrowthFarm',
  indexes: [
    {
      unique: true,
      fields: ['farmId', 'userId']
    }
  ]
});

// Financial Record Model
const FinancialRecord = sequelize.define('FinancialRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('INCOME', 'EXPENSE', 'INVESTMENT', 'LOAN', 'GRANT', 'INSURANCE'),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('SEEDS', 'FERTILIZER', 'EQUIPMENT', 'LABOR', 'UTILITIES', 'MAINTENANCE', 'SALES', 'MARKETING', 'INSURANCE', 'TAX', 'OTHER'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'THB'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'CHECK', 'OTHER'),
    allowNull: true
  },
  receipt: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  taxDeductible: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  relatedEntityType: {
    type: DataTypes.ENUM('CROP', 'ZONE', 'DEVICE', 'ORDER', 'ACTIVITY'),
    allowNull: true
  },
  relatedEntityId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED', 'CANCELLED'),
    defaultValue: 'COMPLETED'
  },
  notes: {
    type: DataTypes.TEXT,
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users_GrowthFarm',
      key: 'id'
    }
  }
}, {
  tableName: 'financial_records_GrowthFarm'
});

module.exports = { TeamMember, FinancialRecord };
