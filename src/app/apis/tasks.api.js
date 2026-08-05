import axiosInstance from "./axiosInterceptor";

export const GetMyTasks = async () => {
  const res = await axiosInstance.get("my-tasks");
  return res.data;
};

export const GetAllTasks = async ({ status, page, pageSize } = {}) => {
  const params = {};

  if (status) params.status = status;
  if (page) params.page = page;
  if (pageSize) params.page_size = pageSize;

  const res = await axiosInstance.get("tasks", {
    params,
  });
  return res.data;
};

export const createTask = async (payload) => {
  const res = await axiosInstance.post("tasks", payload);
  return res.data;
};

export const GetTaskbyId = async (task_id) => {
  const res = await axiosInstance.get(`tasks/${task_id}`);
  return res.data;
};

export const UpdateSubTaskStatus = async (sub_task_id) => {
  const res = await axiosInstance.put(`subtasks/${sub_task_id}/complete`);
  return res.data;
};

export const getTaskProgress = async (task_id) => {
  const res = await axiosInstance.get(`tasks/${task_id}/progress`);
  return res.data;
};

export const GetTaskCreationRequests = async () => {
  const res = await axiosInstance.get("task-creation-requests");
  return res.data;
};

export const RejectTask = async (payload) => {
  const { request_id, comment } = payload;
  const res = await axiosInstance.put(
    `/task-creation-requests/${request_id}/reject`,
    { comment: comment },
  );
  return res.data;
};

export const ApproveTask = async (payload) => {
  const { request_id, comment, approved_payload } = payload;
  const res = await axiosInstance.put(
    `/task-creation-requests/${request_id}/approve`,
    {
      comment: comment,
      approved_payload: approved_payload,
    },
  );
  return res.data;
};

export const TaskTimeline = async (task_id) => {
  const res = await axiosInstance.get(`/tasks/${task_id}/timeline`);
  return res.data;
};

export const TaskRequestByuser = async () => {
  const res = await axiosInstance.get("/task-creation-requests/my");
  return res.data;
};

export const TaskActivityRecorder = async (payload) => {
  const res = await axiosInstance.post("/activities", payload);
  console.log(res.data);
  return res.data;
};

export const getTaskActivities = async (taskId, page, pageSize) => {
  const res = await axiosInstance.get(`tasks/${taskId}/activities`, {
    params: {
      page,
      page_size: pageSize,
    },
  });
  return res.data;
};
