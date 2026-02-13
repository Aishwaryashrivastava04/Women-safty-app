// src/api.js - Unified API configuration for web + mobile

// Detect environment and set base URL
const getApiBaseUrl = () => {
  // Check if running on Android emulator
  if (navigator.userAgent.includes('Android') || window.cordova) {
    // Android emulator uses special IP to access host machine
    return 'http://10.0.2.2:3000';
  }
  
  // Check if running on physical Android device (expo go / built apk)
  if (navigator.userAgent.includes('Mobile')) {
    // Physical device needs actual Mac/server IP
    // UPDATE THIS with your server's IP when deploying
    return 'http://192.168.0.102:3000'; // Your Mac's IP
  }
  
  // Web browser on desktop
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  
  // Production/Netlify hosted app - use backend server IP or domain
  return 'http://192.168.0.102:3000'; // Fallback to your server
};

export const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
