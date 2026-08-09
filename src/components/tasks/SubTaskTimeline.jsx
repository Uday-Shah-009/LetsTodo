import {
  addDays,
  differenceInCalendarDays,
  format,
  parseISO,
  startOfDay,
  endOfDay,
} from "date-fns";
import { useGetTaskTimeLine } from "../../app/Queries/Tasks.query";

const SubTaskTimeline = ({ taskId }) => {
  const { data, isPending, error } = useGetTaskTimeLine(taskId);

  const COLUMN_WIDTH = 140;
  const ROW_HEIGHT = 130;

  const timelineStart = data
    ? startOfDay(parseISO(data.start_date))
    : new Date();

  const timelineEnd = data
    ? endOfDay(parseISO(data.end_date))
    : new Date();

  const totalDays =
    differenceInCalendarDays(
      timelineEnd,
      timelineStart,
    ) + 1;

  const days = data
    ? Array.from(
        { length: totalDays },
        (_, index) =>
          addDays(timelineStart, index),
      )
    : [];

  const getPosition = (startDate, endDate) => {
    const start = startOfDay(parseISO(startDate));
    const end = endOfDay(parseISO(endDate));
    const offset =
      differenceInCalendarDays(
        start,
        timelineStart,
      );

    const duration =
      differenceInCalendarDays(end, start) + 1;

    return {
      left: offset * COLUMN_WIDTH,
      width: duration * COLUMN_WIDTH,
    };
  };

  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case "complete":
        return "text-green-400";

      case "in progress":
        return "text-yellow-400";

      case "pending":
        return "text-slate-300";

      default:
        return "text-slate-300";
    }
  };

  const getPriorityColor = (priority) => {
    switch (String(priority).toLowerCase()) {
      case "critical":
        return "border-l-4 border-red-500";

      case "high":
        return "border-l-4 border-blue-500";

      case "medium":
        return "border-l-4 border-yellow-500";

      case "low":
        return "border-l-4 border-green-500";

      default:
        return "";
    }
  };

  if (isPending) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        Loading timeline...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-6 text-red-500 dark:border-red-800 dark:bg-slate-900">
        Something went wrong
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        No timeline data found
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 p-5 dark:border-slate-700">
        <h2 className="text-xl font-semibold">
          Subtask Performance Timeline
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {data.task_title}
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 border-b border-slate-200 p-5 md:grid-cols-3 dark:border-slate-700">
        <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <p className="text-xs text-slate-500">
            Estimated Hours
          </p>

          <p className="text-xl font-semibold text-blue-600">
            {data.total_estimated_hours}h
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <p className="text-xs text-slate-500">
            Actual Hours
          </p>

          <p className="text-xl font-semibold text-green-500">
            {data.total_actual_hours}h
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <p className="text-xs text-slate-500">
            Expected Hours
          </p>

          <p className="text-xl font-semibold text-orange-500">
            {data.total_expected_hours}h
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div
          className="relative"
          style={{
            width: totalDays * COLUMN_WIDTH,
            minHeight:
              data.sub_tasks.length *
                ROW_HEIGHT +
              150,
          }}
        >
          {/* Dates Header */}
          <div className="sticky top-0 z-20 flex border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className="border-r border-slate-200 py-3 text-center text-sm font-medium dark:border-slate-700"
                style={{
                  width: COLUMN_WIDTH,
                }}
              >
                {format(day, "dd MMM")}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="pointer-events-none absolute inset-0 flex">
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

          {/* Rows */}
          <div className="relative">
            {data.sub_tasks.map(
              (subtask, index) => {
                const position =
                  getPosition(
                    subtask.start_date,
                    subtask.end_date,
                  );

                const estimated =
                  Number(
                    subtask.estimated_hours ||
                      0,
                  );

                const actual =
                  Number(
                    subtask.actual_hours || 0,
                  );

                const expected =
                  Number(
                    subtask.expected_hours ||
                      0,
                  );

                const actualPercent =
                  estimated > 0
                    ? Math.min(
                        (actual /
                          estimated) *
                          100,
                        100,
                      )
                    : 0;

                const expectedPercent =
                  estimated > 0
                    ? Math.min(
                        (expected /
                          estimated) *
                          100,
                        100,
                      )
                    : 0;

                let performanceStatus =
                  "On Track";

                if (actual > expected) {
                  performanceStatus =
                    "Ahead";
                }

                if (actual < expected) {
                  performanceStatus =
                    "Behind";
                }

                return (
                  <div
                    key={
                      subtask.sub_task_id
                    }
                    className="absolute"
                    style={{
                      top:
                        index *
                          ROW_HEIGHT +
                        30,
                      left:
                        position.left,
                      width:
                        position.width,
                    }}
                  >
                    <div className="overflow-hidden rounded-xl border border-slate-300 shadow-sm dark:border-slate-700">
                      {/* Title */}
                      <div
                        className={`flex items-center justify-between bg-slate-800 px-3 py-2 text-white ${getPriorityColor(
                          subtask.priority,
                        )}`}
                      >
                        <span className="truncate text-sm font-semibold">
                          {subtask.title}
                        </span>

                        <span
                          className={`text-xs font-medium ${getStatusColor(
                            subtask.status,
                          )}`}
                        >
                          {subtask.status}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-8 bg-blue-100 dark:bg-slate-700">
                        {/* Actual */}
                        <div
                          className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-300"
                          style={{
                            width: `${actualPercent}%`,
                          }}
                        />

                        {/* Expected Marker */}
                        <div
                          className="absolute top-0 h-full w-1 bg-orange-500"
                          style={{
                            left: `${expectedPercent}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex flex-wrap items-center gap-3 text-slate-500">
                        <span>
                          Expected:
                          <span className="ml-1 font-medium text-orange-500">
                            {expected}h
                          </span>
                        </span>

                        <span>
                          Actual:
                          <span className="ml-1 font-medium text-green-500">
                            {actual}h
                          </span>
                        </span>

                        <span>
                          Estimated:
                          <span className="ml-1 font-medium text-blue-500">
                            {estimated}h
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">
                          Priority:
                          <span className="ml-1 font-medium">
                            {subtask.priority}
                          </span>
                        </span>

                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                            performanceStatus ===
                            "Ahead"
                              ? "bg-green-100 text-green-700"
                              : performanceStatus ===
                                  "Behind"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {
                            performanceStatus
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 border-t border-slate-200 p-4 text-sm dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border border-blue-500 bg-blue-100" />
          Estimated Work
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-green-500" />
          Actual Progress
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-1 bg-orange-500" />
          Expected Progress
        </div>
      </div>
    </div>
  );
};

export default SubTaskTimeline;