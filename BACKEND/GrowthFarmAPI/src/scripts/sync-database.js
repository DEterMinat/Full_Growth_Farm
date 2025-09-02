const { sequelize } = require('../config/database');
const User = require('../models/User');
const { Farm, FarmZone } = require('../models/Farm');
const { MarketplaceProduct, Order, OrderItem } = require('../models/Marketplace');
const { IOTDevice, SensorData } = require('../models/IOTDevice');
const { Crop } = require('../models/Crop');
const { Activity, WeatherData } = require('../models/Activity');
const { AIConversation, Notification, Report } = require('../models/Notification');
const { TeamMember, FinancialRecord } = require('../models/Management');

// Define model associations
const initializeAssociations = () => {
  // Clear any existing associations first
  User.associations = {};
  Farm.associations = {};
  FarmZone.associations = {};
  MarketplaceProduct.associations = {};
  Order.associations = {};
  OrderItem.associations = {};
  IOTDevice.associations = {};
  SensorData.associations = {};
  Crop.associations = {};
  Activity.associations = {};
  WeatherData.associations = {};
  AIConversation.associations = {};
  Notification.associations = {};
  Report.associations = {};
  TeamMember.associations = {};
  FinancialRecord.associations = {};

  // User associations
  User.hasMany(Farm, { foreignKey: 'userId', as: 'ownedFarms' });
  User.hasMany(MarketplaceProduct, { foreignKey: 'sellerId', as: 'products' });
  User.hasMany(Order, { foreignKey: 'buyerId', as: 'purchases' });
  User.hasMany(Order, { foreignKey: 'sellerId', as: 'sales' });
  User.hasMany(Activity, { foreignKey: 'userId', as: 'activities' });
  User.hasMany(AIConversation, { foreignKey: 'userId', as: 'conversations' });
  User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
  User.hasMany(Report, { foreignKey: 'userId', as: 'reports' });
  User.hasMany(TeamMember, { foreignKey: 'userId', as: 'teamMemberships' });
  User.hasMany(FinancialRecord, { foreignKey: 'userId', as: 'financialRecords' });
  User.hasMany(FarmZone, { foreignKey: 'managerId', as: 'managedZones' });

  // Farm associations
  Farm.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
  Farm.hasMany(FarmZone, { foreignKey: 'farmId', as: 'zones' });
  Farm.hasMany(IOTDevice, { foreignKey: 'farmId', as: 'devices' });
  Farm.hasMany(Activity, { foreignKey: 'farmId', as: 'farmActivities' });
  Farm.hasMany(WeatherData, { foreignKey: 'farmId', as: 'weatherData' });
  Farm.hasMany(Report, { foreignKey: 'farmId', as: 'farmReports' });
  Farm.hasMany(TeamMember, { foreignKey: 'farmId', as: 'teamMembers' });
  Farm.hasMany(FinancialRecord, { foreignKey: 'farmId', as: 'financialRecords' });

  // FarmZone associations
  FarmZone.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });
  FarmZone.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });
  FarmZone.hasMany(IOTDevice, { foreignKey: 'zoneId', as: 'zoneDevices' });
  FarmZone.hasMany(Crop, { foreignKey: 'zoneId', as: 'crops' });
  FarmZone.hasMany(Activity, { foreignKey: 'zoneId', as: 'zoneActivities' });

  // IOT Device associations
  IOTDevice.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });
  IOTDevice.belongsTo(FarmZone, { foreignKey: 'zoneId', as: 'zone' });
  IOTDevice.hasMany(SensorData, { foreignKey: 'deviceId', as: 'sensorData' });

  // Sensor Data associations
  SensorData.belongsTo(IOTDevice, { foreignKey: 'deviceId', as: 'device' });

  // Crop associations
  Crop.belongsTo(FarmZone, { foreignKey: 'zoneId', as: 'zone' });
  Crop.hasMany(Activity, { foreignKey: 'cropId', as: 'cropActivities' });

  // Activity associations
  Activity.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Activity.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });
  Activity.belongsTo(FarmZone, { foreignKey: 'zoneId', as: 'zone' });
  Activity.belongsTo(Crop, { foreignKey: 'cropId', as: 'crop' });

  // Weather Data associations
  WeatherData.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });

  // Marketplace associations
  MarketplaceProduct.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
  MarketplaceProduct.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });

  // Order associations
  Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
  Order.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });

  // OrderItem associations
  OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
  OrderItem.belongsTo(MarketplaceProduct, { foreignKey: 'productId', as: 'product' });

  // AI Conversation associations
  AIConversation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Notification associations
  Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Report associations
  Report.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Report.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });

  // Team Member associations
  TeamMember.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });
  TeamMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Financial Record associations
  FinancialRecord.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });
  FinancialRecord.belongsTo(User, { foreignKey: 'userId', as: 'user' });
};

// Sync database function
const syncDatabase = async (options = {}) => {
  try {
    console.log('🔄 Starting database synchronization...');
    
    // Initialize model associations
    initializeAssociations();

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync all models
    const syncOptions = {
      force: options.force || false, // Set to true to recreate tables
      alter: options.alter || true,  // Set to true to alter existing tables
      ...options
    };

    await sequelize.sync(syncOptions);
    
    console.log('✅ Database synchronized successfully!');
    console.log('\n📊 Created/Updated Tables:');
    console.log('  ✅ users_GrowthFarm');
    console.log('  ✅ farms_GrowthFarm');
    console.log('  ✅ farm_zones_GrowthFarm');
    console.log('  ✅ marketplace_products_GrowthFarm');
    console.log('  ✅ orders_GrowthFarm');
    console.log('  ✅ order_items_GrowthFarm');
    console.log('  ✅ iot_devices_GrowthFarm');
    console.log('  ✅ sensor_data_GrowthFarm');
    console.log('  ✅ crops_GrowthFarm');
    console.log('  ✅ activities_GrowthFarm');
    console.log('  ✅ weather_data_GrowthFarm');
    console.log('  ✅ ai_conversations_GrowthFarm');
    console.log('  ✅ notifications_GrowthFarm');
    console.log('  ✅ reports_GrowthFarm');
    console.log('  ✅ team_members_GrowthFarm');
    console.log('  ✅ financial_records_GrowthFarm');

    return true;
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    throw error;
  }
};

// CLI interface for running the sync
const runSync = async () => {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const alter = args.includes('--alter');
  
  try {
    await syncDatabase({ force, alter });
    console.log('\n🎉 Database sync completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Database sync failed:', error);
    process.exit(1);
  }
};

// Export functions
module.exports = {
  syncDatabase,
  initializeAssociations
};

// Run if called directly
if (require.main === module) {
  runSync();
}
