import { Link } from "@tanstack/react-router";
import {
  addDays,
  differenceInCalendarDays,
  format,
  endOfDay,
  endOfMonth,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfToday,
} from "date-fns";
import { useGetTimeLine } from "../../app/Queries/admin.query";

const AdminTimeline = () => {
  const { data, isPending, error } = useGetTimeLine();

  const ROW_HEIGHT = 75;
  const COLUMN_WIDTH = 120;

  const timelineStart = startOfMonth(new Date());
  const timelineEnd = endOfMonth(new Date());

  const totalDays = differenceInCalendarDays(timelineEnd, timelineStart) + 1;

  const days = Array.from({ length: totalDays }, (_, i) =>
    addDays(timelineStart, i),
  );

  const getTaskPosition = (task) => {
    const taskStart = task.start_date
      ? startOfDay(parseISO(task.start_date))
      : null;

    const taskEnd = task.end_date ? endOfDay(parseISO(task.end_date)) : null;

    if (!isValid(taskStart) || !isValid(taskEnd)) {
      return null;
    }

    if (taskEnd < timelineStart || taskStart > timelineEnd) {
      return null;
    }

    const visibleStart = taskStart < timelineStart ? timelineStart : taskStart;

    const visibleEnd = taskEnd > timelineEnd ? timelineEnd : taskEnd;

    const offset = differenceInCalendarDays(visibleStart, timelineStart);

    const duration = differenceInCalendarDays(visibleEnd, visibleStart) + 1;

    return {
      left: offset * COLUMN_WIDTH,
      width: duration * COLUMN_WIDTH,
    };
  };

  const today = startOfToday();

  const todayOffset = differenceInCalendarDays(today, timelineStart);

  if (isPending) {
    return (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        Loading timeline...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center rounded-xl border border-red-200 bg-white text-red-500 dark:border-red-800 dark:bg-slate-900">
        Failed to load timeline
      </div>
    );
  }

  const tasks = data?.items ?? [];

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div
        className="relative"
        style={{
          width: totalDays * COLUMN_WIDTH,
          minHeight: Math.max(500, tasks.length * ROW_HEIGHT + 100),
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex border-b border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
          {days.map((day, index) => (
            <div
              key={index}
              className="border-r border-slate-200 py-3 text-center text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300"
              style={{
                width: COLUMN_WIDTH,
              }}
            >
              {format(day, "dd MMM")}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="absolute inset-0 flex pointer-events-none">
          {days.map((_, index) => (
            <div
              key={index}
              className="border-r border-slate-200 dark:border-slate-800"
              style={{
                width: COLUMN_WIDTH,
              }}
            />
          ))}
        </div>

        {/* Task Bars */}
        <div className="relative">
          {tasks.map((task, index) => {
            const position = getTaskPosition(task);

            if (!position) return null;

            const completionPercentage =
              task.sub_task_count > 0
                ? (task.completed_sub_task_count / task.sub_task_count) * 100
                : 0;

            return (
              <Link
                key={task.id}
                to="/admin/tasks/$taskId"
                params={{
                  taskId: String(task.id),
                }}
                state={{
                  task,
                }}
                className="absolute block overflow-hidden rounded-lg shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                style={{
                  top: index * ROW_HEIGHT + 20,
                  left: position.left,
                  width: Math.max(position.width, 250),
                  minHeight: 60,
                  background: `linear-gradient(to right, #16a34a 0%, #16a34a ${completionPercentage}%, #2563eb ${completionPercentage}%, #2563eb 100%)`,
                }}
              >
                <div className="flex flex-col gap-1 p-3">
                  <span className="truncate text-sm font-semibold text-white">
                    {task.title}
                  </span>

                  <span className="truncate text-[11px] text-white opacity-90">
                    👤 {task.assignee?.name} • {task.completed_sub_task_count}/
                    {task.sub_task_count} subtasks •{" "}
                    {format(parseISO(task.start_date), "dd MMM")} -{" "}
                    {format(parseISO(task.end_date), "dd MMM")}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Today Line */}
        {todayOffset >= 0 && todayOffset < totalDays && (
          <div
            className="absolute top-0 bottom-0 z-10 w-0.5 bg-red-500"
            style={{
              left: todayOffset * COLUMN_WIDTH,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminTimeline;
