import { useNavigate } from "@tanstack/react-router";
import { useUser } from "../../utils/token";
import { adminTaskDetailsRoute } from "../../app/router/Admin.router";
import { useGetProgress, useGetTaskById } from "../../app/Queries/Tasks.query";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import SubTaskTimeline from "../../components/tasks/SubTaskTimeline";
import { getStatusClasses } from "../../utils/statusColors";
import AllActivities from "../../components/tasks/AllActivities";
import { useState } from "react";
import ReviseTaskModal from "../../components/tasks/ReviseTaskModal";

export default function TaskDetails() {
  const { taskId } = adminTaskDetailsRoute.useParams();
  const navigate = useNavigate();
  const user = useUser();
  const [isReviseModalOpen, setIsReviseModalOpen] = useState(false);
  const backPath = user?.role === "user" ? "/tasks" : "/admin/tasks";
  const { data: taskData, isPending: TaskisPending } = useGetTaskById(taskId);
  const { data: progressData } = useGetProgress(taskId);

  const handleRevised = (createdTask) => {
    if (createdTask?.id) {
      navigate({ to: `/admin/tasks/${createdTask.id}` });
    }
  };

  if (TaskisPending)
    return <div className="text-[18px]">Loading Task {taskId}</div>;
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Task Actions</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Revise is available for completed tasks and creates a new version.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsReviseModalOpen(true)}
            disabled={taskData.status !== "complete"}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Revise Task
          </button>
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
            <label
              key={item.id}
              className="flex items-center justify-between gap-3"
            >
              <span>{item.title}</span>

              <div className="text-right text-xs text-gray-500 dark:text-gray-400">
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
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Task Progress</h2>
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Subtask Performance Timeline</h2>
        <SubTaskTimeline taskId={taskId} />
      </div>
      <AllActivities taskId={taskId} />
      <ReviseTaskModal
        open={isReviseModalOpen}
        onClose={() => setIsReviseModalOpen(false)}
        task={taskData}
        onRevised={handleRevised}
      />
    </div>
  );
}
