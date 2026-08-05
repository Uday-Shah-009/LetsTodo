import { Link } from "@tanstack/react-router";
import { getStatusClasses } from "../../utils/statusColors";

export default function TaskCard({ task }) {

  return (
    <Link
      to="/tasks/$taskId"
      params={{ taskId: task.id }}
      className="block"
    >
      <div className="cursor-pointer p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
        
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{task.title}</h3>

          <span className={`text-xs px-2 py-1 rounded ${getStatusClasses(task.status)}`}>
            {task.status}
          </span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {task.description}
        </p>

      </div>
    </Link>
  );
}