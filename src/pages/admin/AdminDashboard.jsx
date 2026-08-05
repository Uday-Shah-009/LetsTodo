import { useNavigate } from "@tanstack/react-router"
import { useGetDashboard } from "../../app/Queries/Dashboard.query"

export default function AdminDashboard() {
  const { data, isPending, error } = useGetDashboard()
  const navigate = useNavigate()

  if (isPending) return <div>Loading dashboard...</div>
  if (error) return <div>Something went wrong</div>

  const stats = [
    { title: "Total Tasks", value: data?.total_tasks ?? 0 , color: "blue" },
    { title: "Completed", value: data?.completed_tasks ?? 0 , color: "green"},
    { title: "In Progress", value: data?.in_progress_tasks ?? 0 , color: "yellow"},
    { title: "Overdue", value: data?.overdue ?? 0 , color:"red"},
  ]

  const recentTasks = data?.recent_tasks ?? []

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of system activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800  rounded-xl p-5"
          >
            <p className={`text-sm text-${stat.color}-500 dark:text-${stat.color}-400`}>
              {stat.title}
            </p>

            <p className="text-2xl font-semibold mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Tasks */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">

          <h2 className="font-semibold mb-4">
            Recent Tasks
          </h2>

          <div className="space-y-3">

            {recentTasks.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No recent tasks
              </p>
            ) : (
              recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span>{task.title}</span>
                </div>
              ))
            )}

          </div>

        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">

          <h2 className="font-semibold mb-4">
            Quick Actions
          </h2>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() => navigate({ to: "/admin/add-task" })}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Task
            </button>

            <button
              onClick={() => navigate({ to: "/admin/users" })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg"
            >
              Manage Users
            </button>

            <button
              onClick={() => navigate({ to: "/admin/timeline" })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg"
            >
              View Timeline
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}