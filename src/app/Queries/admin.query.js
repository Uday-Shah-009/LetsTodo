import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateDepartment,
  GetDepartments,
  getTimeLine,
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

export const useGetTimeLine = () => {
  return useQuery({
    queryKey: ["getTimeLine"],
    queryFn: getTimeLine,
  });
};
