import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import { useGetAllTasks } from "../../app/Queries/Tasks.query";

const AdminTimeline = () => {
  const [isTasksSidebarOpen, setIsTasksSidebarOpen] = useState(true);

  const {
    data: timelineData,
    isPending: isTimelinePending,
    error: timelineError,
  } = useGetTimeLine();

  const {
    data: allTasksData,
    isPending: isTasksPending,
    error: tasksError,
  } = useGetAllTasks({ pageSize: 100 });

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

  // Map tasks from GET /tasks by ID to enrich timeline data with department and category info
  const tasksMap = useMemo(() => {
    const map = new Map();
    (allTasksData?.items || []).forEach((t) => {
      map.set(String(t.id), t);
    });
    return map;
  }, [allTasksData]);

  const rawTasks = timelineData?.items ?? allTasksData?.items ?? [];

  const tasks = useMemo(() => {
    return rawTasks.map((t) => {
      const extra = tasksMap.get(String(t.id)) || {};
      return {
        ...t,
        ...extra,
        department: extra.department ?? t.department,
        category: extra.category ?? t.category,
      };
    });
  }, [rawTasks, tasksMap]);

  const getDepartmentName = (task) => {
    if (!task) return "N/A";
    if (typeof task.department === "object" && task.department?.name)
      return task.department.name;
    if (typeof task.department === "string" && task.department)
      return task.department;
    if (task.department_name) return task.department_name;
    return "N/A";
  };

  const getCategoryName = (task) => {
    if (!task) return "N/A";
    if (typeof task.category === "object" && task.category?.name)
      return task.category.name;
    if (typeof task.category === "string" && task.category)
      return task.category;
    if (task.category_name) return task.category_name;
    return "N/A";
  };

  const isPending = isTimelinePending || isTasksPending;
  const error = timelineError || tasksError;

  if (isPending) {
    return (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
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

  const contentMinHeight = Math.max(500, tasks.length * ROW_HEIGHT + 60);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="w-full overflow-x-auto relative flex">
        {/* Left Column: Tasks List (Sticky & Collapsible) */}
        <div
          className={`sticky left-0 z-30 shrink-0 border-r border-slate-200 bg-white shadow-[4px_0_12px_-4px_rgba(0,0,0,0.08)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[4px_0_12px_-4px_rgba(0,0,0,0.3)] transition-all duration-300 ${
            isTasksSidebarOpen ? "min-w-[240px] w-64" : "w-12 min-w-[48px]"
          }`}
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex h-[49px] items-center justify-between px-3 border-b border-slate-200 bg-slate-100 font-semibold text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {isTasksSidebarOpen ? (
              <>
                <span>Tasks</span>
                <button
                  type="button"
                  onClick={() => setIsTasksSidebarOpen(false)}
                  title="Close Tasks List"
                  className="p-1 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsTasksSidebarOpen(true)}
                title="Open Tasks List"
                className="w-full flex items-center justify-center p-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Task Items List */}
          <div style={{ minHeight: contentMinHeight }} className="relative">
            {tasks.map((task, index) => {
              const deptName = getDepartmentName(task);
              const catName = getCategoryName(task);

              if (!isTasksSidebarOpen) {
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-center border-b border-slate-100 dark:border-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400"
                    style={{ height: ROW_HEIGHT }}
                    title={task.title}
                  >
                    #{index + 1}
                  </div>
                );
              }

              return (
                <Link
                  key={task.id}
                  to="/admin/tasks/$taskId"
                  params={{ taskId: String(task.id) }}
                  state={{ task }}
                  className="flex flex-col justify-center px-4 border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/50"
                  style={{ height: ROW_HEIGHT }}
                >
                  <span
                    className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100"
                    title={task.title}
                  >
                    {task.title}
                  </span>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[100px] font-medium text-slate-600 dark:text-slate-300">
                      {deptName}
                    </span>
                    <span className="font-bold text-slate-400 dark:text-slate-500 text-[10px]">
                      &gt;
                    </span>
                    <span className="truncate max-w-[100px] font-medium text-slate-600 dark:text-slate-300">
                      {catName}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column: Timeline Grid & Bars */}
        <div
          className="relative shrink-0"
          style={{
            width: totalDays * COLUMN_WIDTH,
            minHeight: contentMinHeight,
          }}
        >
          {/* Date Header */}
          <div className="sticky top-0 z-20 flex border-b border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
            {days.map((day, index) => (
              <div
                key={index}
                className="border-r border-slate-200 py-3 text-center text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300"
                style={{ width: COLUMN_WIDTH }}
              >
                {format(day, "dd MMM")}
              </div>
            ))}
          </div>

          {/* Grid vertical lines */}
          <div className="absolute inset-0 flex pointer-events-none">
            {days.map((_, index) => (
              <div
                key={index}
                className="border-r border-slate-200 dark:border-slate-800"
                style={{ width: COLUMN_WIDTH }}
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
                  params={{ taskId: String(task.id) }}
                  state={{ task }}
                  className="absolute block overflow-hidden rounded-lg shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                  style={{
                    top: index * ROW_HEIGHT + 7.5,
                    left: position.left,
                    width: Math.max(position.width, 250),
                    height: 60,
                    background: `linear-gradient(to right, #16a34a 0%, #16a34a ${completionPercentage}%, #2563eb ${completionPercentage}%, #2563eb 100%)`,
                  }}
                >
                  <div className="flex flex-col gap-1 p-3">
                    <span className="truncate text-sm font-semibold text-white">
                      {task.title}
                    </span>
                    <span className="truncate text-[11px] text-white opacity-90">
                      👤 {task.assignee?.name || "Unassigned"} •{" "}
                      {task.completed_sub_task_count ?? 0}/
                      {task.sub_task_count ?? 0} subtasks •{" "}
                      {task.start_date
                        ? format(parseISO(task.start_date), "dd MMM")
                        : "N/A"}{" "}
                      -{" "}
                      {task.end_date
                        ? format(parseISO(task.end_date), "dd MMM")
                        : "N/A"}
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
              style={{ left: todayOffset * COLUMN_WIDTH }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTimeline;

