// Centralized API Service for Student Information Management System
// Uses VITE_API_URL in production (Netlify -> Render) or falls back to local proxy/localhost:5000

const API_BASE = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : '';

// Helper for standardized fetch calls with friendly error handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html') && url.startsWith('/api')) {
      const configError = new Error(
        'Backend API URL (VITE_API_URL) is not configured in Netlify environment variables. Please set VITE_API_URL in Netlify Site Settings to your deployed Render URL.'
      );
      configError.isConfigError = true;
      throw configError;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        (data && (data.message || (data.errors && Object.values(data.errors).join(', ')))) ||
        `HTTP Error ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // Check if network failed completely (e.g., backend offline)
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const offlineError = new Error(
        `Unable to reach backend API at ${API_BASE || 'localhost:5000'}. Make sure your Node.js backend server is running and accessible.`
      );
      offlineError.isNetworkError = true;
      throw offlineError;
    }
    throw err;
  }
}

export const api = {
  // Health & diagnostics
  getHealth: () => request('/api/health'),

  // Dashboard metrics
  getDashboardStats: () => request('/api/students/stats'),

  // Students CRUD
  getStudents: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.department && params.department !== 'All') query.append('department', params.department);
    if (params.semester && params.semester !== 'All') query.append('semester', params.semester);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    return request(`/api/students${queryString ? `?${queryString}` : ''}`);
  },

  getStudentById: (id) => request(`/api/students/${encodeURIComponent(id)}`),

  createStudent: (studentData) =>
    request('/api/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),

  updateStudent: (id, studentData) =>
    request(`/api/students/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    }),

  deleteStudent: (id) =>
    request(`/api/students/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
};

export default api;
