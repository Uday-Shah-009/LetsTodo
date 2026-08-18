import { useAuthStore } from "../../store/authStore";
import { redirect } from "@tanstack/react-router";
import { getTokenRole, isTokenExpired } from "../../utils/token";

export function checkUserRole() {
  const { token, logout } = useAuthStore.getState();

  if (!token || isTokenExpired(token)) {
    logout();
    throw redirect({ to: "/" });
  }

  const role = getTokenRole(token);

  if (!role || role !== "admin") {
    throw redirect({ to: "/" });
  }
}