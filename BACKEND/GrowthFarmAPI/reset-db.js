require('dotenv').config();
const { sequelize } = require('./src/config/database');

async function resetDatabase() {
  try {
    console.log('🔄 Starting complete database reset...');
    
    // Get all tables with GrowthFarm suffix
    const [tables] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME LIKE '%_GrowthFarm'
    `);
    
    if (tables.length > 0) {
      console.log(`📋 Found ${tables.length} tables to drop:`);
      tables.forEach(table => {
        console.log(`   - ${table.TABLE_NAME}`);
      });
      
      // Disable foreign key checks
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      console.log('🔓 Disabled foreign key checks');
      
      // Drop all tables
      for (const table of tables) {
        try {
          await sequelize.query(`DROP TABLE IF EXISTS ${table.TABLE_NAME}`);
          console.log(`✅ Dropped table: ${table.TABLE_NAME}`);
        } catch (error) {
          console.log(`⚠️  Error dropping ${table.TABLE_NAME}: ${error.message}`);
        }
      }
      
      // Re-enable foreign key checks
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('🔒 Re-enabled foreign key checks');
      
    } else {
      console.log('💡 No GrowthFarm tables found to drop');
    }
    
    console.log('✅ Database reset completed successfully!');
    console.log('💡 You can now run: npm start');
    
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    throw error;
  }
}

async function main() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    console.log(`📊 Connected to database: ${process.env.DB_NAME} @ ${process.env.DB_HOST}`);

    // Confirm reset
    console.log('\n⚠️  WARNING: This will drop ALL GrowthFarm tables!');
    console.log('🗑️  All data will be lost permanently.');
    
    // For automated execution, skip confirmation
    console.log('🚀 Proceeding with database reset...\n');
    
    await resetDatabase();
    
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Run the reset
main();
