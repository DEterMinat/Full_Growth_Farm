require('dotenv').config();
const { sequelize } = require('./src/config/database');

async function fixTagsIndexIssue() {
  try {
    console.log('🔧 Fixing functional index issue on tags column...');
    
    // First, check what indexes exist on the marketplace_products table
    console.log('📊 Checking existing indexes on marketplace_products_GrowthFarm...');
    
    try {
      const [indexes] = await sequelize.query(`
        SHOW INDEXES FROM marketplace_products_GrowthFarm WHERE Column_name = 'tags'
      `);
      
      if (indexes.length > 0) {
        console.log('Found indexes on tags column:');
        indexes.forEach(index => {
          console.log(`   - ${index.Key_name} (${index.Index_type})`);
        });
        
        // Drop each index found
        for (const index of indexes) {
          try {
            const dropQuery = `DROP INDEX ${index.Key_name} ON marketplace_products_GrowthFarm`;
            await sequelize.query(dropQuery);
            console.log(`✅ Dropped index: ${index.Key_name}`);
          } catch (error) {
            console.log(`⚠️  Could not drop index ${index.Key_name}: ${error.message}`);
          }
        }
      } else {
        console.log('No indexes found on tags column');
      }
    } catch (error) {
      console.log('Table marketplace_products_GrowthFarm may not exist yet');
    }

    // Also try to drop any potential functional indexes by name
    const potentialIndexNames = [
      'tags_functional_idx',
      'idx_tags_json',
      'tags_idx',
      'functional_idx_tags',
      'marketplace_products_tags_idx'
    ];

    for (const indexName of potentialIndexNames) {
      try {
        await sequelize.query(`DROP INDEX ${indexName} ON marketplace_products_GrowthFarm`);
        console.log(`✅ Dropped potential index: ${indexName}`);
      } catch (error) {
        // Ignore errors for non-existent indexes
        if (!error.message.includes("doesn't exist")) {
          console.log(`⚠️  Note: ${error.message.substring(0, 100)}...`);
        }
      }
    }

    // Try to check if there are any generated columns or computed columns
    try {
      const [columns] = await sequelize.query(`
        SELECT COLUMN_NAME, COLUMN_TYPE, EXTRA, GENERATION_EXPRESSION 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'marketplace_products_GrowthFarm' 
        AND TABLE_SCHEMA = DATABASE()
        AND COLUMN_NAME = 'tags'
      `);
      
      if (columns.length > 0) {
        console.log('Tags column details:', columns[0]);
        
        // If it's a generated column, we might need to drop it differently
        if (columns[0].EXTRA && columns[0].EXTRA.includes('GENERATED')) {
          console.log('⚠️  Tags column appears to be a generated column');
        }
      }
    } catch (error) {
      console.log('Could not check column details');
    }

    console.log('✅ Index cleanup completed');
    console.log('💡 Now try running: npm start');
    
  } catch (error) {
    console.error('❌ Error fixing tags index issue:', error.message);
    throw error;
  }
}

async function main() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    console.log(`📊 Connected to database: ${process.env.DB_NAME} @ ${process.env.DB_HOST}`);

    await fixTagsIndexIssue();
    
  } catch (error) {
    console.error('❌ Failed to fix tags index issue:', error.message);
    console.error('Full error details:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

main();
