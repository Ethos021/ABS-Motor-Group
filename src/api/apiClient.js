// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken() {
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response.data;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response.data;
  }

  async getProfile() {
    const response = await this.request('/auth/profile');
    return response.data;
  }

  logout() {
    this.setToken(null);
  }

  // Generic CRUD operations
  async list(resource, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/${resource}?${queryString}` : `/${resource}`;
    const response = await this.request(endpoint);
    return response.data;
  }

  async get(resource, id) {
    const response = await this.request(`/${resource}/${id}`);
    return response.data;
  }

  async create(resource, data) {
    const response = await this.request(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async update(resource, id, data) {
    const response = await this.request(`/${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async delete(resource, id) {
    const response = await this.request(`/${resource}/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  }
}

export default new APIClient();
