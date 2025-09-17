// API Configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Base URLs for different environments
const API_BASE_URLS = {
  development: 'http://localhost:4000',
  production: window.location.origin
};

// Get the appropriate base URL
export const API_BASE_URL = isDevelopment 
  ? API_BASE_URLS.development 
  : API_BASE_URLS.production;

// API endpoints
export const API_ENDPOINTS = {
  // User endpoints
  USER_REGISTER: `${API_BASE_URL}/api/user/register`,
  USER_LOGIN: `${API_BASE_URL}/api/user/login`,
  USER_PROFILE: `${API_BASE_URL}/api/user/get-profile`,
  USER_UPDATE_PROFILE: `${API_BASE_URL}/api/user/update-profile`,
  USER_APPOINTMENTS: `${API_BASE_URL}/api/user/appointments`,
  USER_BOOK_APPOINTMENT: `${API_BASE_URL}/api/user/book-appointment`,
  USER_CANCEL_APPOINTMENT: `${API_BASE_URL}/api/user/cancel-appointment`,
  USER_LAWYERS: `${API_BASE_URL}/api/user/lawyers`,
  USER_REQUEST_CONSULTATION: `${API_BASE_URL}/api/user/request-consultation`,
  USER_CONSULTATIONS: `${API_BASE_URL}/api/user/consultations`,
  USER_CREATE_PAYMENT: `${API_BASE_URL}/api/user/create-payment-order`,
  USER_VERIFY_PAYMENT: `${API_BASE_URL}/api/user/verify-payment`,
  
  // Lawyer endpoints
  LAWYER_REGISTER: `${API_BASE_URL}/api/lawyer/register`,
  LAWYER_LOGIN: `${API_BASE_URL}/api/lawyer/login`,
  LAWYER_PROFILE: `${API_BASE_URL}/api/lawyer/profile`,
  LAWYER_UPDATE_PROFILE: `${API_BASE_URL}/api/lawyer/update-profile`,
  LAWYER_APPOINTMENTS: `${API_BASE_URL}/api/lawyer/appointments`,
  LAWYER_CONSULTATIONS: `${API_BASE_URL}/api/lawyer/consultations`,
  LAWYER_DASHBOARD: `${API_BASE_URL}/api/lawyer/dashboard`,
  
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  ADMIN_LAWYERS: `${API_BASE_URL}/api/admin/lawyers`,
  ADMIN_PENDING_LAWYERS: `${API_BASE_URL}/api/admin/pending-lawyers`,
  ADMIN_APPROVE_LAWYER: `${API_BASE_URL}/api/admin/approve-lawyer`,
  ADMIN_REJECT_LAWYER: `${API_BASE_URL}/api/admin/reject-lawyer`,
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
  ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`,
  
  // Twilio endpoints
  TWILIO_ACCESS_TOKEN: `${API_BASE_URL}/api/twilio/access-token`,
  TWILIO_ROOM: `${API_BASE_URL}/api/twilio/room`,
  TWILIO_END_ROOM: `${API_BASE_URL}/api/twilio/end-room`
};

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

// Helper function to get auth headers
export const getAuthHeaders = (token) => ({
  ...DEFAULT_HEADERS,
  'Authorization': `Bearer ${token}`
});

console.log('API Configuration:', {
  environment: isDevelopment ? 'development' : 'production',
  baseUrl: API_BASE_URL
});
