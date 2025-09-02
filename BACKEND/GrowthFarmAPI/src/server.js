const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { sequelize } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const farmRoutes = require('./routes/farms');
const marketplaceRoutes = require('./routes/marketplace');
const weatherRoutes = require('./routes/weather');
const geminiRoutes = require('./routes/gemini');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));

// Configure CORS with multiple origins
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()) || [
  'http://localhost:3000',
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

// Routes
app.use('/auth', authRoutes);
app.use('/farms', farmRoutes);
app.use('/marketplace', marketplaceRoutes);
app.use('/weather', weatherRoutes);
app.use('/ai', geminiRoutes);
app.use('/health', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
  const host = process.env.API_SERVER_HOST || 'localhost';
  const port = process.env.PORT || 8000;
  
  res.json({
    message: '🌱 Growth Farm API Server',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    server: {
      host: host,
      port: port,
      url: `http://${host}:${port}`,
      database: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        connected: true
      }
    },
    endpoints: {
      health: '/health',
      auth: '/auth',
      farms: '/farms',
      marketplace: '/marketplace',
      weather: '/weather',
      ai: '/ai'
    }
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
