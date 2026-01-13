import apiClient from './apiClient.js';

// Vehicle entity wrapper
export const Vehicle = {
  async list(sortBy = '-createdAt') {
    const params = sortBy ? { sortBy } : {};
    return await apiClient.list('vehicles', params);
  },
  
  async get(id) {
    return await apiClient.get('vehicles', id);
  },
  
  async create(data) {
    return await apiClient.create('vehicles', data);
  },
  
  async update(id, data) {
    return await apiClient.update('vehicles', id, data);
  },
  
  async delete(id) {
    return await apiClient.delete('vehicles', id);
  }
};

// Enquiry entity wrapper
export const Enquiry = {
  async list(sortBy = '-createdAt') {
    const params = sortBy ? { sortBy } : {};
    return await apiClient.list('enquiries', params);
  },
  
  async get(id) {
    return await apiClient.get('enquiries', id);
  },
  
  async create(data) {
    return await apiClient.create('enquiries', data);
  },
  
  async update(id, data) {
    return await apiClient.update('enquiries', id, data);
  },
  
  async delete(id) {
    return await apiClient.delete('enquiries', id);
  }
};

// Staff entity wrapper
export const Staff = {
  async list() {
    return await apiClient.list('staff');
  },
  
  async get(id) {
    return await apiClient.get('staff', id);
  },
  
  async create(data) {
    return await apiClient.create('staff', data);
  },
  
  async update(id, data) {
    return await apiClient.update('staff', id, data);
  },
  
  async delete(id) {
    return await apiClient.delete('staff', id);
  }
};

// CalendarBlock entity wrapper
export const CalendarBlock = {
  async list(params = {}) {
    return await apiClient.list('calendar-blocks', params);
  },
  
  async get(id) {
    return await apiClient.get('calendar-blocks', id);
  },
  
  async create(data) {
    return await apiClient.create('calendar-blocks', data);
  },
  
  async update(id, data) {
    return await apiClient.update('calendar-blocks', id, data);
  },
  
  async delete(id) {
    return await apiClient.delete('calendar-blocks', id);
  }
};

// Booking entity wrapper
export const Booking = {
  async list(sortBy = '-scheduledDatetime') {
    const params = sortBy ? { sortBy } : {};
    return await apiClient.list('bookings', params);
  },
  
  async get(id) {
    return await apiClient.get('bookings', id);
  },
  
  async create(data) {
    return await apiClient.create('bookings', data);
  },
  
  async update(id, data) {
    return await apiClient.update('bookings', id, data);
  },
  
  async delete(id) {
    return await apiClient.delete('bookings', id);
  }
};

// Auth wrapper
export const User = {
  async login(email, password) {
    return await apiClient.login(email, password);
  },
  
  async register(userData) {
    return await apiClient.register(userData);
  },
  
  async getProfile() {
    return await apiClient.getProfile();
  },
  
  logout() {
    apiClient.logout();
  },
  
  isAuthenticated() {
    return !!apiClient.getToken();
  }
};