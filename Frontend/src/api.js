// src/api.js

const getApiBaseUrl = () => {

  // Production (Netlify / Android WebView)
  if (window.location.hostname.includes("netlify.app")) {
    return "https://women-safty-app.onrender.com";
  }

  // Local development
  return "http://localhost:3000";
};

export const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
