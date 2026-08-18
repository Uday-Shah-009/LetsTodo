import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  format,
  parseISO,
  startOfDay,
} from "date-fns";
import { useGetTaskById, useGetTaskTimeLine } from "../../app/Queries/Tasks.query";

const SubTaskTimeline = ({ taskId, taskData: propTaskData }) => {
  const {
    data: timelineData,
    isPending: isTimelinePending,
    error: timelineError,
  } = useGetTaskTimeLine(taskId);

  const {
    data: fetchedTaskData,
    isPending: isTaskPending,
  } = useGetTaskById(taskId);

  const taskData = propTaskData || fetchedTaskData;

  const isPending = isTimelinePending || (!propTaskData && isTaskPending);

  if (isPending) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
        Loading timeline data...
      </div>
    );
  }

  if (timelineError || !timelineData) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-6 text-red-500 dark:border-red-900/50 dark:bg-slate-900">
        Unable to load task timeline data.
      </div>
    );
  }

  // Calculate expected days
  const expectedHours =
    timelineData.bars?.find((b) => b.key === "expected")?.hours ??
    timelineData.total_expected_hours ??
    0;

  const expectedDays =
    timelineData.expected_days !== undefined
      ? Number(timelineData.expected_days)
      : Math.floor(expectedHours / 24);

  // Parse overall timeline dates and extend end date by expected_days if expected_days > 0
  const timelineStart = timelineData.start_date
    ? startOfDay(parseISO(timelineData.start_date))
    : taskData?.start_date
      ? startOfDay(parseISO(taskData.start_date))
      : startOfDay(new Date());

  const baseEndDate = timelineData.end_date
    ? endOfDay(parseISO(timelineData.end_date))
    : taskData?.end_date
      ? endOfDay(parseISO(taskData.end_date))
      : endOfDay(addDays(timelineStart, 5));

  const timelineEnd =
    expectedDays > 0 ? addDays(baseEndDate, expectedDays) : baseEndDate;

  const totalDays = Math.max(
    1,
    differenceInCalendarDays(timelineEnd, timelineStart) + 1,
  );

  const days = Array.from({ length: totalDays }, (_, index) =>
    addDays(timelineStart, index),
  );

  const subTasks =
    timelineData?.sub_tasks && timelineData.sub_tasks.length > 0
      ? timelineData.sub_tasks
      : taskData?.sub_tasks || [];

  // Data for overall progress bar directly from response shape
  const bars = timelineData.bars || [];
  const actualBar = bars.find((b) => b.key === "actual");
  const expectedBar = bars.find((b) => b.key === "expected");
  const estimatedBar = bars.find((b) => b.key === "estimated");

  const actualHours = actualBar?.hours ?? timelineData.total_actual_hours ?? 0;
  const estimatedHours = estimatedBar?.hours ?? timelineData.total_estimated_hours ?? 0;

  const actualPct = Number(actualBar?.percentage || 0);
  const expectedPct = Number(expectedBar?.percentage || 0);

  // Width calculations for progress segments (order: actual -> estimated -> expected):
  const maxPct = Math.max(100, expectedPct);
  
  const actualSegmentWidth = (actualPct / maxPct) * 100;
  
  let estimatedSegmentWidth = 0;
  let expectedSegmentWidth = 0;

  if (expectedPct > 100) {
    // Expected exceeds estimation (task delayed/overrun): expected goes to the right of estimated
    estimatedSegmentWidth = ((100 - actualPct) / maxPct) * 100;
    expectedSegmentWidth = ((expectedPct - 100) / maxPct) * 100;
  } else {
    // Expected is within estimation: estimated first, then expected on the right
    estimatedSegmentWidth = (Math.max(0, 100 - expectedPct) / maxPct) * 100;
    expectedSegmentWidth = (Math.max(0, expectedPct - actualPct) / maxPct) * 100;
  }

  // Determine overall status from backend payload or calculation rules
  const rawStatus = String(timelineData.status || "").toLowerCase().trim();
  const totalActual = Number(timelineData.total_actual_hours || 0);
  const totalEstimated = Number(timelineData.total_estimated_hours || 0);

  let overallStatus = "on time";
  if (rawStatus) {
    if (rawStatus === "early" || rawStatus === "ahead") overallStatus = "early";
    else if (rawStatus === "behind" || rawStatus === "late") overallStatus = "behind";
    else if (rawStatus === "on time" || rawStatus === "on_time" || rawStatus === "on track") overallStatus = "on time";
  } else if (totalActual < totalEstimated) {
    overallStatus = "early";
  } else if (totalActual > totalEstimated) {
    overallStatus = "behind";
  } else {
    overallStatus = "on time";
  }

  const COLUMN_WIDTH = 130;
  const LABEL_COLUMN_WIDTH = 180;
  const totalGridWidth = days.length * COLUMN_WIDTH;

  const getSubTaskBarColor = (subtask) => {
    const st = String(subtask?.status || "").toLowerCase().trim();
    if (st === "complete" || st === "ahead" || st === "early") return "bg-emerald-500 text-white";
    if (st === "not complete" || st === "late" || st === "behind" || st === "incomplete")
      return "bg-red-500 text-white";
    if (st === "in progress" || st === "in_progress" || st === "on time" || st === "pending")
      return "bg-amber-500 text-white";
    return "bg-amber-500 text-white";
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Outer Scroll Container */}
      <div className="overflow-x-auto">
        <div
          className="min-w-full"
          style={{ width: LABEL_COLUMN_WIDTH + totalGridWidth }}
        >
          {/* Header Row: Column Labels */}
          <div className="flex border-b border-slate-200 pb-3 dark:border-slate-800">
            {/* Top Left Header Cell */}
            <div
              className="shrink-0 text-sm font-semibold text-slate-700 dark:text-slate-300"
              style={{ width: LABEL_COLUMN_WIDTH }}
            >
              Timeline View
            </div>

            {/* Date Headers */}
            <div className="flex" style={{ width: totalGridWidth }}>
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400"
                  style={{ width: COLUMN_WIDTH }}
                >
                  {format(day, "MMM dd")}
                </div>
              ))}
            </div>
          </div>

          {/* Main Grid Area */}
          <div className="relative">
            {/* Background Vertical Grid Lines */}
            <div
              className="pointer-events-none absolute bottom-0 top-0 flex"
              style={{ left: LABEL_COLUMN_WIDTH, width: totalGridWidth }}
            >
              {days.map((day, idx) => (
                <div
                  key={day.toISOString()}
                  className={`h-full border-r ${
                    idx === days.length - 1
                      ? "border-transparent"
                      : "border-slate-200/80 dark:border-slate-800/80"
                  }`}
                  style={{ width: COLUMN_WIDTH }}
                />
              ))}
            </div>

            {/* Row 1: Overall Task Progress */}
            <div className="relative flex items-center py-4">
              {/* Left Label */}
              <div
                className="shrink-0 pr-4 text-sm font-medium text-slate-700 dark:text-slate-200"
                style={{ width: LABEL_COLUMN_WIDTH }}
              >
                overall task progress
              </div>

              {/* Progress Container spanning the full timeline width */}
              <div style={{ width: totalGridWidth }}>
                {/* Segmented Bar Container with continuous colors (no gap/inner rounding) */}
                <div className="relative flex h-10 w-full items-center overflow-hidden rounded-2xl border border-slate-300 bg-slate-100 shadow-inner dark:border-slate-700 dark:bg-slate-800">
                  {/* 1. Actual Segment (Light Green) */}
                  {actualSegmentWidth > 0 && (
                    <div
                      className="h-full bg-emerald-300 transition-all duration-300 dark:bg-emerald-400"
                      style={{ width: `${actualSegmentWidth}%` }}
                      title={`Actual: ${actualHours}h (${actualPct}%)`}
                    />
                  )}

                  {/* 2. Estimated Segment (Light Blue) */}
                  {estimatedSegmentWidth > 0 && (
                    <div
                      className="h-full bg-sky-200 transition-all duration-300 dark:bg-sky-300"
                      style={{ width: `${estimatedSegmentWidth}%` }}
                      title={`Estimated: ${estimatedHours}h (100%)`}
                    />
                  )}

                  {/* 3. Expected Segment (Light Red - on the RIGHT side of estimated) */}
                  {expectedSegmentWidth > 0 && (
                    <div
                      className="h-full bg-red-200 transition-all duration-300 dark:bg-red-300"
                      style={{ width: `${expectedSegmentWidth}%` }}
                      title={`Expected: ${expectedHours}h (${expectedPct}%) • ${expectedDays} expected ${expectedDays === 1 ? "day" : "days"}`}
                    />
                  )}
                </div>

                {/* Info & Status indicator under overall task progress bar */}
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    Expected completion:{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {expectedDays} {expectedDays === 1 ? "day" : "days"}
                    </span>{" "}
                    ({expectedHours}h)
                  </span>

                  <div className="flex items-center">
                    <span
                      className={
                        overallStatus === "early"
                          ? "font-bold text-emerald-600 dark:text-emerald-400"
                          : "opacity-60"
                      }
                    >
                      early
                    </span>
                    <span className="mx-1.5 opacity-40">/</span>
                    <span
                      className={
                        overallStatus === "on time"
                          ? "font-bold text-amber-600 dark:text-amber-400"
                          : "opacity-60"
                      }
                    >
                      on time
                    </span>
                    <span className="mx-1.5 opacity-40">/</span>
                    <span
                      className={
                        overallStatus === "behind"
                          ? "font-bold text-red-600 dark:text-red-400"
                          : "opacity-60"
                      }
                    >
                      behind
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal Dashed Line Separator */}
            <div className="my-3 border-t-2 border-dashed border-slate-300 dark:border-slate-700" />

            {/* Row 2+: Subtask Timeline */}
            <div className="relative py-2">
              <div className="flex">
                {/* Left Label */}
                <div
                  className="shrink-0 pr-4 text-sm font-medium text-slate-700 dark:text-slate-200"
                  style={{ width: LABEL_COLUMN_WIDTH }}
                >
                  subtask timeline
                </div>

                {/* Subtask Timeline Rows Area */}
                <div
                  className="relative min-h-[140px] space-y-3"
                  style={{ width: totalGridWidth }}
                >
                  {subTasks.length === 0 ? (
                    <div className="flex h-24 items-center justify-center text-xs italic text-slate-400">
                      No subtasks found for this task.
                    </div>
                  ) : (
                    subTasks.map((subtask) => {
                      const sDate = subtask.start_date
                        ? startOfDay(parseISO(subtask.start_date))
                        : timelineStart;
                      const eDate = subtask.end_date
                        ? endOfDay(parseISO(subtask.end_date))
                        : timelineEnd;

                      const startIdx = Math.max(
                        0,
                        differenceInCalendarDays(sDate, timelineStart),
                      );
                      const endIdx = Math.min(
                        days.length - 1,
                        differenceInCalendarDays(eDate, timelineStart),
                      );

                      const left = startIdx * COLUMN_WIDTH;
                      const barWidth = Math.max(
                        COLUMN_WIDTH * 0.9,
                        (endIdx - startIdx + 1) * COLUMN_WIDTH - 8,
                      );

                      const barColorClass = getSubTaskBarColor(subtask);

                      return (
                        <div key={subtask.id || subtask.sub_task_id} className="relative h-10">
                          <div
                            className={`absolute flex h-9 items-center justify-between rounded-2xl px-4 shadow-sm transition-all duration-200 hover:shadow-md ${barColorClass}`}
                            style={{ left: left + 4, width: barWidth }}
                          >
                            <span className="truncate text-xs font-semibold">
                              {subtask.title}
                            </span>
                            {subtask.status && (
                              <span className="ml-2 shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                                {subtask.status}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-slate-200 pt-5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="h-4 w-6 rounded-md bg-red-200 border border-red-300 dark:bg-red-300 dark:border-red-400" />
          <span>expected</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-6 rounded-md bg-emerald-300 border border-emerald-400 dark:bg-emerald-400 dark:border-emerald-500" />
          <span>actual</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-6 rounded-md bg-sky-200 border border-sky-300 dark:bg-sky-300 dark:border-sky-400" />
          <span>estimated</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-6 rounded-md bg-red-500" />
          <span>late</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-6 rounded-md bg-emerald-500" />
          <span>ahead</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-6 rounded-md bg-amber-500" />
          <span>in progress</span>
        </div>
      </div>
    </div>
  );
};

export default SubTaskTimeline;