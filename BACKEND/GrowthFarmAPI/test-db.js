require('dotenv').config();

// Test environment variables
console.log('🔧 Testing environment variables...');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

// Test database connection
const { sequelize } = require('./src/config/database');

async function testConnection() {
  try {
    console.log('\n🔌 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const [results] = await sequelize.query('SELECT NOW() as current_time');
    console.log('⏰ Current database time:', results[0].current_time);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

testConnection();
