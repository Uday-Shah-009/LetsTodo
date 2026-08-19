import { useGetDashboard } from "../../app/Queries/Dashboard.query";
import StatCard from "../../components/StatCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Clock } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isPending, error, refetch } = useGetDashboard();
  const tasks = data?.recent_tasks ?? [];

  if (isPending) return <LoadingSpinner message="Loading dashboard..." fullPage />;
  if (error) return <ErrorState title="Failed to load dashboard" message="Could not retrieve your dashboard summary." onRetry={refetch} />;

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of your tasks and activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={data?.total_tasks ?? 0}
          color="text-blue-500"
        />

        <StatCard
          title="Completed"
          value={data?.completed_tasks ?? 0}
          color="text-green-500"
        />

        <StatCard
          title="In Progress"
          value={data?.in_progress_tasks ?? 0}
          color="text-yellow-500"
        />

        <StatCard
          title="Overdue"
          value={data?.overdue ?? 0}
          color="text-red-500"
        />
      </div>

      {/* Recent Tasks */}
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Tasks</h2>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <EmptyState title="No recent tasks" description="Your recently assigned tasks will show up here." />
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => navigate({ to: `/tasks/${task.id}` })}
                className="flex justify-between items-center p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{task.title}</span>
                <span className="text-xs text-blue-500 font-medium">View →</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => {
              navigate({ to: "/add-task" });
            }}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            + Add Task
          </button>

          <button
            onClick={() => {
              navigate({ to: "/timeline" });
            }}
            className="hidden md:inline-flex px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium"
          >
            View Timeline
          </button>
        </div>
      </div>
    </div>
  );
}
