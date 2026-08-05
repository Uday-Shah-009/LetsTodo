import axiosInstance from "./axiosInterceptor";

export const LoginUser = async (formData) => {
  const res = await axiosInstance.post("login", formData);
  return res.data;
};