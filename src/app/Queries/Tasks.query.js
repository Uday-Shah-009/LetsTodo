import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AddSubtasksToTask,
  ApproveSubTaskRequest,
  ApproveTask,
  createTask,
  GetAllTasks,
  GetMyTasks,
  getTaskActivities,
  GetTaskbyId,
  GetTaskCreationRequests,
  getTaskProgress,
  RejectSubTaskRequest,
  RejectTask,
  ReviseTask,
  subTaskRequestByuser,
  subTaskUpdateAll,
  TaskActivityRecorder,
  TaskRequestByuser,
  TaskTimeline,
  UpdateSubTaskStatus,
} from "../apis/tasks.api";
import { toast } from "react-toastify";

export const useGetMyTasks = (options = {}) => {
  return useQuery({
    queryKey: ["GetMytasks"],
    queryFn: GetMyTasks,
    ...options,
  });
};

export const useGetAllTasks = ({ status, page, pageSize, search, department_id, category_id, ...options } = {}) => {
  return useQuery({
    queryKey: [
      "GetAllTasks",
      status ?? "",
      page ?? 1,
      pageSize ?? 10,
      search ?? "",
      department_id ?? "",
      category_id ?? "",
    ],
    queryFn: () =>
      GetAllTasks({ status, page, pageSize, search, department_id, category_id }),
    ...options,
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
      queryClient.invalidateQueries({ queryKey: ["GetTaskTimeline"] });
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

export const useGetTaskRequests = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["GetTaskRequests", page, pageSize],
    queryFn: () => GetTaskCreationRequests({ page, page_size: pageSize }),
  });
};

export const useRejectTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => RejectTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetTaskRequests"] });
      queryClient.invalidateQueries({ queryKey: ["GetMytasks"] });
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
      queryClient.invalidateQueries({ queryKey: ["GetMytasks"] });
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

export const useTaskRequestByuser = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["TaskRequestByuser", page, pageSize],
    queryFn: () => TaskRequestByuser({ page, page_size: pageSize }),
  });
};

export const useTaskActivityRecorder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => TaskActivityRecorder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task-activities"],
      });
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

export const useAddSubTaskToExistingTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => AddSubtasksToTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetTaskById"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

export const useReviseTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => ReviseTask(payload),
    onSuccess: (createdTask) => {
      queryClient.invalidateQueries({ queryKey: ["GetAllTasks"] });
      queryClient.invalidateQueries({ queryKey: ["GetMytasks"] });
      queryClient.invalidateQueries({ queryKey: ["GetTaskById"] });
      return createdTask;
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

export const useSubTaskRequestByuser = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["SubTaskRequestByuser", page, pageSize],
    queryFn: () => subTaskRequestByuser({ page, page_size: pageSize }),
  });
};

export const useSubTaskUpdateAll = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["SubTaskUpdateAll", page, pageSize],
    queryFn: () => subTaskUpdateAll({ page, page_size: pageSize }),
  });
};

export const useApproveSubTaskRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => ApproveSubTaskRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SubTaskUpdateAll"] });
      queryClient.invalidateQueries({ queryKey: ["SubTaskRequestByuser"] });
      toast.success("Subtask request approved successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};

export const useRejectSubTaskRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => RejectSubTaskRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SubTaskUpdateAll"] });
      queryClient.invalidateQueries({ queryKey: ["SubTaskRequestByuser"] });
      toast.success("Subtask request rejected successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    },
  });
};
