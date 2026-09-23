import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useUser } from "../../utils/token";
import { adminTaskDetailsRoute } from "../../app/router/Admin.router";
import {
  useDeleteTask,
  useGetProgress,
  useGetTaskById,
} from "../../app/Queries/Tasks.query";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import SubTaskTimeline from "../../components/tasks/SubTaskTimeline";
import { getStatusClasses } from "../../utils/statusColors";
import AllActivities from "../../components/tasks/AllActivities";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import DeleteTaskConfirmationModal from "../../components/tasks/DeleteTaskConfirmationModal";

export default function TaskDetails() {
  const { taskId } = adminTaskDetailsRoute.useParams();
  const navigate = useNavigate();
  const user = useUser();
  const backPath = user?.role === "user" ? "/tasks" : "/admin/tasks";
  const { data: taskData, isPending: TaskisPending } = useGetTaskById(taskId);
  const { data: progressData } = useGetProgress(taskId);
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteConfirm = () => {
    deleteTask(taskId, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        navigate({ to: backPath });
      },
    });
  };

  if (TaskisPending)
    return <LoadingSpinner message="Loading task details..." />;
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

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Task Actions
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Revise is available for completed tasks. Admins can also delete
              this task permanently.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 cursor-pointer flex items-center gap-1.5 shadow-sm shadow-red-500/20"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              Delete Task
            </button>

            <button
              type="button"
              onClick={() => navigate({ to: `/admin/tasks/${taskId}/revise` })}
              disabled={taskData.status !== "complete"}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer"
            >
              Revise Task
            </button>
          </div>
        </div>

        {taskData.status !== "complete" && (
          <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
            Complete the task before creating a new version.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Subtasks</h2>

        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-3">
          {taskData?.sub_tasks.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 border-b last:border-0 pb-3 last:pb-0 border-gray-100 dark:border-gray-800/60"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {item.title}
                </span>
                {item.assigned_to && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Assigned to:{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {item.assigned_to.name || item.assigned_to}
                    </span>
                  </span>
                )}
              </div>

              <div className="text-right text-xs text-gray-500 dark:text-gray-400 shrink-0">
                <div>
                  Start:{" "}
                  {item.start_date
                    ? new Date(item.start_date).toLocaleDateString("en-IN")
                    : "None"}
                </div>
                <div>
                  End:{" "}
                  {item.end_date
                    ? new Date(item.end_date).toLocaleDateString("en-IN")
                    : "None"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Overall Task Progress
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Calculated automatically based on subtask completion statuses
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
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Subtask Performance Timeline
        </h2>
        <SubTaskTimeline taskId={taskId} taskData={taskData} />
      </div>
      <AllActivities taskId={taskId} />

      <DeleteTaskConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        taskId={taskId}
        taskDescription={taskData?.description}
        isPending={isDeleting}
      />
    </div>
  );
}
