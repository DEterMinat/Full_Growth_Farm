// เช็คตารางในฐานข้อมูลที่มีคำว่า _GrowthFarm ต่อท้าย
const { sequelize } = require('./src/config/database');
require('dotenv').config();

async function checkGrowthFarmTables() {
  try {
    console.log('🔍 กำลังตรวจสอบตารางในฐานข้อมูล...');
    console.log(`📊 ฐานข้อมูล: ${process.env.DB_NAME} @ ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log('=' .repeat(80));

    // เชื่อมต่อฐานข้อมูล
    await sequelize.authenticate();
    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ\n');

    // ดึงรายชื่อตารางทั้งหมด
    const [results] = await sequelize.query(`
      SELECT 
        TABLE_NAME as tableName,
        TABLE_ROWS as tableRows,
        DATA_LENGTH as dataLength,
        INDEX_LENGTH as indexLength,
        CREATE_TIME as createTime,
        UPDATE_TIME as updateTime,
        TABLE_COMMENT as tableComment
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME}'
      ORDER BY TABLE_NAME
    `);

    // กรองตารางที่มี _GrowthFarm ต่อท้าย
    const growthFarmTables = results.filter(table => 
      table.tableName.endsWith('_GrowthFarm')
    );

    // แสดงผลตารางทั้งหมด
    console.log('📋 ตารางทั้งหมดในฐานข้อมูล:');
    console.log('-' .repeat(80));
    results.forEach((table, index) => {
      const isGrowthFarm = table.tableName.endsWith('_GrowthFarm');
      const icon = isGrowthFarm ? '🌱' : '📄';
      const highlight = isGrowthFarm ? '*** ' : '    ';
      
      console.log(`${highlight}${icon} ${index + 1}. ${table.tableName}`);
      if (table.tableRows !== null) {
        console.log(`${highlight}   📊 จำนวนแถว: ${table.tableRows || 0}`);
      }
      if (table.tableComment) {
        console.log(`${highlight}   💬 หมายเหตุ: ${table.tableComment}`);
      }
      console.log();
    });

    // สรุปตาราง _GrowthFarm
    console.log('\n🌱 ตารางที่มี "_GrowthFarm" ต่อท้าย:');
    console.log('=' .repeat(80));
    
    if (growthFarmTables.length === 0) {
      console.log('❌ ไม่พบตารางที่มี "_GrowthFarm" ต่อท้าย');
    } else {
      console.log(`✅ พบตาราง _GrowthFarm จำนวน: ${growthFarmTables.length} ตาราง\n`);
      
      growthFarmTables.forEach((table, index) => {
        console.log(`🌱 ${index + 1}. ${table.tableName}`);
        console.log(`   📊 จำนวนแถว: ${table.tableRows || 0}`);
        console.log(`   💾 ขนาดข้อมูล: ${formatBytes(table.dataLength || 0)}`);
        console.log(`   🔍 ขนาด Index: ${formatBytes(table.indexLength || 0)}`);
        
        if (table.createTime) {
          console.log(`   📅 สร้างเมื่อ: ${new Date(table.createTime).toLocaleString('th-TH')}`);
        }
        
        if (table.updateTime) {
          console.log(`   🔄 อัปเดตล่าสุด: ${new Date(table.updateTime).toLocaleString('th-TH')}`);
        }
        
        if (table.tableComment) {
          console.log(`   💬 หมายเหตุ: ${table.tableComment}`);
        }
        console.log();
      });

      // ดึงข้อมูลโครงสร้างตารางสำหรับตาราง _GrowthFarm แต่ละตาราง
      console.log('\n🏗️ โครงสร้างตาราง _GrowthFarm:');
      console.log('=' .repeat(80));
      
      for (const table of growthFarmTables) {
        try {
          console.log(`\n📋 ตาราง: ${table.tableName}`);
          console.log('-' .repeat(40));
          
          const [columns] = await sequelize.query(`
            SELECT 
              COLUMN_NAME as columnName,
              DATA_TYPE as dataType,
              IS_NULLABLE as isNullable,
              COLUMN_DEFAULT as columnDefault,
              COLUMN_KEY as columnKey,
              EXTRA as extra,
              COLUMN_COMMENT as columnComment
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' 
            AND TABLE_NAME = '${table.tableName}'
            ORDER BY ORDINAL_POSITION
          `);

          columns.forEach((col, idx) => {
            const keyIcon = col.columnKey === 'PRI' ? '🔑' : 
                           col.columnKey === 'UNI' ? '🔐' : 
                           col.columnKey === 'MUL' ? '🔗' : '📝';
            
            console.log(`   ${keyIcon} ${idx + 1}. ${col.columnName}`);
            console.log(`      🔤 ชนิด: ${col.dataType}`);
            console.log(`      ❓ Null: ${col.isNullable}`);
            
            if (col.columnDefault !== null) {
              console.log(`      🎯 ค่าเริ่มต้น: ${col.columnDefault}`);
            }
            
            if (col.extra) {
              console.log(`      ⚙️ Extra: ${col.extra}`);
            }
            
            if (col.columnComment) {
              console.log(`      💬 หมายเหตุ: ${col.columnComment}`);
            }
            console.log();
          });

          // ดึงข้อมูลตัวอย่าง 3 แถวแรก
          try {
            const [sampleData] = await sequelize.query(`
              SELECT * FROM \`${table.tableName}\` LIMIT 3
            `);
            
            if (sampleData.length > 0) {
              console.log(`   📊 ข้อมูลตัวอย่าง (${sampleData.length} แถวแรก):`);
              console.log('   ' + '-' .repeat(35));
              sampleData.forEach((row, idx) => {
                console.log(`   📄 แถวที่ ${idx + 1}:`);
                Object.keys(row).slice(0, 5).forEach(key => {
                  let value = row[key];
                  if (value && typeof value === 'string' && value.length > 50) {
                    value = value.substring(0, 50) + '...';
                  }
                  console.log(`      ${key}: ${value}`);
                });
                console.log();
              });
            } else {
              console.log('   📭 ตารางว่าง (ไม่มีข้อมูล)');
            }
          } catch (sampleError) {
            console.log('   ⚠️ ไม่สามารถดึงข้อมูลตัวอย่างได้');
          }

        } catch (structureError) {
          console.log(`   ❌ ไม่สามารถดึงโครงสร้างตาราง ${table.tableName} ได้: ${structureError.message}`);
        }
      }
    }

    // สถิติสรุป
    console.log('\n📈 สถิติสรุป:');
    console.log('=' .repeat(80));
    console.log(`📊 ตารางทั้งหมด: ${results.length} ตาราง`);
    console.log(`🌱 ตาราง _GrowthFarm: ${growthFarmTables.length} ตาราง`);
    console.log(`📄 ตารางอื่นๆ: ${results.length - growthFarmTables.length} ตาราง`);
    
    // คำนวณขนาดรวม
    const totalDataSize = growthFarmTables.reduce((sum, table) => sum + (table.dataLength || 0), 0);
    const totalIndexSize = growthFarmTables.reduce((sum, table) => sum + (table.indexLength || 0), 0);
    const totalRows = growthFarmTables.reduce((sum, table) => sum + (table.tableRows || 0), 0);
    
    console.log(`💾 ขนาดข้อมูลรวม _GrowthFarm: ${formatBytes(totalDataSize)}`);
    console.log(`🔍 ขนาด Index รวม _GrowthFarm: ${formatBytes(totalIndexSize)}`);
    console.log(`📊 จำนวนแถวรวม _GrowthFarm: ${totalRows.toLocaleString()} แถว`);

    console.log('\n✅ เสร็จสิ้นการตรวจสอบฐานข้อมูล');

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

// ฟังก์ชันแปลงขนาดไฟล์
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// เรียกใช้ฟังก์ชัน
if (require.main === module) {
  checkGrowthFarmTables();
}

module.exports = { checkGrowthFarmTables };
