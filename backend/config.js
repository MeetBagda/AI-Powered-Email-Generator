// Get environment variables with defaults
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Python service URLs
const PYTHON_SERVICE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.PYTHON_SERVICE_URL_PRODUCTION || "https://ai-powered-email-generator-1.onrender.com"
  : process.env.PYTHON_SERVICE_URL_LOCAL || "http://127.0.0.1:5000";

module.exports = {
  JWT_SECRET,
  PYTHON_SERVICE_URL
};