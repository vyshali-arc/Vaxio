// Production API URL fallback or development relative proxy /api
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Standard fetch helper with Bearer token injection and consistent error handling
 */
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('vaxio_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, error.message);
    throw error;
  }
};

export const api = {
  // Auth Endpoints
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () => request('/auth/me'),

  // Vaccines Endpoints
  getVaccines: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/vaccines${query ? `?${query}` : ''}`);
  },

  getVaccineById: (id) => request(`/vaccines/${id}`),

  addVaccine: (vaccineData) =>
    request('/vaccines', {
      method: 'POST',
      body: JSON.stringify(vaccineData),
    }),

  updateVaccine: (id, vaccineData) =>
    request(`/vaccines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vaccineData),
    }),

  completeVaccine: (id, completeData) =>
    request(`/vaccines/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify(completeData),
    }),

  deleteVaccine: (id) =>
    request(`/vaccines/${id}`, {
      method: 'DELETE',
    }),

  getDashboardStats: () => request('/vaccines/dashboard/stats'),

  // Records Endpoints
  getRecords: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/records${query ? `?${query}` : ''}`);
  },

  getRecordById: (id) => request(`/records/${id}`),

  deleteRecord: (id) =>
    request(`/records/${id}`, {
      method: 'DELETE',
    }),

  // User Profile Endpoints
  getProfile: () => request('/user/profile'),

  updateProfile: (profileData) =>
    request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  changePassword: (passwordData) =>
    request('/user/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    }),
};
