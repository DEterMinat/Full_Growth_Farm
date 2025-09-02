const express = require('express');
const User = require('../models/User');
const { Farm, FarmZone } = require('../models/Farm');
const { MarketplaceProduct, Order, OrderItem } = require('../models/Marketplace');
const { IOTDevice, SensorData } = require('../models/IOTDevice');
const { Crop } = require('../models/Crop');
const { Activity, WeatherData } = require('../models/Activity');
const { AIConversation, Notification, Report } = require('../models/Notification');
const { TeamMember, FinancialRecord } = require('../models/Management');

const router = express.Router();

// Helper function to handle database queries
const getTableData = async (Model, options = {}) => {
  try {
    const data = await Model.findAll({
      ...options,
      order: [['createdAt', 'DESC']]
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// 1. GET /api/tables/users - Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await getTableData(User, {
      attributes: { exclude: ['password'] } // Exclude password for security
    });
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// 2. GET /api/tables/farms - Get all farms
router.get('/farms', async (req, res) => {
  try {
    const farms = await getTableData(Farm);
    res.json({
      success: true,
      count: farms.length,
      data: farms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch farms',
      error: error.message
    });
  }
});

// 3. GET /api/tables/farm-zones - Get all farm zones
router.get('/farm-zones', async (req, res) => {
  try {
    const zones = await getTableData(FarmZone);
    res.json({
      success: true,
      count: zones.length,
      data: zones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch farm zones',
      error: error.message
    });
  }
});

// 4. GET /api/tables/marketplace-products - Get all marketplace products
router.get('/marketplace-products', async (req, res) => {
  try {
    const products = await getTableData(MarketplaceProduct);
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marketplace products',
      error: error.message
    });
  }
});

// 5. GET /api/tables/orders - Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await getTableData(Order);
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// 6. GET /api/tables/order-items - Get all order items
router.get('/order-items', async (req, res) => {
  try {
    const orderItems = await getTableData(OrderItem);
    res.json({
      success: true,
      count: orderItems.length,
      data: orderItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order items',
      error: error.message
    });
  }
});

// 7. GET /api/tables/iot-devices - Get all IoT devices
router.get('/iot-devices', async (req, res) => {
  try {
    const devices = await getTableData(IOTDevice);
    res.json({
      success: true,
      count: devices.length,
      data: devices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch IoT devices',
      error: error.message
    });
  }
});

// 8. GET /api/tables/sensor-data - Get all sensor data
router.get('/sensor-data', async (req, res) => {
  try {
    const sensorData = await getTableData(SensorData);
    res.json({
      success: true,
      count: sensorData.length,
      data: sensorData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sensor data',
      error: error.message
    });
  }
});

// 9. GET /api/tables/crops - Get all crops
router.get('/crops', async (req, res) => {
  try {
    const crops = await getTableData(Crop);
    res.json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crops',
      error: error.message
    });
  }
});

// 10. GET /api/tables/activities - Get all activities
router.get('/activities', async (req, res) => {
  try {
    const activities = await getTableData(Activity);
    res.json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
      error: error.message
    });
  }
});

// 11. GET /api/tables/weather-data - Get all weather data
router.get('/weather-data', async (req, res) => {
  try {
    const weatherData = await getTableData(WeatherData);
    res.json({
      success: true,
      count: weatherData.length,
      data: weatherData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data',
      error: error.message
    });
  }
});

// 12. GET /api/tables/ai-conversations - Get all AI conversations
router.get('/ai-conversations', async (req, res) => {
  try {
    const conversations = await getTableData(AIConversation);
    res.json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch AI conversations',
      error: error.message
    });
  }
});

// 13. GET /api/tables/notifications - Get all notifications
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await getTableData(Notification);
    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
});

// 14. GET /api/tables/reports - Get all reports
router.get('/reports', async (req, res) => {
  try {
    const reports = await getTableData(Report);
    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
});

// 15. GET /api/tables/team-members - Get all team members
router.get('/team-members', async (req, res) => {
  try {
    const teamMembers = await getTableData(TeamMember);
    res.json({
      success: true,
      count: teamMembers.length,
      data: teamMembers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members',
      error: error.message
    });
  }
});

// 16. GET /api/tables/financial-records - Get all financial records
router.get('/financial-records', async (req, res) => {
  try {
    const financialRecords = await getTableData(FinancialRecord);
    res.json({
      success: true,
      count: financialRecords.length,
      data: financialRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial records',
      error: error.message
    });
  }
});

// GET /api/tables/all - Get all tables with their counts
router.get('/all', async (req, res) => {
  try {
    const tableData = {
      users: { count: await User.count(), tableName: 'users_GrowthFarm' },
      farms: { count: await Farm.count(), tableName: 'farms_GrowthFarm' },
      farmZones: { count: await FarmZone.count(), tableName: 'farm_zones_GrowthFarm' },
      marketplaceProducts: { count: await MarketplaceProduct.count(), tableName: 'marketplace_products_GrowthFarm' },
      orders: { count: await Order.count(), tableName: 'orders_GrowthFarm' },
      orderItems: { count: await OrderItem.count(), tableName: 'order_items_GrowthFarm' },
      iotDevices: { count: await IOTDevice.count(), tableName: 'iot_devices_GrowthFarm' },
      sensorData: { count: await SensorData.count(), tableName: 'sensor_data_GrowthFarm' },
      crops: { count: await Crop.count(), tableName: 'crops_GrowthFarm' },
      activities: { count: await Activity.count(), tableName: 'activities_GrowthFarm' },
      weatherData: { count: await WeatherData.count(), tableName: 'weather_data_GrowthFarm' },
      aiConversations: { count: await AIConversation.count(), tableName: 'ai_conversations_GrowthFarm' },
      notifications: { count: await Notification.count(), tableName: 'notifications_GrowthFarm' },
      reports: { count: await Report.count(), tableName: 'reports_GrowthFarm' },
      teamMembers: { count: await TeamMember.count(), tableName: 'team_members_GrowthFarm' },
      financialRecords: { count: await FinancialRecord.count(), tableName: 'financial_records_GrowthFarm' }
    };

    res.json({
      success: true,
      message: 'All table information retrieved successfully',
      data: tableData,
      totalTables: Object.keys(tableData).length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch table information',
      error: error.message
    });
  }
});

module.exports = router;
