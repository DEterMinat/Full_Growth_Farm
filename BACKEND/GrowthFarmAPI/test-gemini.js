// Test script for Gemini API
require('dotenv').config();
const axios = require('axios');

// Configuration
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:30007';
const TEST_USER = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'testpass123',
  firstName: 'Test',
  lastName: 'User'
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Test messages for different scenarios
const testMessages = [
  {
    category: 'crop_advice',
    message: 'What is the best time to plant tomatoes in Thailand?',
    context: 'I have a 2-hectare organic farm in Chiang Mai'
  },
  {
    category: 'pest_management', 
    message: 'How do I deal with aphids on my lettuce crops?',
    context: 'Organic farming, no chemical pesticides allowed'
  },
  {
    category: 'weather_planning',
    message: 'Should I harvest my corn before the rain season?',
    context: 'Rain season starts next week, corn is 80% mature'
  },
  {
    category: 'general',
    message: 'What are the benefits of crop rotation?',
    context: 'Small scale farming, 5 different vegetables'
  },
  {
    category: 'fertilizer',
    message: 'What organic fertilizer is best for rice?',
    context: 'Paddy field farming, clay soil type'
  }
];

async function registerUser() {
  try {
    console.log(`${colors.blue}👤 Registering test user...${colors.reset}`);
    
    const response = await axios.post(`${BASE_URL}/auth/register`, TEST_USER, {
      timeout: 10000,
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });

    if (response.status === 201) {
      console.log(`${colors.green}✅ User registered successfully${colors.reset}`);
      return response.data.token;
    } else if (response.status === 400 && response.data.message.includes('already exists')) {
      console.log(`${colors.yellow}⚠️  User already exists, attempting login...${colors.reset}`);
      return await loginUser();
    } else {
      throw new Error(`Registration failed: ${response.data.message}`);
    }
  } catch (error) {
    if (error.response?.status === 400) {
      console.log(`${colors.yellow}⚠️  User might already exist, attempting login...${colors.reset}`);
      return await loginUser();
    }
    throw error;
  }
}

async function loginUser() {
  try {
    console.log(`${colors.blue}🔐 Logging in test user...${colors.reset}`);
    
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password
    }, { timeout: 10000 });

    console.log(`${colors.green}✅ Login successful${colors.reset}`);
    return response.data.token;
  } catch (error) {
    throw new Error(`Login failed: ${error.response?.data?.message || error.message}`);
  }
}

async function testGeminiChat(token, message, context) {
  try {
    console.log(`${colors.cyan}🤖 Testing Gemini chat...${colors.reset}`);
    console.log(`   Message: "${message}"`);
    console.log(`   Context: "${context}"`);
    
    const startTime = Date.now();
    
    const response = await axios.post(`${BASE_URL}/ai/chat`, {
      message: message,
      context: context
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 seconds for AI response
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (response.status === 200) {
      console.log(`${colors.green}✅ Chat response received${colors.reset} (${responseTime}ms)`);
      console.log(`   AI Response: "${response.data.response}"`);
      console.log(`   Category: ${response.data.category}`);
      console.log(`   Suggestions: ${response.data.suggestions?.length || 0} items`);
      
      if (response.data.suggestions?.length > 0) {
        console.log(`   Sample suggestions: ${response.data.suggestions.slice(0, 2).join(', ')}`);
      }
      
      return { success: true, responseTime, data: response.data };
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(`${colors.red}❌ Chat test failed${colors.reset}`);
    console.log(`   Error: ${error.response?.data?.message || error.message}`);
    return { success: false, error: error.message };
  }
}

async function testGeminiStatus() {
  try {
    console.log(`${colors.blue}📊 Testing Gemini status...${colors.reset}`);
    
    const response = await axios.get(`${BASE_URL}/ai/status`, { timeout: 5000 });
    
    if (response.status === 200) {
      console.log(`${colors.green}✅ Gemini status retrieved${colors.reset}`);
      console.log(`   Service: ${response.data.service}`);
      console.log(`   Status: ${response.data.status}`);
      console.log(`   Model: ${response.data.model || 'Not specified'}`);
      console.log(`   Available: ${response.data.available ? 'Yes' : 'No'}`);
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.log(`${colors.red}❌ Status test failed${colors.reset}`);
    console.log(`   Error: ${error.response?.data?.message || error.message}`);
    return { success: false, error: error.message };
  }
}

async function testGeminiRecommendations(token) {
  try {
    console.log(`${colors.blue}💡 Testing Gemini recommendations...${colors.reset}`);
    
    const response = await axios.get(`${BASE_URL}/ai/recommendations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 15000
    });
    
    if (response.status === 200) {
      console.log(`${colors.green}✅ Recommendations retrieved${colors.reset}`);
      console.log(`   Found ${response.data.recommendations?.length || 0} recommendations`);
      
      if (response.data.recommendations?.length > 0) {
        response.data.recommendations.slice(0, 2).forEach((rec, index) => {
          console.log(`   ${index + 1}. ${rec.title}: ${rec.description.substring(0, 60)}...`);
        });
      }
      
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.log(`${colors.red}❌ Recommendations test failed${colors.reset}`);
    console.log(`   Error: ${error.response?.data?.message || error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log(`${colors.bold}🤖 Gemini AI API Test Suite${colors.reset}`);
  console.log(`${colors.bold}Base URL: ${BASE_URL}${colors.reset}`);
  console.log('='.repeat(60));
  console.log('');

  const results = {
    auth: { success: false },
    status: { success: false },
    chat: [],
    recommendations: { success: false }
  };

  try {
    // Test 1: Authentication
    console.log(`${colors.bold}1. Authentication Test${colors.reset}`);
    const token = await registerUser();
    results.auth = { success: true, token: token ? '[RECEIVED]' : '[NOT RECEIVED]' };
    console.log('');

    // Test 2: Gemini Status
    console.log(`${colors.bold}2. Gemini Status Test${colors.reset}`);
    results.status = await testGeminiStatus();
    console.log('');

    // Test 3: Chat Tests with different messages
    console.log(`${colors.bold}3. Gemini Chat Tests${colors.reset}`);
    for (let i = 0; i < testMessages.length; i++) {
      const testMsg = testMessages[i];
      console.log(`${colors.bold}   Test ${i + 1}/${testMessages.length}: ${testMsg.category}${colors.reset}`);
      
      const chatResult = await testGeminiChat(token, testMsg.message, testMsg.context);
      results.chat.push({ ...testMsg, result: chatResult });
      
      console.log('');
      
      // Add delay between requests to avoid rate limiting
      if (i < testMessages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Test 4: Recommendations
    console.log(`${colors.bold}4. Gemini Recommendations Test${colors.reset}`);
    results.recommendations = await testGeminiRecommendations(token);
    console.log('');

  } catch (error) {
    console.log(`${colors.red}❌ Test suite failed: ${error.message}${colors.reset}`);
  }

  // Print summary
  console.log('='.repeat(60));
  console.log(`${colors.bold}📈 Test Results Summary${colors.reset}`);
  
  console.log(`Authentication: ${results.auth.success ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}${colors.reset}`);
  console.log(`Status Check: ${results.status.success ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}${colors.reset}`);
  console.log(`Recommendations: ${results.recommendations.success ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}${colors.reset}`);
  
  const successfulChats = results.chat.filter(c => c.result.success).length;
  const totalChats = results.chat.length;
  console.log(`Chat Tests: ${successfulChats}/${totalChats} passed ${successfulChats === totalChats ? colors.green + '✅' : colors.yellow + '⚠️'}${colors.reset}`);
  
  if (successfulChats < totalChats) {
    console.log('\nFailed chat tests:');
    results.chat.filter(c => !c.result.success).forEach(c => {
      console.log(`   - ${c.category}: ${c.result.error}`);
    });
  }
  
  const avgResponseTime = results.chat
    .filter(c => c.result.success && c.result.responseTime)
    .reduce((sum, c) => sum + c.result.responseTime, 0) / successfulChats || 0;
  
  if (avgResponseTime > 0) {
    console.log(`\nAverage AI response time: ${Math.round(avgResponseTime)}ms`);
  }
  
  console.log('');
  console.log(`${colors.blue}💡 Tips:${colors.reset}`);
  console.log(`   • Make sure GEMINI_API_KEY is set in .env file`);
  console.log(`   • Check server logs for detailed error messages`);
  console.log(`   • Gemini 1.5 Flash model should be available`);
  console.log(`   • Rate limiting: Wait between requests if needed`);
}

// Handle command line arguments
if (process.argv.length > 2) {
  const customUrl = process.argv[2];
  console.log(`Using custom base URL: ${customUrl}`);
  process.env.API_BASE_URL = customUrl;
}

// Run tests
runAllTests().catch(error => {
  console.error(`${colors.red}Fatal error running tests:${colors.reset}`, error.message);
  process.exit(1);
});
