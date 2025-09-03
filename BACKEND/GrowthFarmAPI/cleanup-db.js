require('dotenv').config();
const { sequelize } = require('./src/config/database');

async function dropFunctionalIndexes() {
  try {
    console.log('🔧 Dropping functional indexes that prevent column drops...');
    
    // List of potential problematic indexes
    const queries = [
      // Drop functional index on tags column
      `DROP INDEX IF EXISTS idx_marketplace_products_tags ON marketplace_products_GrowthFarm`,
      `DROP INDEX IF EXISTS tags_index ON marketplace_products_GrowthFarm`,
      `DROP INDEX IF EXISTS functional_tags ON marketplace_products_GrowthFarm`,
      
      // Drop any other functional indexes that might exist
      `DROP INDEX IF EXISTS idx_farms_certifications ON farms_GrowthFarm`,
      `DROP INDEX IF EXISTS idx_farms_images ON farms_GrowthFarm`,
      `DROP INDEX IF EXISTS idx_zones_sensors ON farm_zones_GrowthFarm`,
      `DROP INDEX IF EXISTS idx_zones_equipment ON farm_zones_GrowthFarm`,
      `DROP INDEX IF EXISTS idx_products_specifications ON marketplace_products_GrowthFarm`,
      `DROP INDEX IF EXISTS idx_products_shipping ON marketplace_products_GrowthFarm`,
    ];

    // Execute each query
    for (const query of queries) {
      try {
        await sequelize.query(query);
        console.log(`✅ Executed: ${query}`);
      } catch (error) {
        // Ignore errors for non-existent indexes
        if (!error.message.includes("doesn't exist")) {
          console.log(`⚠️  Warning: ${error.message}`);
        }
      }
    }

    console.log('✅ Functional indexes cleanup completed');
    
  } catch (error) {
    console.error('❌ Error dropping functional indexes:', error);
    throw error;
  }
}

async function showIndexes() {
  try {
    console.log('📊 Checking existing indexes...');
    
    const tables = [
      'users_GrowthFarm',
      'farms_GrowthFarm', 
      'farm_zones_GrowthFarm',
      'marketplace_products_GrowthFarm'
    ];

    for (const table of tables) {
      try {
        const [results] = await sequelize.query(`SHOW INDEXES FROM ${table}`);
        if (results.length > 0) {
          console.log(`\n📋 Indexes for ${table}:`);
          results.forEach(index => {
            console.log(`   - ${index.Key_name} (${index.Column_name})`);
          });
        }
      } catch (error) {
        console.log(`⚠️  Table ${table} not found or inaccessible`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error showing indexes:', error);
  }
}

async function main() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Show current indexes
    await showIndexes();
    
    // Drop problematic indexes
    await dropFunctionalIndexes();
    
    // Show indexes after cleanup
    console.log('\n🔄 Indexes after cleanup:');
    await showIndexes();
    
    console.log('\n🎉 Database cleanup completed successfully!');
    console.log('💡 You can now run: npm start');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Run the cleanup
main();
