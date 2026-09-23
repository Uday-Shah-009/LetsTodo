import { Link } from "@tanstack/react-router";
import { getStatusClasses } from "../../utils/statusColors";

export default function TaskCard({ task }) {

  return (
    <Link
      to="/tasks/$taskId"
      params={{ taskId: task.id }}
      className="block"
    >
      <div className="cursor-pointer p-5 rounded-xl border border-gray-200 dark:border-[#1e293b] bg-white dark:bg-[#0b1329] hover:bg-gray-50 dark:hover:bg-[#162342] transition h-36 flex flex-col justify-between overflow-hidden shadow-sm">
        
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-gray-900 dark:text-slate-100">{task.title}</h3>

          <span className={`text-xs px-2.5 py-1 rounded-md shrink-0 ${getStatusClasses(task.status)}`}>
            {task.status}
          </span>
        </div>

        <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 mt-2">
          {task.description}
        </p>

      </div>
    </Link>
  );
}