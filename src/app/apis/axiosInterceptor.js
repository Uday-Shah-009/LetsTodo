import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import { isTokenExpired } from "../../utils/token";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    if (isTokenExpired(token)) {
      useAuthStore.getState().logout();
      return Promise.reject(new axios.Cancel("Session expired. Please log in again."));
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;