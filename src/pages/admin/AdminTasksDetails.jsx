import { useNavigate } from "@tanstack/react-router";
import { useUser } from "../../utils/token";
import { adminTaskDetailsRoute } from "../../app/router/Admin.router";
import { useGetProgress, useGetTaskById } from "../../app/Queries/Tasks.query";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import SubTaskTimeline from "../../components/tasks/SubTaskTimeline";
import { getStatusClasses } from "../../utils/statusColors";
import AllActivities from "../../components/tasks/AllActivities";

export default function TaskDetails() {
  const { taskId } = adminTaskDetailsRoute.useParams();
  const navigate = useNavigate();
  const user = useUser();
  const backPath = user?.role === "user" ? "/tasks" : "/admin/tasks";
  const { data: taskData, isPending: TaskisPending } = useGetTaskById(taskId);
  const { data: progressData } = useGetProgress(taskId);
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

      <div className="w-24 h-24">
        <CircularProgressbar
          value={progressData?.progress_percentage || 0}
          text={`${progressData?.progress_percentage || 0}%`}
          styles={buildStyles({
            pathColor: "#22c55e",
            trailColor: "#e5e7eb",
          })}
        />
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Subtask Performance Timeline</h2>
        <SubTaskTimeline taskId={taskId} />
      </div>
      <AllActivities taskId={taskId} />
    </div>
  );
}
