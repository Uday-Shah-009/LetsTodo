import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ApproveTask,
  createTask,
  GetAllTasks,
  GetMyTasks,
  getTaskActivities,
  GetTaskbyId,
  GetTaskCreationRequests,
  getTaskProgress,
  RejectTask,
  TaskActivityRecorder,
  TaskRequestByuser,
  TaskTimeline,
  UpdateSubTaskStatus,
} from "../apis/tasks.api";
import { toast } from "react-toastify";

export const useGetMyTasks = () => {
  return useQuery({ queryKey: ["GetMytasks"], queryFn: GetMyTasks });
};

export const useGetAllTasks = ({ status, page, pageSize } = {}) => {
  return useQuery({
    queryKey: ["GetAllTasks", status ?? "", page ?? 1, pageSize ?? 10],
    queryFn: () => GetAllTasks({ status, page, pageSize }),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetAllTasks"] });
      queryClient.invalidateQueries({ queryKey: ["GetMytasks"] });
    },
    onError: (error) => {
      console.log("task creation error", error);
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

const fetchTaskById = ({ queryKey }) => {
  const [, id] = queryKey;
  return GetTaskbyId(id);
};

export const useGetTaskById = (id) => {
  return useQuery({
    queryKey: ["GetTaskById", id],
    queryFn: fetchTaskById,
    enabled: !!id,
  });
};

export const useUpdateSubTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => UpdateSubTaskStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetTaskById"] });
      queryClient.invalidateQueries({ queryKey: ["GetProgressById"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

const fetchProgressById = ({ queryKey }) => {
  const [, id] = queryKey;
  return getTaskProgress(id);
};

export const useGetProgress = (id) => {
  return useQuery({
    queryKey: ["GetProgressById", id],
    queryFn: fetchProgressById,
    enabled: !!id,
  });
};

export const useGetTaskRequests = () => {
  return useQuery({
    queryKey: ["GetTaskRequests"],
    queryFn: GetTaskCreationRequests,
  });
};

export const useRejectTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => RejectTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetTaskRequests"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

export const useApproveTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => ApproveTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetTaskRequests"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

const fetchTimelineById = ({ queryKey }) => {
  const [, taskId] = queryKey;
  return TaskTimeline(taskId);
};

export const useGetTaskTimeLine = (taskId) => {
  return useQuery({
    queryKey: ["GetTaskTimeline", taskId],
    queryFn: fetchTimelineById,
    enabled: !!taskId,
  });
};

export const useTaskRequestByuser = () => {
  return useQuery({
    queryKey: ["TaskRequestByuser"],
    queryFn: TaskRequestByuser,
  });
};

export const useTaskActivityRecorder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => TaskActivityRecorder(payload),
    onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["task-activities"]
    })
      },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

export const useGetTaskActivities = (taskId, page, pageSize = 10) => {
  return useQuery({
    queryKey: ["task-activities", taskId, page, pageSize],
    queryFn: () => getTaskActivities(taskId, page, pageSize),
    enabled: !!taskId,
  });
};
