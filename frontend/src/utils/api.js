import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('messmate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updateProfile: (userData) => api.put('/auth/me', userData),
};

// Mess API calls
export const messAPI = {
  getAllMesses: (params) => api.get('/messes', { params }),
  getMess: (id) => api.get(`/messes/${id}`),
  createMess: (messData) => api.post('/messes', messData),
  updateMess: (id, messData) => api.put(`/messes/${id}`, messData),
  deleteMess: (id) => api.delete(`/messes/${id}`),
  getMessMenu: (id) => api.get(`/messes/${id}/menu`),
  addMenuItem: (id, menuItem) => api.post(`/messes/${id}/menu`, menuItem),
  updateMenuItem: (messId, itemId, menuItem) => api.put(`/messes/${messId}/menu/${itemId}`, menuItem),
  deleteMenuItem: (messId, itemId) => api.delete(`/messes/${messId}/menu/${itemId}`),
  getMessDetails: (id) => api.get(`/messes/${id}/details`),

};

// Order API calls
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my'),
  getProviderOrders: () => api.get('/orders/provider'),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  requestAbsence: (orderId, absenceData) => api.post(`/orders/${orderId}/absence`, absenceData),
  updateAbsenceStatus: (orderId, absenceId, status) => 
    api.patch(`/orders/${orderId}/absence/${absenceId}`, { status }),
  getProviderAbsences: () => api.get('/orders/absences/provider'),
};

// Notification API calls
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.post(`/notifications/${id}/read`),

};

export default api;