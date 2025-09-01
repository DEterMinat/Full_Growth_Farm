// Simple test script to verify Guest login flow
console.log('Testing Guest login flow...');

// Simulate the flow
async function testGuestLogin() {
  console.log('1. User clicks "Try as Guest"');
  
  // This should happen in loginAsGuest():
  console.log('2. Set AsyncStorage items:');
  console.log('   - growth_farm_guest_mode: "true"');
  console.log('   - growth_farm_token: removed');
  
  console.log('3. Set state:');
  console.log('   - isGuest: true');
  console.log('   - isAuthenticated: false');
  console.log('   - user: null');
  
  console.log('4. Navigate to dashboard');
  console.log('   - router.replace("/(app)/dashboard")');
  
  console.log('5. Dashboard should show with Guest badge');
}

testGuestLogin();
