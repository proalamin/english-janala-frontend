import axios from "axios";

const TOKEN_KEY = "ej-auth-tokens";

export function getTokens() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setTokens(tokens) {
  try {
    if (tokens) {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Storage may be unavailable; ignore.
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const tokens = getTokens();
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setTokens(null);
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error) {
  if (!error) {
    return "An unknown error occurred.";
  }

  if (!error.response) {
    return "Network error. Please check the backend server and try again.";
  }

  const data = error.response.data;

  if (typeof data === "string") {
    return data;
  }

  if (data?.detail) {
    return data.detail;
  }

  const fieldMessages = [];
  if (data && typeof data === "object") {
    Object.entries(data).forEach(([field, value]) => {
      if (Array.isArray(value)) {
        fieldMessages.push(`${field}: ${value.join(" ")}`);
      } else if (typeof value === "string") {
        fieldMessages.push(`${field}: ${value}`);
      }
    });
  }

  return fieldMessages.length
    ? fieldMessages.join(" | ")
    : "Something went wrong while communicating with the API.";
}
