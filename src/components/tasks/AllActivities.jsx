import { useState } from "react";
import { useGetTaskActivities } from "../../app/Queries/Tasks.query";

export default function AllActivities({ taskId }) {
  const [page, setPage] = useState(1);

  const { data, isPending } = useGetTaskActivities(taskId, page);

  const activities = data?.items || [];
  if (isPending)
    return (
      <div className="flex items-center justify-center text-stone-700">
        Loading Activities...
      </div>
    );
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Activity Timeline</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Daily work logs recorded against subtasks.
        </p>
      </div>

      {/* Activities */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <div className="space-y-2">
          {activities.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No activities found.
              </p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between gap-4 py-2 border-b border-gray-200 dark:border-gray-800 last:border-b-0"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {activity.note}
                </p>

                <span className="shrink-0 text-xs text-gray-500">
                  {new Date(activity.date).toLocaleDateString("en-IN")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {data.total_pages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Page {page} of {data.total_pages}
          </span>

          <button
            type="button"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= data.total_pages}
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
