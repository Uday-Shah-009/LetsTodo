import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { useReviseTask } from "../../app/Queries/Tasks.query";
import { useGetAllUsers } from "../../app/Queries/users.query";

const bumpOptions = [
  {
    value: "major",
    label: "Major",
    version: "1.0.0",
    description: "Use for breaking changes or a significant task rewrite.",
  },
  {
    value: "minor",
    label: "Minor",
    version: "0.1.0",
    description: "Use for a meaningful revision without breaking the flow.",
  },
  {
    value: "patch",
    label: "Patch",
    version: "0.0.1",
    description: "Use for a small correction or incremental update.",
  },
];

export default function ReviseTaskModal({ open, onClose, task, onRevised }) {
  const [step, setStep] = useState(1);
  const [bumpType, setBumpType] = useState("minor");
  const [selectedSubTaskIds, setSelectedSubTaskIds] = useState([]);

  const reviseTaskMutation = useReviseTask();
  const { data: usersData } = useGetAllUsers();
  const usersList = Array.isArray(usersData) ? usersData : usersData?.items || [];

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subtasks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  // Initialize selected subtasks whenever modal opens or task changes
  useEffect(() => {
    if (open && task?.sub_tasks) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(1);
      setBumpType("minor");
      const allIds = task.sub_tasks.map((st) => st.id ?? st.sub_task_id);
      setSelectedSubTaskIds(allIds);
    }
  }, [open, task]);

  if (!open || !task) return null;

  const toggleSubTaskSelection = (id) => {
    setSelectedSubTaskIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const allIds = (task.sub_tasks || []).map((st) => st.id ?? st.sub_task_id);
    if (selectedSubTaskIds.length === allIds.length) {
      setSelectedSubTaskIds([]);
    } else {
      setSelectedSubTaskIds(allIds);
    }
  };

  const handleProceedToStep3 = () => {
    const selectedList = (task.sub_tasks || []).filter((st) =>
      selectedSubTaskIds.includes(st.id ?? st.sub_task_id)
    );

    const prefilledSubtasks = selectedList.map((st) => {
      const startDateObj = st.start_date ? new Date(st.start_date) : new Date();
      const dateStr = !isNaN(startDateObj.getTime())
        ? startDateObj.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      const timeStr = !isNaN(startDateObj.getTime())
        ? startDateObj.toTimeString().slice(0, 5)
        : "09:00";

      const isHours = Boolean(st.estimated_hours && Number(st.estimated_hours) > 0);
      const estType = isHours ? "hours" : "days";
      const estVal = isHours ? Number(st.estimated_hours) : Number(st.estimated_days || 0);

      const assignedId =
        st.assigned_to?.id != null
          ? String(st.assigned_to.id)
          : typeof st.assigned_to === "number" || typeof st.assigned_to === "string"
          ? String(st.assigned_to)
          : "";

      return {
        title: st.title || "",
        description: st.description || "",
        start_date: dateStr,
        start_time: timeStr,
        estimation_type: estType,
        estimation_value: estVal,
        assigned_to: assignedId,
        weightage_priority: st.weightage_priority ?? 1,
        subtask_priority: st.subtask_priority || "medium",
      };
    });

    if (prefilledSubtasks.length === 0) {
      prefilledSubtasks.push({
        title: "",
        description: "",
        start_date: new Date().toISOString().split("T")[0],
        start_time: "09:00",
        estimation_type: "days",
        estimation_value: 0,
        assigned_to: "",
        weightage_priority: 1,
        subtask_priority: "medium",
      });
    }

    reset({ subtasks: prefilledSubtasks });
    setStep(3);
  };

  const handleAddSubtask = () => {
    append({
      title: "",
      description: "",
      start_date: new Date().toISOString().split("T")[0],
      start_time: "09:00",
      estimation_type: "days",
      estimation_value: 0,
      assigned_to: "",
      weightage_priority: 1,
      subtask_priority: "medium",
    });
  };

  const onSubmit = (formData) => {
    const subTasksPayload = (formData.subtasks || []).map((st) => ({
      title: st.title?.trim(),
      description: st.description?.trim(),
      start_date: new Date(
        `${st.start_date}T${st.start_time || "00:00"}`
      ).toISOString(),
      estimated_days:
        st.estimation_type === "days" ? Number(st.estimation_value || 0) : 0,
      estimated_hours:
        st.estimation_type === "hours" ? Number(st.estimation_value || 0) : 0,
      assigned_to: st.assigned_to ? Number(st.assigned_to) : null,
      weightage_priority: Number(st.weightage_priority || 0),
      subtask_priority: st.subtask_priority || "medium",
    }));

    reviseTaskMutation.mutate(
      {
        taskId: task.id,
        bumpType,
        sub_tasks: subTasksPayload,
      },
      {
        onSuccess: (createdTask) => {
          toast.success("Task revised successfully");
          onRevised?.(createdTask);
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Revise Task: {task.title || `Task #${task.id}`}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Step {step} of 3:{" "}
              {step === 1 && "Select Version Bump Type"}
              {step === 2 && "Choose Previous Subtasks to Carry Over"}
              {step === 3 && "Customize Subtask Details & Schedule"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-3 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2 text-xs font-medium">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                step >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-500"
              }`}
            >
              1
            </span>
            <span className={step === 1 ? "font-bold text-blue-600 dark:text-blue-400" : "text-gray-500"}>
              Bump Type
            </span>
          </div>

          <div className="h-0.5 flex-1 bg-gray-200 dark:border-gray-800 mx-3"></div>

          <div className="flex items-center gap-2 text-xs font-medium">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                step >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-500"
              }`}
            >
              2
            </span>
            <span className={step === 2 ? "font-bold text-blue-600 dark:text-blue-400" : "text-gray-500"}>
              Select Subtasks
            </span>
          </div>

          <div className="h-0.5 flex-1 bg-gray-200 dark:border-gray-800 mx-3"></div>

          <div className="flex items-center gap-2 text-xs font-medium">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                step === 3
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-500"
              }`}
            >
              3
            </span>
            <span className={step === 3 ? "font-bold text-blue-600 dark:text-blue-400" : "text-gray-500"}>
              Subtask Form
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: Select Bump Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Revision Bump Type
                </label>

                <div className="grid gap-4 md:grid-cols-3">
                  {bumpOptions.map((option) => {
                    const isSelected = bumpType === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setBumpType(option.value)}
                        className={`rounded-2xl border-2 p-5 text-left transition ${
                          isSelected
                            ? "border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/30"
                            : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {option.label}
                          </span>
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">
                            {option.version}
                          </span>
                        </div>
                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                          {option.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Next: Select Subtasks →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Subtasks from Existing Task */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select which subtasks from the original task should be carried over into the revision.
                </p>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {selectedSubTaskIds.length === (task.sub_tasks || []).length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              {(!task.sub_tasks || task.sub_tasks.length === 0) ? (
                <div className="p-6 text-center text-sm text-gray-500 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                  No existing subtasks found in this task. You can add new subtasks in the next step.
                </div>
              ) : (
                <div className="space-y-3">
                  {task.sub_tasks.map((st) => {
                    const id = st.id ?? st.sub_task_id;
                    const isChecked = selectedSubTaskIds.includes(id);

                    return (
                      <div
                        key={id}
                        onClick={() => toggleSubTaskSelection(id)}
                        className={`flex items-start gap-4 p-4 rounded-xl border-2 transition cursor-pointer ${
                          isChecked
                            ? "border-blue-600 dark:border-blue-500 bg-blue-50/30 dark:bg-blue-950/20"
                            : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSubTaskSelection(id)}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-sm text-gray-900 dark:text-white">
                              {st.title}
                            </span>
                            {st.assigned_to && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                Assigned: {st.assigned_to.name || st.assigned_to}
                              </span>
                            )}
                          </div>
                          {st.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                              {st.description}
                            </p>
                          )}
                          <div className="flex gap-4 text-xs text-gray-400 pt-1">
                            {st.estimated_hours ? (
                              <span>Est. Hours: {st.estimated_hours}h</span>
                            ) : st.estimated_days ? (
                              <span>Est. Days: {st.estimated_days}d</span>
                            ) : null}
                            {st.start_date && (
                              <span>Start: {new Date(st.start_date).toLocaleDateString("en-IN")}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
                >
                  ← Back to Bump Type
                </button>
                <button
                  type="button"
                  onClick={handleProceedToStep3}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Next: Customize Subtasks ({selectedSubTaskIds.length}) →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Customize Subtask Details & Schedule */}
          {step === 3 && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-800/50">
                <div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Revision Summary
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                    Bump Type: <span className="capitalize font-semibold text-blue-600 dark:text-blue-400">{bumpType}</span> ({fields.length} subtask{fields.length !== 1 ? "s" : ""})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Change Subtasks Selection
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Subtasks for Revised Task
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition"
                  >
                    <Plus size={14} />
                    Add Subtask
                  </button>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-5 space-y-4 relative"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        Subtask #{index + 1}
                      </span>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-700 p-1 rounded transition"
                          title="Remove subtask"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {/* Subtask Title */}
                    <div>
                      <label className="block text-xs font-medium mb-1">Title *</label>
                      <input
                        type="text"
                        placeholder="Subtask title"
                        {...register(`subtasks.${index}.title`, {
                          required: "Title is required",
                        })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.subtasks?.[index]?.title && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.subtasks[index].title.message}
                        </p>
                      )}
                    </div>

                    {/* Subtask Description */}
                    <div>
                      <label className="block text-xs font-medium mb-1">Description *</label>
                      <textarea
                        rows={2}
                        placeholder="Subtask description..."
                        {...register(`subtasks.${index}.description`, {
                          required: "Description is required",
                        })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.subtasks?.[index]?.description && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.subtasks[index].description.message}
                        </p>
                      )}
                    </div>

                    {/* Schedule: Start Date & Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Start Date *</label>
                        <input
                          type="date"
                          {...register(`subtasks.${index}.start_date`, {
                            required: "Start date is required",
                          })}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Start Time *</label>
                        <input
                          type="time"
                          {...register(`subtasks.${index}.start_time`, {
                            required: "Start time is required",
                          })}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Estimation & User Assignment */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Estimate Unit</label>
                        <select
                          {...register(`subtasks.${index}.estimation_type`)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="days">Days</option>
                          <option value="hours">Hours</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1">Estimate Value *</label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          {...register(`subtasks.${index}.estimation_value`, {
                            required: "Estimation is required",
                            min: { value: 0, message: "Minimum 0" },
                          })}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1">Assigned To</label>
                        <select
                          {...register(`subtasks.${index}.assigned_to`)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="">Select User</option>
                          {usersList.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name || u.username || u.email || `User #${u.id}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Priority (Weightage & Level) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-medium mb-1">Weightage Priority</label>
                        <input
                          type="number"
                          min="0"
                          {...register(`subtasks.${index}.weightage_priority`)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Subtask Priority</label>
                        <select
                          {...register(`subtasks.${index}.subtask_priority`)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit / Action buttons */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
                >
                  ← Back to Subtasks Selection
                </button>

                <button
                  type="submit"
                  disabled={reviseTaskMutation.isPending}
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reviseTaskMutation.isPending ? "Revising Task..." : "Confirm & Revise Task"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}