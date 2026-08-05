import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddUser, assignDepartments, ChangePassword, DeleteUser, getAllusers } from "../apis/users.api";
import { toast } from "react-toastify";


export const useGetAllUsers = () => {
  return useQuery({ queryKey: ["GetUsers"], queryFn: getAllusers });
};

export const useDeleteUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user_id) => DeleteUser(user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetUsers"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => AddUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetUsers"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => ChangePassword(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetUsers"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  })
}

export const useAssignDepartments =  () => {
  return useMutation({
    mutationFn: (payload) => assignDepartments(payload),
    onError: (error) => {
      console.log(error?.response?.data)
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  })
}