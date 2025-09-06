const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { sequelize } = require('./config/database');
const { initializeAssociations } = require('./scripts/sync-database');
const localization = require('./middleware/localization');

// Import routes
const authRoutes = require('./routes/auth');
const authThaiRoutes = require('./routes/auth_thai');
const farmRoutes = require('./routes/farms');
const marketplaceRoutes = require('./routes/marketplace');
const weatherRoutes = require('./routes/weather');
const geminiRoutes = require('./routes/gemini');
const healthRoutes = require('./routes/health');
const tablesRoutes = require('./routes/tables');

const app = express();
const PORT = process.env.API_SERVER_PORT || 30039;
const HOST = process.env.API_SERVER_HOST || '0.0.0.0';

// Middleware
app.use(helmet());
app.use(morgan('combined'));

// Configure CORS with multiple origins
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()) || [
  'http://localhost:30039',
  'http://localhost:19006',
  `http://localhost:${PORT}`,
  `http://119.59.102.61:${PORT}`
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow any localhost requests during development
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add localization middleware
app.use(localization.middleware());

// Routes
app.use('/auth', authRoutes);
app.use('/auth/th', authThaiRoutes); // Thai version of auth
app.use('/farms', farmRoutes);
app.use('/marketplace', marketplaceRoutes);
app.use('/weather', weatherRoutes);
app.use('/ai', geminiRoutes);
app.use('/health', healthRoutes);
app.use('/api/tables', tablesRoutes);

// Root endpoint
app.get('/', (req, res) => {
  const host = process.env.API_SERVER_HOST || 'localhost';
  const port = process.env.PORT || 8000;
  
  res.json({
    success: true,
    message: '🌱 ระบบ Growth Farm API',
    description: 'API สำหรับระบบการเกษตรอัจฉริยะ',
    version: '1.0.0',
    status: 'ทำงานปกติ',
    timestamp: new Date().toISOString(),
    server: {
      host: host,
      port: port,
      url: `http://${host}:${port}`,
      language: 'ภาษาไทย + English',
      database: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        connected: true
      }
    },
    endpoints: {
      health: '/health - สุขภาพระบบ',
      auth: '/auth - ระบบสมาชิก (English)',
      authThai: '/auth/th - ระบบสมาชิก (ไทย)',
      farms: '/farms - ฟาร์ม',
      marketplace: '/marketplace - ตลาดกลาง',
      weather: '/weather - สภาพอากาศ',
      ai: '/ai - ปัญญาประดิษฐ์',
      tables: '/api/tables - ข้อมูลตาราง'
    },
    features: [
      'ระบบสมาชิกและการยืนยันตัวตน',
      'จัดการฟาร์มและพื้นที่เพาะปลูก',
      'ตลาดกลางซื้อขายผลผลิต',
      'ข้อมูลสภาพอากาศ',
      'ปัญญาประดิษฐ์ Gemini 1.5 Flash',
      'การควบคุม IoT และเซ็นเซอร์',
      'รายงานและการวิเคราะห์'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      status: 404,
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    }
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize model associations
    console.log('🔗 Initializing database associations...');
    initializeAssociations();

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    console.log(`📊 Connected to database: ${process.env.DB_NAME} @ ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    
    // Sync database models
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized.');

    const host = process.env.API_SERVER_HOST || '0.0.0.0';
    const port = PORT;
    
    app.listen(port, host, () => {
      console.log('🌱 Growth Farm Express.js API Server Started!');
      console.log('='.repeat(50));
      console.log(`🚀 Server running on: http://${host}:${port}`);
      console.log(`📚 API Documentation: http://${host}:${port}`);
      console.log(`💊 Health Check: http://${host}:${port}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Database: ${process.env.DB_NAME} @ ${process.env.DB_HOST}`);
      
      if (host !== '0.0.0.0' && host !== 'localhost') {
        console.log(`🌐 Also accessible at: http://localhost:${port}`);
      }
      
      console.log('='.repeat(50));
      console.log('🔗 Available Endpoints:');
      console.log(`   POST /auth/register - Register user`);
      console.log(`   POST /auth/login - User login`);
      console.log(`   GET  /farms - Get all farms`);
      console.log(`   GET  /marketplace/products - Get products`);
      console.log(`   GET  /weather - Get weather data`);
      console.log(`   POST /ai/chat - Chat with AI`);
      console.log(`   GET  /api/tables/all - Get all table info`);
      console.log(`   GET  /api/tables/users - Get all users`);
      console.log(`   GET  /api/tables/farms - Get all farms`);
      console.log(`   GET  /api/tables/crops - Get all crops`);
      console.log('='.repeat(50));
      console.log('📈 Database Tables Created/Updated:');
      console.log('   ✅ users_GrowthFarm');
      console.log('   ✅ farms_GrowthFarm');
      console.log('   ✅ farm_zones_GrowthFarm');
      console.log('   ✅ marketplace_products_GrowthFarm');
      console.log('   ✅ orders_GrowthFarm');
      console.log('   ✅ order_items_GrowthFarm');
      console.log('   ✅ iot_devices_GrowthFarm');
      console.log('   ✅ sensor_data_GrowthFarm');
      console.log('   ✅ crops_GrowthFarm');
      console.log('   ✅ activities_GrowthFarm');
      console.log('   ✅ weather_data_GrowthFarm');
      console.log('   ✅ ai_conversations_GrowthFarm');
      console.log('   ✅ notifications_GrowthFarm');
      console.log('   ✅ reports_GrowthFarm');
      console.log('   ✅ team_members_GrowthFarm');
      console.log('   ✅ financial_records_GrowthFarm');
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Check your database connection and .env configuration');
    process.exit(1);
  }
};

startServer();

module.exports = app;
