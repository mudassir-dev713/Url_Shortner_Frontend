// api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach tokens to each request
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  if (refreshToken) {
    config.headers['x-refresh-token'] = refreshToken; // Optional
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

// 💡 Interceptor should always be applied, not conditionally
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

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

        processQueue(null, newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        // Prevent infinite loop if already on /login
        // if (window.location.pathname !== '/login') {
        //   window.location.replace('/login');
        // }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
