const getApiBaseUrl = () => {
  // If running locally on laptop
  if (window.location.hostname === "localhost") {
    return "http://localhost:3000";
  }

  // For Vercel, Android WebView, or any production environment
  return "https://women-safty-app.onrender.com";
};

export const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
