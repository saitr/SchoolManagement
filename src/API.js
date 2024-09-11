import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      config.headers['Authorization'] = 'Bearer ' + access_token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh_token = localStorage.getItem('refresh_token');
        const response = await axiosInstance.post('/token/refresh/', {
          refresh: refresh_token,
        });
        if (response.status === 200) {
          localStorage.setItem('access_token', response.data.access);
          return axiosInstance(originalRequest);
        }
      } catch (error) {
        console.error('Error refreshing access token:', error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;