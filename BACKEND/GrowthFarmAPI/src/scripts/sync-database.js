const { sequelize } = require('../config/database');

// Import models
const { User } = require('../models/User');
const { Farm, FarmZone } = require('../models/Farm');
const { Product } = require('../models/Product');
const { Order } = require('../models/Order');
const { OrderItem } = require('../models/OrderItem');
const { IOTDevice, SensorData } = require('../models/IOTDevice');
const { Crop } = require('../models/Crop');
const { Activity } = require('../models/Activity');
const { Weather } = require('../models/Weather');
const { AIConversation, Notification, Report } = require('../models/Notification');
const { TeamMember, FinancialRecord } = require('../models/Management');

const initializeAssociations = () => {
  // User <-> Product (Seller)
  User.hasMany(Product, { foreignKey: 'sellerId', as: 'products' });
  Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
  
  // User <-> Order (Buyer)
  User.hasMany(Order, { foreignKey: 'buyerId', as: 'orders' });
  Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
  
  // Order <-> OrderItem
  Order.hasMany(OrderItem, { 
    foreignKey: 'orderId', 
    as: 'items',
    onDelete: 'CASCADE'
  });
  OrderItem.belongsTo(Order, { foreignKey: { name: 'orderId', allowNull: false } });
  
  // --- 🔽 จุดที่แก้ไข 🔽 ---
  // Product <-> OrderItem
  Product.hasMany(OrderItem, { 
    foreignKey: 'productId',
    onDelete: 'SET NULL' // กฎข้อที่ 1: ถ้า Product ถูกลบ, ให้ productId เป็น NULL
  });
  // กฎข้อที่ 2: ทำให้สอดคล้องกับข้อที่ 1 โดยการอนุญาตให้ productId เป็น NULL ได้
  OrderItem.belongsTo(Product, { foreignKey: { name: 'productId', allowNull: true } });

  // --- Associations อื่นๆ ---
  User.hasMany(Farm, { foreignKey: 'userId', as: 'ownedFarms' });
  Farm.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
  Farm.hasMany(FarmZone, { foreignKey: 'farmId', as: 'zones' });
  FarmZone.belongsTo(Farm, { foreignKey: 'farmId', as: 'farm' });

  console.log('✅ Database associations initialized successfully.');
};

// ส่วนที่เหลือของไฟล์เหมือนเดิมทุกประการครับ
const syncDatabase = async (options = {}) => {
  try {
    console.log('🔄 Starting database synchronization...');
    initializeAssociations();
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    await sequelize.sync({ alter: true, ...options });
    console.log('✅ Database synchronized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    throw error;
  }
};

const runSync = async () => {
  try {
    await syncDatabase({ alter: true });
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

module.exports = {
  syncDatabase,
  initializeAssociations
};

if (require.main === module) {
  runSync();
}