import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { queryClient } from "../app/queryClient";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      username: null,
      isAuthenticated: false,

      login: (apiResponse) => {
        queryClient.clear();
        set({
          token: apiResponse.access_token,
          username: apiResponse.username,
          isAuthenticated: true,
        });
      },

      logout: () => {
        queryClient.clear();
        set({
          token: null,
          username: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);