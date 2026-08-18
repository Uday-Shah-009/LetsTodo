import { useNavigate } from "@tanstack/react-router";
import { taskDetailsRoute } from "../../app/router/User.router";
import { useUser } from "../../utils/token";
import {
  useGetProgress,
  useGetTaskById,
  useUpdateSubTask,
} from "../../app/Queries/Tasks.query";
import { toast } from "react-toastify";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { getStatusClasses } from "../../utils/statusColors";
import { useState } from "react";
import CreateActivityModal from "../../components/tasks/TaskActivityLogger";
import SubTaskCompletionModal from "../../components/tasks/SubTaskCompletionModal";
import AllActivities from "../../components/tasks/AllActivities";

import { useAuthStore } from "../../store/authStore";

export default function TaskDetails() {
  const { taskId } = taskDetailsRoute.useParams();
  const { data: taskData, isPending: TaskisPending } = useGetTaskById(taskId);
  const { data: progressData } = useGetProgress(taskId);
  const UpdateSubTaskMutate = useUpdateSubTask();
  const isUpdatingSubtask = UpdateSubTaskMutate.isPending;
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState(null);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [subTaskToComplete, setSubTaskToComplete] = useState(null);
  const navigate = useNavigate();
  const user = useUser();
  const authUsername = useAuthStore((s) => s.username);
  const backPath = user?.role === "user" ? "/tasks" : "/admin/tasks";

  const handleTickClick = (subtask) => {
    setSubTaskToComplete(subtask);
    setIsCompletionModalOpen(true);
  };

  const handleConfirmCompletion = () => {
    if (!subTaskToComplete) return;
    UpdateSubTaskMutate.mutate(subTaskToComplete.id, {
      onSuccess: (res) => {
        toast.success(res.message || "Subtask completed successfully");
        setIsCompletionModalOpen(false);
        setSubTaskToComplete(null);
      },
    });
  };

  const handleOpenActivityModal = (subtask) => {
    setSelectedSubTask(subtask);
    setIsActivityModalOpen(true);
  };

  if (TaskisPending) return <LoadingSpinner message="Loading task details..." />;

  const currentUserId =
    user?.id ??
    user?.user_id ??
    (user?.sub && !isNaN(Number(user.sub)) ? Number(user.sub) : null);
  const currentUserName = (
    authUsername ||
    user?.username ||
    user?.name ||
    (typeof user?.sub === "string" ? user.sub : "") ||
    ""
  )
    .toLowerCase()
    .trim();

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate({ to: backPath })}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to Tasks
      </button>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Task {taskId}</h1>

        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {taskData.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <p className="text-xs text-gray-500">Start Date</p>
          <p className="font-medium">
            {new Date(taskData.start_date).toLocaleDateString("en-IN")}
          </p>
        </div>

        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <p className="text-xs text-gray-500">End Date</p>
          <p className="font-medium">
            {new Date(taskData.end_date).toLocaleDateString("en-IN")}
          </p>
        </div>

        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <p className="text-xs text-gray-500">Status</p>
          <span
            className={`px-2 py-1 text-xs rounded-md ${getStatusClasses(taskData.status)}`}
          >
            {taskData.status}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Subtasks</h2>

        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-3">
          {taskData.sub_tasks.map((item) => {
            const isCompleted = item.status === "complete";

            const assignedId =
              item?.assigned_to?.id != null
                ? Number(item.assigned_to.id)
                : null;
            const assignedName = (
              item?.assigned_to?.name ||
              (typeof item?.assigned_to === "string" ? item.assigned_to : "") ||
              ""
            )
              .toLowerCase()
              .trim();

            const isAssignedToCurrentUser = Boolean(
              (assignedId != null &&
                currentUserId != null &&
                assignedId === currentUserId) ||
              (assignedName !== "" &&
                currentUserName !== "" &&
                assignedName === currentUserName),
            );
            const canModify = isAssignedToCurrentUser && !isCompleted;

            return (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className={`w-4 h-4 ${
                        !isAssignedToCurrentUser
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      }`}
                      checked={isCompleted}
                      disabled={
                        !isAssignedToCurrentUser ||
                        isCompleted ||
                        isUpdatingSubtask
                      }
                      onChange={() =>
                        isAssignedToCurrentUser &&
                        !isCompleted &&
                        handleTickClick(item)
                      }
                      title={
                        !isAssignedToCurrentUser
                          ? `Assigned to ${item.assigned_to?.name || "another user"}`
                          : ""
                      }
                    />

                    <div className="flex flex-col">
                      <span
                        className={`${
                          isCompleted
                            ? "line-through text-gray-400"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.assigned_to && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Assigned to:{" "}
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {item.assigned_to.name || item.assigned_to}
                          </span>
                          {!isAssignedToCurrentUser && (
                            <span className="ml-2 text-amber-600 dark:text-amber-400 font-normal">
                              (Not assigned to you)
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </label>

                  <button
                    type="button"
                    disabled={!canModify}
                    onClick={() => canModify && handleOpenActivityModal(item)}
                    className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                      isCompleted
                        ? "bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                        : !isAssignedToCurrentUser
                          ? "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                    title={
                      !isAssignedToCurrentUser
                        ? `Only ${item.assigned_to?.name || "the assigned user"} can log activity`
                        : ""
                    }
                  >
                    {isCompleted ? "Completed" : "+ Add Activity"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Overall Task Progress
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Track your completion progress for this task
          </p>
        </div>
        <div className="w-24 h-24 shrink-0">
          <CircularProgressbar
            value={progressData?.progress_percentage || 0}
            text={`${progressData?.progress_percentage || 0}%`}
            styles={buildStyles({
              pathColor: "#22c55e",
              trailColor: "#e5e7eb",
              textColor: "#22c55e",
              textSize: "24px",
            })}
          />
        </div>
      </div>
      <AllActivities taskId={taskId} />
      <CreateActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => {
          setIsActivityModalOpen(false);
          setSelectedSubTask(null);
        }}
        subTaskId={selectedSubTask?.id}
        subTaskTitle={selectedSubTask?.title}
      />
      <SubTaskCompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => {
          setIsCompletionModalOpen(false);
          setSubTaskToComplete(null);
        }}
        onConfirm={handleConfirmCompletion}
        subTask={subTaskToComplete}
        isLoading={isUpdatingSubtask}
      />
    </div>
  );
}
