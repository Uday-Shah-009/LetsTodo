import { useNavigate } from "@tanstack/react-router";
import { useGetDashboard } from "../../app/Queries/Dashboard.query";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import { CheckCircle2, Clock, AlertCircle, ListTodo } from "lucide-react";

const statColorMap = {
  blue: {
    text: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    icon: ListTodo,
  },
  green: {
    text: "text-green-500 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
    icon: CheckCircle2,
  },
  yellow: {
    text: "text-yellow-500 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    icon: Clock,
  },
  red: {
    text: "text-red-500 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
    icon: AlertCircle,
  },
};

export default function AdminDashboard() {
  const { data, isPending, error, refetch } = useGetDashboard();
  const navigate = useNavigate();

  if (isPending) return <LoadingSpinner message="Loading dashboard data..." fullPage />;
  if (error) return <ErrorState title="Failed to load dashboard" message="Could not retrieve dashboard statistics." onRetry={refetch} />;

  const stats = [
    { title: "Total Tasks", value: data?.total_tasks ?? 0, color: "blue" },
    { title: "Completed", value: data?.completed_tasks ?? 0, color: "green" },
    { title: "In Progress", value: data?.in_progress_tasks ?? 0, color: "yellow" },
    { title: "Overdue", value: data?.overdue ?? 0, color: "red" },
  ];

  const recentTasks = data?.recent_tasks ?? [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of system activity and task performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const config = statColorMap[stat.color] || statColorMap.blue;
          const Icon = config.icon;
          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm transition-all hover:border-gray-300 dark:hover:border-gray-700 flex items-center justify-between"
            >
              <div>
                <p className={`text-sm font-medium ${config.text}`}>
                  {stat.title}
                </p>
                <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${config.bg} ${config.text}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
            Recent Tasks
          </h2>

          <div className="space-y-3">
            {recentTasks.length === 0 ? (
              <EmptyState title="No recent tasks" description="Tasks created recently will appear here." />
            ) : (
              recentTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate({ to: `/admin/tasks/${task.id}` })}
                  className="flex justify-between items-center p-3 rounded-lg border border-gray-100 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition cursor-pointer"
                >
                  <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{task.title}</span>
                  <span className="text-xs text-blue-500 font-medium">View details →</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/admin/add-task" })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition cursor-pointer shadow-xs"
            >
              + Create Task
            </button>

            <button
              type="button"
              onClick={() => navigate({ to: "/admin/users" })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm rounded-lg transition cursor-pointer"
            >
              Manage Users
            </button>

            <button
              type="button"
              onClick={() => navigate({ to: "/admin/timeline" })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm rounded-lg transition cursor-pointer"
            >
              View Timeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}