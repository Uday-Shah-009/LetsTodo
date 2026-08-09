import { useState } from "react";
import {
  useGetMyTasks,
  useSubTaskRequestByuser,
  useTaskRequestByuser,
} from "../../app/Queries/Tasks.query";
import TaskCard from "../../components/tasks/TaskCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import { getRequestStatusClasses } from "../../utils/statusColors";

export default function Tasks() {
  const [taskReqPage, setTaskReqPage] = useState(1);
  const [taskReqPageSize, setTaskReqPageSize] = useState(10);
  const [subTaskReqPage, setSubTaskReqPage] = useState(1);
  const [subTaskReqPageSize, setSubTaskReqPageSize] = useState(10);

  const {
    data: Tasks,
    isPending: getTaskPending,
    error: Taskerror,
    refetch: refetchTasks,
  } = useGetMyTasks();
  const {
    data: TaskRequests,
    isPending: TaskRequestPending,
    error: TaskRequesterror,
    refetch: refetchRequests,
  } = useTaskRequestByuser(taskReqPage, taskReqPageSize);
  const {
    data: SubTaskRequests,
    isPending: SubTaskRequestPending,
    error: SubTaskRequesterror,
    refetch: refetchSubTaskRequests,
  } = useSubTaskRequestByuser(subTaskReqPage, subTaskReqPageSize);

  if (getTaskPending || TaskRequestPending || SubTaskRequestPending)
    return <LoadingSpinner message="Loading your tasks & requests..." fullPage />;
  if (Taskerror || TaskRequesterror || SubTaskRequesterror)
    return (
      <ErrorState
        title="Failed to load tasks"
        message="Unable to fetch tasks or task requests."
        onRetry={() => {
          refetchTasks();
          refetchRequests();
          refetchSubTaskRequests();
        }}
      />
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-4">My Tasks</h1>
        {Tasks?.items && Tasks.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Tasks.items.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={null}
            title="No tasks found"
            description="You currently have no tasks assigned."
          />
        )}
      </div>

      {/* Task Requests */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Task Requests</h2>
          {TaskRequests?.items && TaskRequests.items.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <label htmlFor="taskReqPageSize" className="text-xs font-medium">Show</label>
              <select
                id="taskReqPageSize"
                value={taskReqPageSize}
                onChange={(e) => {
                  setTaskReqPageSize(Number(e.target.value));
                  setTaskReqPage(1);
                }}
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          )}
        </div>

        {TaskRequests?.items && TaskRequests.items.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Requested By</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Subtasks</th>
                    <th className="px-4 py-3 text-left">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {TaskRequests.items.map((task) => (
                    <tr
                      key={task.id}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <td className="px-4 py-3">{task.id}</td>

                      <td className="px-4 py-3 font-medium">
                        {task.requested_payload?.payload?.title || "-"}
                      </td>

                      <td className="px-4 py-3">{task.requested_by?.name || "-"}</td>

                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getRequestStatusClasses(task.status)}`}>
                          {task.status}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {task.requested_payload?.payload?.sub_tasks?.length ?? 0}
                      </td>

                      <td className="px-4 py-3">
                        {new Date(task.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {TaskRequests?.total_pages > 1 && (
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTaskReqPage((prev) => Math.max(prev - 1, 1))}
                  disabled={taskReqPage <= 1}
                  className="rounded-lg border border-gray-300 dark:border-gray-700 px-3.5 py-1.5 text-xs font-medium transition hover:bg-gray-50 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Page {TaskRequests?.page ?? taskReqPage} of {TaskRequests?.total_pages ?? 1}
                </span>
                <button
                  type="button"
                  onClick={() => setTaskReqPage((prev) => Math.min(prev + 1, TaskRequests?.total_pages ?? 1))}
                  disabled={taskReqPage >= (TaskRequests?.total_pages ?? 1)}
                  className="rounded-lg border border-gray-300 dark:border-gray-700 px-3.5 py-1.5 text-xs font-medium transition hover:bg-gray-50 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={null}
            title="No task requests"
            description="You have no task creation requests submitted."
          />
        )}
      </div>

      {/* Subtask Requests */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Subtask Requests</h2>
          {SubTaskRequests?.items && SubTaskRequests.items.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <label htmlFor="subTaskReqPageSize" className="text-xs font-medium">Show</label>
              <select
                id="subTaskReqPageSize"
                value={subTaskReqPageSize}
                onChange={(e) => {
                  setSubTaskReqPageSize(Number(e.target.value));
                  setSubTaskReqPage(1);
                }}
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          )}
        </div>

        {SubTaskRequests?.items && SubTaskRequests.items.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Subtask ID</th>
                    <th className="px-4 py-3 text-left">Requested By</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Note</th>
                    <th className="px-4 py-3 text-left">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {SubTaskRequests.items.map((subTask) => (
                    <tr
                      key={subTask.id}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <td className="px-4 py-3">{subTask.id}</td>

                      <td className="px-4 py-3 font-medium">
                        {subTask.sub_task_id}
                      </td>

                      <td className="px-4 py-3">{subTask.requested_by?.name || "-"}</td>

                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getRequestStatusClasses(subTask.status)}`}>
                          {subTask.status}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {subTask.requested_changes?.note || "-"}
                      </td>

                      <td className="px-4 py-3">
                        {new Date(subTask.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {SubTaskRequests?.total_pages > 1 && (
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubTaskReqPage((prev) => Math.max(prev - 1, 1))}
                  disabled={subTaskReqPage <= 1}
                  className="rounded-lg border border-gray-300 dark:border-gray-700 px-3.5 py-1.5 text-xs font-medium transition hover:bg-gray-50 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Page {SubTaskRequests?.page ?? subTaskReqPage} of {SubTaskRequests?.total_pages ?? 1}
                </span>
                <button
                  type="button"
                  onClick={() => setSubTaskReqPage((prev) => Math.min(prev + 1, SubTaskRequests?.total_pages ?? 1))}
                  disabled={subTaskReqPage >= (SubTaskRequests?.total_pages ?? 1)}
                  className="rounded-lg border border-gray-300 dark:border-gray-700 px-3.5 py-1.5 text-xs font-medium transition hover:bg-gray-50 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={null}
            title="No subtask requests"
            description="You have no subtask update requests submitted."
          />
        )}
      </div>
    </div>
  );
}
