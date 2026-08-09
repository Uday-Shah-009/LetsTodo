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
import { getStatusClasses } from "../../utils/statusColors";
import { useState } from "react";
import CreateActivityModal from "../../components/tasks/TaskActivityLogger";
import AllActivities from "../../components/tasks/AllActivities";

export default function TaskDetails() {
  const { taskId } = taskDetailsRoute.useParams();
  const { data: taskData, isPending: TaskisPending } = useGetTaskById(taskId);
  const { data: progressData } = useGetProgress(taskId);
  const UpdateSubTaskMutate = useUpdateSubTask();
  const isUpdatingSubtask = UpdateSubTaskMutate.isPending;
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState(null);
  const navigate = useNavigate();
  const user = useUser();
  const backPath = user?.role === "user" ? "/tasks" : "/admin/tasks";
  const handleCheckboxChange = (id) => {
    UpdateSubTaskMutate.mutate(id, {
      onSuccess: (res) => {
        toast.success(res.message || "Task updated");
      },
    });
  };

  const handleOpenActivityModal = (subtask) => {
    setSelectedSubTask(subtask);
    setIsActivityModalOpen(true);
  };

  if (TaskisPending) return <div>Loading Task {taskId}</div>;
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
            return (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer"
                      checked={isCompleted}
                      disabled={isCompleted || isUpdatingSubtask}
                      onChange={() => handleCheckboxChange(item.id)}
                    />

                    <span
                      className={`${
                        isCompleted
                          ? "line-through text-gray-400"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {item.title}
                    </span>
                  </label>

                  <button
                    type="button"
                    disabled={isCompleted}
                    onClick={() => handleOpenActivityModal(item)}
                    className={`px-3 py-1.5 text-sm rounded-lg text-white ${
                      isCompleted
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Task Progress</h2>
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
    </div>
  );
}
