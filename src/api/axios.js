import axios from 'axios';

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    'Accept': 'application/json'
  },
  withCredentials: false
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor untuk menangani 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired atau tidak valid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)


export default api;
