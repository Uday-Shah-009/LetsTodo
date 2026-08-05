import { Link } from "@tanstack/react-router"
import { getStatusClasses } from "../../utils/statusColors"

const statusOptions = [
  { label: "All", value: "" },
  { label: "In Progress", value: "in progress" },
  { label: "Completed", value: "complete" },
  { label: "Not Completed", value: "not complete" },
]

export default function TaskTable({
  tasks,
  basePath = "/tasks",
  selectedStatus = "",
  onStatusChange,
  page = 1,
  totalPages = 1,
  onPageChange,
  pageSize,
  onPageSizeChange,
}) {

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {statusOptions.map((option) => {
            const isActive = selectedStatus === option.value

            return (
              <button
                key={option.value || "all"}
                type="button"
                onClick={() => onStatusChange?.(option.value)}
                className={`rounded-full px-4 py-2 text-sm border transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="pageSizeSelect" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show
            </label>
            <select
              id="pageSizeSelect"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-500 dark:text-gray-400">entries</span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="border-b border-gray-200 dark:border-gray-800">
            <tr className="text-left">
              <th className="p-4">Task</th>
              <th className="p-4">Assigned</th>
              <th className="p-4">Status</th>
              <th className="p-4">Description</th>
              <th className="p-4">Deadline</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td className="p-6 text-center text-gray-500 dark:text-gray-400" colSpan={5}>
                  No tasks found for this status.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <td className="p-4">
                    <Link
                      to={`${basePath}/$taskId`}
                      params={{ taskId: task.id }}
                      className="block w-full h-full"
                    >
                      {task.title}
                    </Link>
                  </td>

                  <td className="p-4">{task.created_by.name}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-md ${getStatusClasses(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-1 text-xs rounded-md">
                      {task.description || "None"}
                    </span>
                  </td>

                  <td className="p-4">
                    {task.end_date
                      ? new Date(task.end_date).toLocaleDateString("en-IN")
                      : "None"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onPageChange?.(page - 1)}
            disabled={page <= 1}
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}