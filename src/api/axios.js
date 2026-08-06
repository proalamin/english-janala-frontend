import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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
