import axiosInstance from "./axiosInterceptor";

export const GetMyTasks = async () => {
  const res = await axiosInstance.get("my-tasks");
  return res.data;
};

export const GetAllTasks = async ({ status, page, pageSize, search, department_id, category_id } = {}) => {
  const params = {};

  if (status) params.status = status;
  if (page) params.page = page;
  if (pageSize) params.page_size = pageSize;
  if (search) params.search = search;
  if (department_id) params.department_id = department_id;
  if (category_id) params.category_id = category_id;

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

export const GetTaskCreationRequests = async (params) => {
  const res = await axiosInstance.get("task-creation-requests", { params });
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

export const TaskRequestByuser = async (params) => {
  const res = await axiosInstance.get("/task-creation-requests/my", { params });
  return res.data;
};

export const TaskActivityRecorder = async (payload) => {
  const res = await axiosInstance.post("/activities", payload);
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

export const AddSubtasksToTask = async (payload) => {
  const res = await axiosInstance.post("subtasks", payload);
  return res.data;
};

export const ReviseTask = async ({ taskId, bumpType, sub_tasks }) => {
  const res = await axiosInstance.post(`/tasks/${taskId}/revise`, {
    bump_type: bumpType,
    ...(sub_tasks ? { sub_tasks } : {}),
  });
  return res.data;
};

export const subTaskRequestByuser = async (params) => {
  const res = await axiosInstance.get("/subtask-update-requests/my", { params });
  return res.data;
};

export const subTaskUpdateAll = async(params) => {
  const res = await axiosInstance.get("/subtask-update-requests",{params});
  return res.data;
}

export const ApproveSubTaskRequest = async ({
  requestId,
  weightage_priority,
  subtask_priority,
  comment,
}) => {
  const res = await axiosInstance.put(
    `/subtask-update-requests/${requestId}/approve`,
    {
      weightage_priority: Number(weightage_priority),
      subtask_priority,
      comment,
    }
  );
  return res.data;
};

export const RejectSubTaskRequest = async ({ requestId, comment }) => {
  const res = await axiosInstance.put(
    `/subtask-update-requests/${requestId}/reject`,
    { comment }
  );
  return res.data;
};