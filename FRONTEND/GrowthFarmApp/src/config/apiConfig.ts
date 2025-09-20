// API Configuration for Growth Farm App
// Configure these values based on your environment

export const API_CONFIG = {
  // Development - when running backend locally
  DEVELOPMENT: {
    // แก้ไข BASE_URL ให้ชี้ไปยัง Server ของคุณ
    BASE_URL: 'http://localhost:30039', 
    TIMEOUT: 10000,
  },
  
  // Production - when deployed to server
  PRODUCTION: {
    BASE_URL: 'https://your-production-api.com', // Replace with your actual production URL
    TIMEOUT: 15000,
  },
  
  // For React Native development on physical device
  // Replace 192.168.1.xxx with your computer's IP address
  DEVICE_DEVELOPMENT: {
    BASE_URL: 'http://192.168.1.100:8000', // Update this IP to your computer's IP
    TIMEOUT: 10000,
  }
};

// Auto-detect environment (you can modify this logic as needed)
const getEnvironment = () => {
  // Add your environment detection logic here
  // For now, using development as default
  return 'DEVELOPMENT';
};

export const getCurrentConfig = () => {
  const env = getEnvironment();
  return API_CONFIG[env as keyof typeof API_CONFIG];
};

export default getCurrentConfig();