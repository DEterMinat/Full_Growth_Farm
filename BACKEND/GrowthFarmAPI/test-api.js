// API Test Script for Growth Farm Tables
// Run with: node test-api.js

const axios = require('axios');

// Configuration
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const API_ENDPOINTS = [
  '/api/tables/all',
  '/api/tables/users',
  '/api/tables/farms', 
  '/api/tables/farm-zones',
  '/api/tables/marketplace-products',
  '/api/tables/orders',
  '/api/tables/order-items',
  '/api/tables/iot-devices',
  '/api/tables/sensor-data',
  '/api/tables/crops',
  '/api/tables/activities',
  '/api/tables/weather-data',
  '/api/tables/ai-conversations',
  '/api/tables/notifications',
  '/api/tables/reports',
  '/api/tables/team-members',
  '/api/tables/financial-records'
];

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Test function
async function testAPI(endpoint) {
  try {
    console.log(`${colors.blue}Testing:${colors.reset} GET ${BASE_URL}${endpoint}`);
    
    const startTime = Date.now();
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      timeout: 10000, // 10 second timeout
      validateStatus: function (status) {
        return status >= 200 && status < 500; // Accept both success and client error responses
      }
    });
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (response.status === 200) {
      const data = response.data;
      console.log(`${colors.green}✅ SUCCESS${colors.reset} (${responseTime}ms) - Status: ${response.status}`);
      
      if (data.success) {
        if (endpoint === '/api/tables/all') {
          console.log(`   📊 Found ${data.totalTables} tables`);
          Object.entries(data.data).forEach(([key, value]) => {
            console.log(`   - ${key}: ${value.count} records (${value.tableName})`);
          });
        } else {
          console.log(`   📝 Records found: ${data.count || 0}`);
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            console.log(`   🔍 Sample data keys: ${Object.keys(data.data[0]).join(', ')}`);
          }
        }
      }
    } else {
      console.log(`${colors.yellow}⚠️  WARNING${colors.reset} (${responseTime}ms) - Status: ${response.status}`);
      console.log(`   Message: ${response.data.message || response.data.error?.message || 'Unknown error'}`);
    }
    
    console.log(''); // Empty line for better readability
    return { success: response.status === 200, status: response.status, responseTime };
    
  } catch (error) {
    console.log(`${colors.red}❌ ERROR${colors.reset} - ${endpoint}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log(`   Connection refused - Is the server running on ${BASE_URL}?`);
    } else if (error.code === 'ENOTFOUND') {
      console.log(`   Host not found - Check the BASE_URL: ${BASE_URL}`);
    } else if (error.code === 'ETIMEDOUT') {
      console.log(`   Request timeout - Server took too long to respond`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    
    console.log(''); // Empty line for better readability
    return { success: false, error: error.message };
  }
}

// Main test function
async function runAllTests() {
  console.log(`${colors.bold}🌱 Growth Farm API Table Tests${colors.reset}`);
  console.log(`${colors.bold}Base URL: ${BASE_URL}${colors.reset}`);
  console.log('='.repeat(60));
  console.log('');

  const results = [];
  let successCount = 0;
  let errorCount = 0;

  // Test server health first
  console.log(`${colors.blue}🏥 Testing server health...${colors.reset}`);
  try {
    const healthResponse = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
    console.log(`${colors.green}✅ Server is healthy${colors.reset} - Status: ${healthResponse.status}`);
  } catch (error) {
    console.log(`${colors.red}❌ Server health check failed${colors.reset}`);
    console.log(`   Error: ${error.message}`);
    console.log(`   Make sure the server is running on ${BASE_URL}`);
    process.exit(1);
  }
  console.log('');

  // Test all table endpoints
  for (const endpoint of API_ENDPOINTS) {
    const result = await testAPI(endpoint);
    results.push({ endpoint, ...result });
    
    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Add small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Print summary
  console.log('='.repeat(60));
  console.log(`${colors.bold}📈 Test Results Summary${colors.reset}`);
  console.log(`Total endpoints tested: ${API_ENDPOINTS.length}`);
  console.log(`${colors.green}✅ Successful: ${successCount}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${errorCount}${colors.reset}`);
  
  if (errorCount === 0) {
    console.log(`${colors.green}${colors.bold}🎉 All tests passed!${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️  Some tests failed - check the logs above${colors.reset}`);
  }
  
  console.log('');
  console.log(`${colors.blue}💡 Tips:${colors.reset}`);
  console.log(`   • Make sure the server is running: npm run dev`);
  console.log(`   • Check database connection in .env file`);
  console.log(`   • Verify all models are properly imported`);
  console.log(`   • Check server logs for detailed error messages`);
  
  // Show response time stats
  const responseTimes = results.filter(r => r.responseTime).map(r => r.responseTime);
  if (responseTimes.length > 0) {
    const avgResponseTime = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
    const maxResponseTime = Math.max(...responseTimes);
    const minResponseTime = Math.min(...responseTimes);
    
    console.log('');
    console.log(`${colors.blue}⏱️  Performance Stats:${colors.reset}`);
    console.log(`   Average response time: ${avgResponseTime}ms`);
    console.log(`   Fastest response: ${minResponseTime}ms`);
    console.log(`   Slowest response: ${maxResponseTime}ms`);
  }
}

// Handle command line arguments
if (process.argv.length > 2) {
  const customUrl = process.argv[2];
  console.log(`Using custom base URL: ${customUrl}`);
  BASE_URL = customUrl;
}

// Run tests
runAllTests().catch(error => {
  console.error(`${colors.red}Fatal error running tests:${colors.reset}`, error.message);
  process.exit(1);
});
