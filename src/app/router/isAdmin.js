import { useAuthStore } from "../../store/authStore";
import { redirect } from "@tanstack/react-router";
import { getTokenRole } from "../../utils/token";

export function checkUserRole() {
  const token = useAuthStore.getState().token;

  const role = getTokenRole(token);

  if (!role || role !== "admin") {
    throw redirect({ to: "/" });
  }
}