import axios from 'axios';

// Determine which API URL to use based on environment
const getBaseUrl = (): string => {
  // For production builds
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL_PRODUCTION || 'https://ai-powered-email-generator.onrender.com/api/v1';
  }
  
  // For development
  return import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:8888/api/v1';
};

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token when available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper functions for common API endpoints
export const endpoints = {
  auth: {
    signIn: '/user/signin',
    signUp: '/user/signup',
  },
  email: {
    generate: '/email/generate-email',
    // Add other email-related endpoints
  },
  // Add other endpoint categories as needed
};
