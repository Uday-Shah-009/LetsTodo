import React, { useState } from "react";
import { Eye } from "lucide-react";
import TaskReviewModal from "../../components/tasks/TaskReviewModal";
import { useGetTaskRequests } from "../../app/Queries/Tasks.query";

export default function TaskRequestsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { data, isPending } = useGetTaskRequests();

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

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] dark:bg-[#020817] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-zinc-300 dark:border-[#1e293b] border-t-blue-500 rounded-full animate-spin" />

          <p className="text-[#667085] dark:text-[#94a3b8] text-sm">
            Loading task requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] dark:bg-[#020817] text-[#101828] dark:text-white p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Task Requests
          </h1>

          <p className="text-[#667085] dark:text-[#94a3b8] mt-2">
            Review all task creation requests.
          </p>
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
                        disabled={status?.toLowerCase() === "approved"}
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
                              : "bg-blue-500 hover:bg-blue-600"
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
        </div>
      </div>

      {/* REVIEW MODAL */}
      <TaskReviewModal
        open={isOpen}
        onClose={handleCloseReview}
        task={selectedTask}
      />
    </div>
  );
}
