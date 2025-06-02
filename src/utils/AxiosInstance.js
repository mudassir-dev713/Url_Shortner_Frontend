// api/axiosInstance.js
import axios from 'axios';
import { getLoginStatus } from '../api/AuthStatus';

let accessToken = localStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach tokens to every request
axiosInstance.interceptors.request.use((config) => {
  accessToken = localStorage.getItem('accessToken');
  refreshToken = localStorage.getItem('refreshToken');

  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  if (refreshToken) {
    config.headers['x-refresh-token'] = refreshToken; // Optional: pass refresh token as custom header
  }

  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, newAccessToken = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(newAccessToken);
    }
  });
  failedQueue = [];
};

if (getLoginStatus()) {
  axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch(Promise.reject);
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`,
            {
              refreshToken: localStorage.getItem('refreshToken'),
            }
          );

          const newAccessToken = res.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          accessToken = newAccessToken;

          processQueue(null, newAccessToken);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest); // retry request
        } catch (err) {
          processQueue(err, null);
          localStorage.clear();
          window.location.href = '/login'; // logout on failure
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}

export default axiosInstance;
