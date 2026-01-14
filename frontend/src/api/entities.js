import { apiClient } from "./client";

const normalizeVehicle = (vehicle) => {
  if (!vehicle) return vehicle;
  const price =
    typeof vehicle.price === "string" || typeof vehicle.price === "number"
      ? Number(vehicle.price)
      : vehicle.price;
  return {
    ...vehicle,
    price,
    mileage:
      typeof vehicle.mileage === "string" || typeof vehicle.mileage === "number"
        ? Number(vehicle.mileage)
        : vehicle.mileage,
    body_type: vehicle.body_type ?? vehicle.bodyType ?? "",
    fuel_type: vehicle.fuel_type ?? vehicle.fuelType ?? "",
    stockNumber: vehicle.stockNumber ?? vehicle.stock_number,
  };
};

export const Vehicle = {
  async list() {
    const data = await apiClient.get("/vehicles");
    return Array.isArray(data) ? data.map(normalizeVehicle) : [];
  },
  async get(id) {
    const vehicle = await apiClient.get(`/vehicles/${id}`);
    return normalizeVehicle(vehicle);
  },
  create: (payload) => apiClient.post("/vehicles", payload),
  update: (id, payload) => apiClient.put(`/vehicles/${id}`, payload),
  delete: (id) => apiClient.delete(`/vehicles/${id}`),
  uploadInventoryCsv: (file) => apiClient.uploadCsv("/csv/inventory", file),
};

export const Dealer = {
  list: () => apiClient.get("/dealers"),
  create: (payload) => apiClient.post("/dealers", payload),
  update: (id, payload) => apiClient.put(`/dealers/${id}`, payload),
  delete: (id) => apiClient.delete(`/dealers/${id}`),
};

export const Customer = {
  list: () => apiClient.get("/customers"),
  create: (payload) => apiClient.post("/customers", payload),
  update: (id, payload) => apiClient.put(`/customers/${id}`, payload),
  delete: (id) => apiClient.delete(`/customers/${id}`),
};

export const Sale = {
  list: () => apiClient.get("/sales"),
  create: (payload) => apiClient.post("/sales", payload),
};

// Placeholder implementations for yet-to-be-wired resources
const emptyList = async () => [];
const noop = async (...args) => {
  console.info("[placeholder api] call", args);
  return {};
};

export const Enquiry = {
  list: emptyList,
  create: noop,
  update: noop,
};

export const Booking = {
  list: emptyList,
  create: noop,
  update: noop,
};

export const Staff = {
  list: emptyList,
};

export const CalendarBlock = {
  list: emptyList,
};

const defaultUser = { id: 1, role: "admin", email: "admin@example.com" };
export const User = {
  isAuthenticated: () => true,
  getProfile: async () => defaultUser,
};
