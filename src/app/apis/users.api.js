import axiosInstance from "./axiosInterceptor";

export const getAllusers = async () => {
  const res = await axiosInstance.get("users");
  return res.data;
};

export const DeleteUser = async (user_id) => {
  const res = await axiosInstance.delete(`users/${user_id}`);
  return res.data;
};

export const AddUser = async (payload) => {
  const res = await axiosInstance.post("register", payload);
  return res.data;
};

export const ChangePassword = async (payload) => {
  const res = await axiosInstance.post("change-password", payload);
  return res.data;
};

export const assignDepartments = async (paylaod) => {
  const { user_id, department_ids } = paylaod;
  const res = await axiosInstance.put(`/users/${user_id}/departments`, {
    department_ids: department_ids,
  });
  return res.data;
};
