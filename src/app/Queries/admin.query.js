import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateDepartment,
  GetDepartments,
  getTimeLine,
  GetCategories,
  CreateCategory,
  DeleteCategory,
  UpdateDepartment,
} from "../apis/admin.api";
import { toast } from "react-toastify";

export const useCreateDepartment = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => CreateDepartment(payload),
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["getDepartments"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

export const useGetDepartments = () => {
  return useQuery({
    queryKey: ["getDepartments"],
    queryFn: GetDepartments,
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => UpdateDepartment(payload),
    onSuccess: (res) => {
      toast.success(res?.message || "Department updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getDepartments"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

export const useGetTimeLine = () => {
  return useQuery({
    queryKey: ["getTimeLine"],
    queryFn: getTimeLine,
  });
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["getCategories"],
    queryFn: GetCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => CreateCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCategories"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId) => DeleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCategories"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};
