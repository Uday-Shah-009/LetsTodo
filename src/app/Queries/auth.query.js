import { useMutation } from "@tanstack/react-query";
import { LoginUser } from "../apis/auth.api.js";
import { useAuthStore } from "../../store/authStore.js";
import { toast } from "react-toastify";

export const useLoginMutation = () => {
  const loginState = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (loginInfo) => LoginUser(loginInfo),
    onSuccess: (data) => {
      loginState(data);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Invalid credentials");
    },
  });
};