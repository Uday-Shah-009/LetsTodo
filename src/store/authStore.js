import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


const _k = import.meta.env.VITE_ENCRYPTION_KEY;

const xorEncode = (str) => {
  const encoded = str
    .split("")
    .map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ _k.charCodeAt(i % _k.length)),
    )
    .join("");
  return btoa(encoded);
};

const xorDecode = (encoded) => {
  try {
    const raw = atob(encoded);
    return raw
      .split("")
      .map((c, i) =>
        String.fromCharCode(c.charCodeAt(0) ^ _k.charCodeAt(i % _k.length)),
      )
      .join("");
  } catch {
    return null;
  }
};

const encryptedStorage = createJSONStorage(() => ({
  getItem: (name) => {
    try {
      const raw = localStorage.getItem(name);
      if (!raw) return null;
      return xorDecode(raw);
    } catch {
      localStorage.removeItem(name);
      return null;
    }
  },
  setItem: (name, value) => {
  
    try {
      const parsed = JSON.parse(value);
      if (!parsed?.state?.token) {
        localStorage.removeItem(name);
        return;
      }
    } catch {
      // If we can't parse, fall through and write normally
    }
    localStorage.setItem(name, xorEncode(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
}));


export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      username: null,
      isAuthenticated: false,

      login: (apiResponse) =>
        set({
          token: apiResponse.access_token,
          username: apiResponse.username,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          username: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-v2",
      storage: encryptedStorage,
    },
  ),
);