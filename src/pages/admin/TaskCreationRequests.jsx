import React, { useState } from "react";
import { Eye } from "lucide-react";
import TaskReviewModal from "../../components/tasks/TaskReviewModal";
import SubTaskReviewModal from "../../components/tasks/SubTaskReviewModal";
import {
  useGetTaskRequests,
  useSubTaskUpdateAll,
} from "../../app/Queries/Tasks.query";

export default function TaskRequestsPage() {
  const [taskReqPage, setTaskReqPage] = useState(1);
  const [taskReqPageSize, setTaskReqPageSize] = useState(10);
  const [subTaskReqPage, setSubTaskReqPage] = useState(1);
  const [subTaskReqPageSize, setSubTaskReqPageSize] = useState(10);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isSubTaskModalOpen, setIsSubTaskModalOpen] = useState(false);
  const [selectedSubTaskRequest, setSelectedSubTaskRequest] = useState(null);

  const { data, isPending } = useGetTaskRequests(taskReqPage, taskReqPageSize);
  const { data: subTaskData, isPending: isSubTaskPending } = useSubTaskUpdateAll(
    subTaskReqPage,
    subTaskReqPageSize
  );

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return `
          bg-green-100 text-green-700 border border-green-200
          dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20
        `;

      case "rejected":
        return `
          bg-red-100 text-red-700 border border-red-200
          dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20
        `;

      default:
        return `
          bg-amber-100 text-amber-700 border border-amber-200
          dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20
        `;
    }
  };

  const handleOpenReview = (task) => {
    if (task?.status?.toLowerCase() !== "pending") {
      return;
    }
    setSelectedTask(task);
    setIsOpen(true);
  };

  const handleCloseReview = () => {
    setIsOpen(false);
    setSelectedTask(null);
  };

  const handleOpenSubTaskReview = (request) => {
    if (request?.status?.toLowerCase() !== "pending") {
      return;
    }
    setSelectedSubTaskRequest(request);
    setIsSubTaskModalOpen(true);
  };

  const handleCloseSubTaskReview = () => {
    setIsSubTaskModalOpen(false);
    setSelectedSubTaskRequest(null);
  };

  if (isPending || isSubTaskPending) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] dark:bg-[#020817] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500/20 dark:border-blue-500/20 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin" />

          <p className="text-[#667085] dark:text-[#94a3b8] text-sm font-medium animate-pulse">
            Loading task requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] dark:bg-[#020817] text-[#101828] dark:text-white p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* TASK CREATION REQUESTS SECTION */}
        <div className="space-y-4">
          {/* HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Task Requests
              </h1>

              <p className="text-[#667085] dark:text-[#94a3b8] mt-2">
                Review all task creation requests.
              </p>
            </div>

            {data?.items && data.items.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-[#667085] dark:text-[#94a3b8]">
                <label htmlFor="taskReqPageSize" className="text-xs font-medium">
                  Show:
                </label>
                <select
                  id="taskReqPageSize"
                  value={taskReqPageSize}
                  onChange={(e) => {
                    setTaskReqPageSize(Number(e.target.value));
                    setTaskReqPage(1);
                  }}
                  className="rounded-xl border border-zinc-200 dark:border-[#1e293b] bg-white dark:bg-[#09142a] px-3 py-1.5 text-xs text-[#101828] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}
          </div>

          {/* TABLE */}
          <div
            className="
              bg-white dark:bg-[#09142a]
              border border-zinc-200 dark:border-[#1e293b]
              rounded-3xl
              overflow-hidden
              transition-colors duration-300
            "
          >
            {/* TABLE HEADER */}
            <div
              className="
                grid grid-cols-5 gap-4
                px-6 py-5
                border-b border-zinc-200 dark:border-[#1e293b]
                text-sm
                text-[#667085] dark:text-[#94a3b8]
                font-medium
              "
            >
              <div>Task Name</div>
              <div>Requested By</div>
              <div>Status</div>
              <div>Subtask Count</div>
              <div className="text-center">Action</div>
            </div>

            {/* TABLE BODY */}
            <div>
              {data?.items?.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <p className="text-[#667085] dark:text-[#94a3b8]">
                    No task requests found.
                  </p>
                </div>
              ) : (
                data?.items?.map((request) => {
                  const payload = request?.requested_payload?.payload;
                  const taskName = payload?.title;
                  const requestedBy = request?.requested_by?.name;
                  const status = request?.status;
                  const subTaskCount =
                    payload?.sub_task_count || payload?.sub_tasks?.length || 0;

                  return (
                    <div
                      key={request.id}
                      className="
                        grid grid-cols-5 gap-4
                        px-6 py-5
                        border-b border-zinc-200 dark:border-[#1e293b]
                        last:border-none
                        items-center
                        hover:bg-zinc-100 dark:hover:bg-[#0b1730]
                        transition-all duration-200
                      "
                    >
                      {/* TASK NAME */}
                      <div className="font-medium text-[#101828] dark:text-white">
                        {taskName}
                      </div>

                      {/* REQUESTED BY */}
                      <div className="text-[#667085] dark:text-[#94a3b8]">
                        {requestedBy}
                      </div>

                      {/* STATUS */}
                      <div>
                        <span
                          className={`
                            px-3 py-1 rounded-xl text-sm capitalize
                            ${getStatusStyle(status)}
                          `}
                        >
                          {status}
                        </span>
                      </div>

                      {/* SUBTASK COUNT */}
                      <div className="text-[#101828] dark:text-white">
                        {subTaskCount}
                      </div>

                      {/* ACTION */}
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleOpenReview(request)}
                          disabled={status?.toLowerCase() !== "pending"}
                          className={`
                            text-white
                            transition-all duration-200
                            rounded-2xl
                            px-4 py-2
                            flex items-center gap-2
                            text-sm font-medium
                            shadow-sm
                            ${
                              status?.toLowerCase() !== "pending"
                                ? "bg-gray-400 cursor-not-allowed opacity-60"
                                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                            }
                          `}
                        >
                          <Eye className="w-4 h-4" />
                          Review
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* TASK REQUESTS PAGINATION FOOTER */}
            {data?.total_pages > 1 && (
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-zinc-200 dark:border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setTaskReqPage((prev) => Math.max(prev - 1, 1))}
                  disabled={taskReqPage <= 1}
                  className="rounded-xl border border-zinc-200 dark:border-[#1e293b] px-4 py-2 text-xs font-medium transition hover:bg-zinc-100 dark:hover:bg-[#0b1730] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs text-[#667085] dark:text-[#94a3b8]">
                  Page {data?.page ?? taskReqPage} of {data?.total_pages ?? 1}
                </span>
                <button
                  type="button"
                  onClick={() => setTaskReqPage((prev) => Math.min(prev + 1, data?.total_pages ?? 1))}
                  disabled={taskReqPage >= (data?.total_pages ?? 1)}
                  className="rounded-xl border border-zinc-200 dark:border-[#1e293b] px-4 py-2 text-xs font-medium transition hover:bg-zinc-100 dark:hover:bg-[#0b1730] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SUBTASK UPDATE REQUESTS SECTION */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Subtask Update Requests
              </h2>

              <p className="text-[#667085] dark:text-[#94a3b8] mt-2">
                Review all subtask update requests.
              </p>
            </div>

            {subTaskData?.items && subTaskData.items.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-[#667085] dark:text-[#94a3b8]">
                <label htmlFor="subTaskReqPageSize" className="text-xs font-medium">
                  Show:
                </label>
                <select
                  id="subTaskReqPageSize"
                  value={subTaskReqPageSize}
                  onChange={(e) => {
                    setSubTaskReqPageSize(Number(e.target.value));
                    setSubTaskReqPage(1);
                  }}
                  className="rounded-xl border border-zinc-200 dark:border-[#1e293b] bg-white dark:bg-[#09142a] px-3 py-1.5 text-xs text-[#101828] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}
          </div>

          <div
            className="
              bg-white dark:bg-[#09142a]
              border border-zinc-200 dark:border-[#1e293b]
              rounded-3xl
              overflow-hidden
              transition-colors duration-300
            "
          >
            {/* TABLE HEADER */}
            <div
              className="
                grid grid-cols-5 gap-4
                px-6 py-5
                border-b border-zinc-200 dark:border-[#1e293b]
                text-sm
                text-[#667085] dark:text-[#94a3b8]
                font-medium
              "
            >
              <div>Subtask ID</div>
              <div>Requested By</div>
              <div>Status</div>
              <div>Note</div>
              <div className="text-center">Action</div>
            </div>

            {/* TABLE BODY */}
            <div>
              {!subTaskData?.items || subTaskData.items.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <p className="text-[#667085] dark:text-[#94a3b8]">
                    No subtask update requests found.
                  </p>
                </div>
              ) : (
                subTaskData.items.map((request) => {
                  const subtaskId = request?.sub_task_id;
                  const requestedBy = request?.requested_by?.name;
                  const status = request?.status;
                  const note = request?.requested_changes?.note || "-";

                  return (
                    <div
                      key={request.id}
                      className="
                        grid grid-cols-5 gap-4
                        px-6 py-5
                        border-b border-zinc-200 dark:border-[#1e293b]
                        last:border-none
                        items-center
                        hover:bg-zinc-100 dark:hover:bg-[#0b1730]
                        transition-all duration-200
                      "
                    >
                      {/* SUBTASK ID */}
                      <div className="font-medium text-[#101828] dark:text-white">
                        Subtask #{subtaskId}
                      </div>

                      {/* REQUESTED BY */}
                      <div className="text-[#667085] dark:text-[#94a3b8]">
                        {requestedBy}
                      </div>

                      {/* STATUS */}
                      <div>
                        <span
                          className={`
                            px-3 py-1 rounded-xl text-sm capitalize
                            ${getStatusStyle(status)}
                          `}
                        >
                          {status}
                        </span>
                      </div>

                      {/* NOTE */}
                      <div className="text-[#101828] dark:text-white truncate">
                        {note}
                      </div>

                      {/* ACTION */}
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleOpenSubTaskReview(request)}
                          disabled={status?.toLowerCase() !== "pending"}
                          className={`
                            text-white
                            transition-all duration-200
                            rounded-2xl
                            px-4 py-2
                            flex items-center gap-2
                            text-sm font-medium
                            shadow-sm
                            ${
                              status?.toLowerCase() !== "pending"
                                ? "bg-gray-400 cursor-not-allowed opacity-60"
                                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                            }
                          `}
                        >
                          <Eye className="w-4 h-4" />
                          Review
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* SUBTASK UPDATE REQUESTS PAGINATION FOOTER */}
            {subTaskData?.total_pages > 1 && (
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-zinc-200 dark:border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setSubTaskReqPage((prev) => Math.max(prev - 1, 1))}
                  disabled={subTaskReqPage <= 1}
                  className="rounded-xl border border-zinc-200 dark:border-[#1e293b] px-4 py-2 text-xs font-medium transition hover:bg-zinc-100 dark:hover:bg-[#0b1730] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs text-[#667085] dark:text-[#94a3b8]">
                  Page {subTaskData?.page ?? subTaskReqPage} of {subTaskData?.total_pages ?? 1}
                </span>
                <button
                  type="button"
                  onClick={() => setSubTaskReqPage((prev) => Math.min(prev + 1, subTaskData?.total_pages ?? 1))}
                  disabled={subTaskReqPage >= (subTaskData?.total_pages ?? 1)}
                  className="rounded-xl border border-zinc-200 dark:border-[#1e293b] px-4 py-2 text-xs font-medium transition hover:bg-zinc-100 dark:hover:bg-[#0b1730] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TASK CREATION REVIEW MODAL */}
      <TaskReviewModal
        open={isOpen}
        onClose={handleCloseReview}
        task={selectedTask}
      />

      {/* SUBTASK UPDATE REVIEW MODAL */}
      <SubTaskReviewModal
        open={isSubTaskModalOpen}
        onClose={handleCloseSubTaskReview}
        request={selectedSubTaskRequest}
      />
    </div>
  );
}
