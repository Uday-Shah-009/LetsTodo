import axiosInstance from "./axiosInterceptor";

export const CreateDepartment = async (payload) => {
  const res = await axiosInstance.post("/departments", payload);
  return res.data;
};

export const GetDepartments = async () => {
  const res = await axiosInstance.get("/departments");
  return res.data;
};

export const UpdateDepartment = async (payload) => {
  const { id, deptname } = payload;
  const department_id = id;
  const res = await axiosInstance.put(`/departments/${department_id}`, {
    name: deptname,
  });
  return res.data;
};

export const getTimeLine = async () => {
  const res = await axiosInstance.get("/timeline");
  return res.data;
};

export const GetCategories = async () => {
  const res = await axiosInstance.get("/categories");
  return res.data;
};

export const CreateCategory = async (payload) => {
  const res = await axiosInstance.post("/categories", payload);
  return res.data;
};

export const DeleteCategory = async (categoryId) => {
  const res = await axiosInstance.delete(`/categories/${categoryId}`);
  return res.data;
};
