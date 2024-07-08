import axios, { CanceledError } from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000/',
  
});

// Add a request interceptor to set the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('x-auth-token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
export { CanceledError };