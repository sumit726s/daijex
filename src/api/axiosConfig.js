import axios from 'axios';
import { API_PATH } from '../api/config';

const CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_OAUTH_CLIENT_SECRET;
const api = axios.create({
  baseURL: `${API_PATH}/jsonapi`,
  headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  },
});

/**
 * Single Point Auth: Fetches a new token from Drupal
 */
async function getNewToken() {
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  try {
    // Note: Use a clean axios call here, not 'api', to avoid interceptor loops
    const response = await axios({
      method: 'post',
      url: `${API_PATH}/oauth/token`, // Ensure this is the ROOT, not /jsonapi
      data: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    const token = response.data.access_token;
    localStorage.setItem('access_token', token);
    return token;
  } catch (error) {
    console.error('Drupal Auth Failed:', error.response?.data || error.message);
    return null;
  }
}

/**
 * Request Interceptor: Auto-attach OR Auto-fetch token
 */
api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('access_token');

  // If no token exists, get one before sending the request
  if (!token) {
    token = await getNewToken();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

/**
 * Response Interceptor: Handle Expiry or Forbidden
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 (Expired) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('access_token');
      
      const newToken = await getNewToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // Retry the original request with new token
      }
    }

    // If 403 (Forbidden) or Auth totally fails, send to login
    if (error.response?.status === 403) {
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?error=access_denied';
      }
    }

    return Promise.reject(error);
  }
);

export default api;