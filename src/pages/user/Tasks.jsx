import {
  useGetMyTasks,
  useTaskRequestByuser,
} from "../../app/Queries/Tasks.query";
import TaskCard from "../../components/tasks/TaskCard";
import { Outlet } from "@tanstack/react-router";
import { getRequestStatusClasses } from "../../utils/statusColors";

export default function Tasks() {
  const {
    data: Tasks,
    isPending: getTaskPending,
    error: Taskerror,
  } = useGetMyTasks();
  const {
    data: TaskRequests,
    isPending: TaskRequestPending,
    error: TaskRequesterror,
  } = useTaskRequestByuser();

  if (getTaskPending) return <div>Loading Tasks...</div>;
  if (Taskerror) return <div>Something went wrong</div>;
  if(TaskRequestPending) return <div>Loading Tasks Requests...</div>
  if(TaskRequesterror) return <div>Something went wrong</div>
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Tasks</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Tasks.items.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
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
                  {task.requested_payload.payload.title}
                </td>

                <td className="px-4 py-3">{task.requested_by.name}</td>

                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getRequestStatusClasses(task.status)}`}>
                    {task.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {task.requested_payload.payload.sub_tasks.length}
                </td>

                <td className="px-4 py-3">
                  {new Date(task.created_at).toLocaleDateString()}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
