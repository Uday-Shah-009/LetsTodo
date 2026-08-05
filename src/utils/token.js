import { useAuthStore } from "../store/authStore";


export const decodeJWT = (token) => {
  if (!token) return null;
  try {
    const payloadB64 = token.split(".")[1];
    if (!payloadB64) return null;
    // Convert base64url → base64, then decode
    const base64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "==".slice(0, (4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};


export const getTokenRole = (token) => decodeJWT(token)?.role ?? null;


export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded?.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};


export const useUser = () => {
  const token = useAuthStore((s) => s.token);
  return decodeJWT(token);
};
