import {
  addDays,
  differenceInCalendarDays,
  format,
  startOfDay,
} from "date-fns";
import { useGetMyTasks } from "../../app/Queries/Tasks.query";

export default function WeeklyTaskTimeline() {
  const { data, isPending } = useGetMyTasks();

  const tasks = data?.items || [];
  const today = startOfDay(new Date());

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "complete":
        return "bg-green-500";
      case "in progress":
        return "bg-yellow-500";
      case "not complete":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isPending) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        Loading timeline...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <h2 className="text-xl font-semibold mb-6">Weekly Task Timeline</h2>

      <div className="space-y-4">
        {/* Header */}
        <div className="grid grid-cols-[220px_repeat(7,1fr)] gap-2">
          <div />

          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className="text-center text-xs font-medium text-gray-500"
            >
              <div>{format(day, "EEE")}</div>
              <div>{format(day, "dd")}</div>
            </div>
          ))}
        </div>

        {/* Tasks */}
        {tasks.map((task) => {
          const taskStart = startOfDay(new Date(task.start_date));

          const taskEnd = startOfDay(new Date(task.end_date));

          const leftOffset = differenceInCalendarDays(taskStart, today);

          const duration = differenceInCalendarDays(taskEnd, taskStart) + 1;

          const visibleStart = Math.max(leftOffset, 0);

          const visibleEnd = Math.min(leftOffset + duration, 7);

          const visibleDuration = visibleEnd - visibleStart;

          if (visibleDuration <= 0) return null;

          return (
            <div
              key={task.id}
              className="grid grid-cols-[220px_repeat(7,1fr)] gap-2 items-center"
            >
              <div className="pr-2">
                <p className="font-medium truncate">{task.title}</p>

                <p className="text-xs text-gray-500">{task.status}</p>
              </div>

              <div className="col-span-7 relative h-12 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div
                  className={`absolute top-1 bottom-1 rounded-lg flex items-center px-3 text-white text-sm font-medium ${getStatusColor(
                    task.status,
                  )}`}
                  style={{
                    left: `${(visibleStart / 7) * 100}%`,
                    width: `${(visibleDuration / 7) * 100}%`,
                  }}
                >
                  {task.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No tasks available
        </div>
      )}
    </div>
  );
}
