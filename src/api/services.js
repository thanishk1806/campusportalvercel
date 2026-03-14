import api from './axios'

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
}

// Complaints
export const complaintAPI = {
  // Student
  create: (data) => api.post('/student/complaints', data),
  getMyComplaints: () => api.get('/student/complaints'),
  rate: (id, rating) => api.post(`/student/complaints/${id}/rate`, { rating }),

  // Staff
  getAssigned: () => api.get('/staff/complaints'),
  updateStatus: (id, status) => api.put(`/staff/complaints/${id}/status`, { status }),

  // Admin
  getAll: () => api.get('/admin/complaints'),
  assign: (id, staffId) => api.put(`/admin/complaints/${id}/assign`, { staffId }),
  adminUpdateStatus: (id, status) => api.put(`/admin/complaints/${id}/status`, { status }),

  // Shared
  getById: (id) => api.get(`/complaints/${id}`),
  addComment: (data) => api.post('/complaints/comment', data),
}

// Admin
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getStaffByDept: (deptId) => api.get(`/admin/staff/department/${deptId}`),
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (data) => api.post('/admin/departments', data),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
}

// Shared
export const sharedAPI = {
  getDepartments: () => api.get('/departments'),
  getCategories: () => api.get('/categories'),
  getNotifications: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markNotificationsRead: () => api.post('/notifications/mark-read'),
}

// AI & Analytics
export const aiAPI = {
  getEstimate: (categoryId) => api.get(`/ai/estimate?categoryId=${categoryId}`),
  getDeptPerformance: () => api.get('/ai/performance/departments'),
  getStaffPerformance: () => api.get('/ai/performance/staff'),
}
