import axios from 'axios';
export const BASE_URL = 'https://fiing-7wt3.onrender.com';
// export const BASE_URL = 'http://localhost:8000';

export const getToken = () => {
  const token = localStorage.getItem('authToken');
  return token;
};

const api = axios.create({
  baseURL: BASE_URL, // Set your base URL here
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
