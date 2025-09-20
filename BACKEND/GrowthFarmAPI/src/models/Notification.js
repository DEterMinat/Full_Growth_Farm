const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { User } = require('./User');
const { Farm } = require('./Farm');

// AI Conversation Model
const AIConversation = sequelize.define('AIConversation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sessionId: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  messageType: {
    type: DataTypes.ENUM('QUESTION', 'ADVICE', 'ANALYSIS', 'ALERT', 'GENERAL'),
    defaultValue: 'QUESTION'
  },
  context: {
    type: DataTypes.JSON,
    allowNull: true
  },
  confidence: {
    type: DataTypes.DECIMAL(4, 3),
    allowNull: true
  },
  feedback: {
    type: DataTypes.ENUM('HELPFUL', 'NEUTRAL', 'NOT_HELPFUL'),
    allowNull: true
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
  tableName: 'ai_conversations_GrowthFarm',
  updatedAt: false
});

// Notification Model
const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('INFO', 'WARNING', 'ALERT', 'SUCCESS', 'ERROR', 'REMINDER'),
    defaultValue: 'INFO'
  },
  category: {
    type: DataTypes.ENUM('SYSTEM', 'WEATHER', 'CROP', 'DEVICE', 'MARKETPLACE', 'ACTIVITY', 'AI'),
    defaultValue: 'SYSTEM'
  },
  priority: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
    defaultValue: 'MEDIUM'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  relatedEntityType: {
    type: DataTypes.ENUM('FARM', 'ZONE', 'CROP', 'DEVICE', 'ORDER', 'ACTIVITY'),
    allowNull: true
  },
  relatedEntityId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  actionRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
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
  tableName: 'notifications_GrowthFarm',
  updatedAt: false
});

// Report Model
const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reportType: {
    type: DataTypes.ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'SEASONAL', 'ANNUAL', 'CUSTOM', 'CROP_SUMMARY', 'FINANCIAL', 'PRODUCTION'),
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
  parameters: {
    type: DataTypes.JSON,
    allowNull: true
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false
  },
  generatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  periodStart: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  periodEnd: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  format: {
    type: DataTypes.ENUM('JSON', 'PDF', 'EXCEL', 'CSV'),
    defaultValue: 'JSON'
  },
  status: {
    type: DataTypes.ENUM('GENERATING', 'COMPLETED', 'FAILED'),
    defaultValue: 'COMPLETED'
  },
  fileUrl: {
    type: DataTypes.STRING(500),
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
  }
}, {
  tableName: 'reports_GrowthFarm',
  updatedAt: false
});

module.exports = { AIConversation, Notification, Report };
