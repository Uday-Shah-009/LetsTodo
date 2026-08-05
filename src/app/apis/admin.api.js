import axiosInstance from "./axiosInterceptor";

export const CreateDepartment = async(payload) => {
  const res = await axiosInstance.post("/departments", payload);
  return res.data
}

export const GetDepartments = async() => {
  const res = await axiosInstance.get("/departments");
  return res.data
}

export const getTimeLine = async() => {
  const res = await axiosInstance.get("/timeline");
  return res.data
}

