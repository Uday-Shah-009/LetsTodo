import { useAuthStore } from "../store/authStore";

export const decodeJWT = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const getTokenRole = (token) => decodeJWT(token)?.role ?? null;

export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded?.exp) return false;
  return Date.now() >= decoded.exp * 1000;
};

export const useUser = () => {
  const token = useAuthStore((s) => s.token);
  return decodeJWT(token);
};
