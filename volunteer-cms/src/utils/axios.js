import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // เงียบๆ ไม่ต้อง log error
    return Promise.reject({
      message: 'กรุณาเข้าสู่ระบบใหม่'
    });
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // เงียบๆ ไม่ต้อง log error
    return Promise.reject({
      message: 'กรุณาเข้าสู่ระบบใหม่'
    });
  }
);

export default api;