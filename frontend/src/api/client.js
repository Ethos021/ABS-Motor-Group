import { API_BASE_URL } from "@/lib/utils";

const buildUrl = (path) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
};

const toJson = async (response) => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }
  if (response.status === 204) return null;
  return response.json();
};

export const apiClient = {
  get: async (path) => {
    const res = await fetch(buildUrl(path));
    return toJson(res);
  },
  post: async (path, body) => {
    const res = await fetch(buildUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return toJson(res);
  },
  put: async (path, body) => {
    const res = await fetch(buildUrl(path), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return toJson(res);
  },
  delete: async (path) => {
    const res = await fetch(buildUrl(path), { method: "DELETE" });
    return toJson(res);
  },
  uploadCsv: async (path, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(buildUrl(path), {
      method: "POST",
      body: formData,
    });
    return toJson(res);
  },
};
