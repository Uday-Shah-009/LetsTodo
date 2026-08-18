import { useAuthStore } from "../../store/authStore";
import { redirect } from "@tanstack/react-router";
import { isTokenExpired } from "../../utils/token";
import { toast } from "react-toastify";

export const requireAuth = (navigate) => {
  const { token, isAuthenticated, logout } = useAuthStore.getState();

  if (!isAuthenticated || !token || isTokenExpired(token)) {
    if (isAuthenticated) {
      logout();
      toast.error("Session expired. Please log in again.");
    }
    if (typeof navigate === "function") {
      navigate({ to: "/" });
    } else {
      throw redirect({ to: "/" });
    }
  }
};