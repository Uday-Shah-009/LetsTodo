import { useState, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useCreateTask } from "../../app/Queries/Tasks.query";
import { toast } from "react-toastify";
import { useNavigate } from "@tanstack/react-router";

export default function CreateTaskModal({ users = [], isAdmin = false }) {
  const [step, setStep] = useState(1);
  const useCreateTaskMutate = useCreateTask();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      include_priority: isAdmin,
      subtasks: [],
    },
  });

  const navigate = useNavigate();

  const { fields, replace, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const subtaskCount = useWatch({ control, name: "subtask_count" });
  const includePriority = useWatch({ control, name: "include_priority" });
  const noPriority = useWatch({ control, name: "non_priority_flag" });
  const subtasksWatch = useWatch({ control, name: "subtasks" }) || [];

  const generateSubtasks = () => {
    const count = Number(subtaskCount);

    if (!count || count <= 0) return;

    const newSubtasks = Array.from({ length: count }).map(() => ({
      title: "",
      description: "",
      start_date: "",
      start_time: "",
      estimation_type: "days",
      estimation_value: 0,
      assigned_to: "",

      ...(isAdmin && {
        weightage_priority: "",
        subtask_priority: "medium",
      }),
    }));

    replace(newSubtasks);
    setStep(3);
  };

  useEffect(() => {
    setValue("subtask_count", fields.length);
  }, [fields.length, setValue]);

  const handleAddSubtask = () => {
    append({
      title: "",
      description: "",
      start_date: "",
      start_time: "",
      estimation_type: "days",
      estimation_value: 0,
      assigned_to: "",

      ...(isAdmin && {
        weightage_priority: "",
        subtask_priority: "medium",
      }),
    });
  };

  const onSubmit = (data) => {
    const payload = {
      title: data.title?.trim(),
      description: data.description?.trim(),
      non_priority_flag: !!data.non_priority_flag,

      sub_task_count: data.subtasks?.length || 0,

      sub_tasks: (data.subtasks || []).map((task) => ({
        title: task.title?.trim(),
        description: task.description?.trim(),

        status: "not complete",

        start_date: new Date(
          `${task.start_date}T${task.start_time}`,
        ).toISOString(),

        estimated_days: task.estimation_type === "days" ? Number(task.estimation_value || 0) : 0,
        estimated_hours: task.estimation_type === "hours" ? Number(task.estimation_value || 0) : 0,

        assigned_to: task.assigned_to ? Number(task.assigned_to) : null,

        ...((isAdmin || data.include_priority) &&
          !data.non_priority_flag && {
            weightage_priority: Number(task.weightage_priority || 0),
            subtask_priority: task.subtask_priority,
          }),
      })),
    };

    console.log(payload);

    useCreateTaskMutate.mutate(payload, {
      onSuccess: () => {
        toast.success("Task created");
        reset({
          include_priority: isAdmin,
          subtasks: [],
        });
        navigate({ to: isAdmin ? "/admin/tasks" : "/tasks" });
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4">
      <h1 className="text-2xl font-semibold">Create Task</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Task Title
              </label>
              <input
                id="title"
                {...register("title", {
                  required: true,
                  minLength: { value: 3, message: "Minimum 3 characters" },
                  maxLength: { value: 200, message: "Maximum 200 characters" },
                })}
                placeholder="Task Title"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Description
              </label>
              <textarea
                id="description"
                {...register("description", {
                  maxLength: { value: 1000, message: "Maximum 1000 characters" },
                })}
                placeholder="Description"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
              <input type="checkbox" {...register("non_priority_flag")} />
              <span>Requires no Priority ?</span>
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: isAdmin ? "/admin/tasks" : "/tasks" })}
                className="w-full md:w-auto px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subtask_count" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Number of subtasks
              </label>
              <input
                id="subtask_count"
                {...register("subtask_count", {
                  required: true,
                  min: 1,
                })}
                type="number"
                placeholder="Number of subtasks"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            {!isAdmin && (
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input type="checkbox" {...register("include_priority")} />
                <span>Add priority and weightage fields</span>
              </label>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: isAdmin ? "/admin/tasks" : "/tasks" })}
                className="w-full md:w-auto px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full md:w-auto px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={generateSubtasks}
                className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded"
              >
                Generate Subtasks
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-lg space-y-3 bg-white dark:bg-zinc-900/50 shadow-sm">
                <div className="flex justify-between items-center border-b pb-2 mb-2 border-zinc-100 dark:border-zinc-800/80">
                  <h3 className="font-medium text-zinc-900 dark:text-white">Subtask {index + 1}</h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="
                        p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400
                        hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors
                      "
                      title="Remove Subtask"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`subtasks.${index}.title`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Subtask Title
                  </label>
                  <input
                    id={`subtasks.${index}.title`}
                    {...register(`subtasks.${index}.title`, {
                      required: "Subtask title is required",
                      minLength: { value: 3, message: "Minimum 3 characters" },
                      maxLength: { value: 200, message: "Maximum 200 characters" },
                    })}
                    placeholder="Subtask title"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`subtasks.${index}.description`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Subtask Description
                  </label>
                  <textarea
                    id={`subtasks.${index}.description`}
                    {...register(`subtasks.${index}.description`)}
                    placeholder="Subtask description"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`subtasks.${index}.start_date`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Start Date
                    </label>
                    <input
                      id={`subtasks.${index}.start_date`}
                      {...register(`subtasks.${index}.start_date`, {
                        required: true,
                      })}
                      type="date"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`subtasks.${index}.start_time`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Start Time
                    </label>
                    <input
                      id={`subtasks.${index}.start_time`}
                      {...register(`subtasks.${index}.start_time`, {
                        required: true,
                      })}
                      type="time"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`subtasks.${index}.estimation_type`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Estimation Unit
                    </label>
                    <select
                      id={`subtasks.${index}.estimation_type`}
                      {...register(`subtasks.${index}.estimation_type`)}
                      className="
                        w-full px-3 py-2 rounded border
                        border-zinc-300 dark:border-zinc-700
                        bg-white dark:bg-zinc-900
                        text-zinc-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                      "
                    >
                      <option value="days">Days</option>
                      <option value="hours">Hours</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`subtasks.${index}.estimation_value`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Estimation Value
                    </label>
                    <input
                      id={`subtasks.${index}.estimation_value`}
                      {...register(`subtasks.${index}.estimation_value`, {
                        min: 0,
                      })}
                      type="number"
                      placeholder={
                        (subtasksWatch[index]?.estimation_type || "days") === "days"
                          ? "Estimated Days"
                          : "Estimated Hours"
                      }
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>

                {(isAdmin || includePriority) && !noPriority && (
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={`subtasks.${index}.weightage_priority`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Weightage Priority
                      </label>
                      <input
                        id={`subtasks.${index}.weightage_priority`}
                        type="number"
                        placeholder="Weightage Priority"
                        {...register(`subtasks.${index}.weightage_priority`)}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={`subtasks.${index}.subtask_priority`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Subtask Priority
                      </label>
                      <select
                        id={`subtasks.${index}.subtask_priority`}
                        {...register(`subtasks.${index}.subtask_priority`)}
                        className="
                          w-full px-3 py-2 rounded border
                          border-zinc-300 dark:border-zinc-700
                          bg-white dark:bg-zinc-900
                          text-zinc-900 dark:text-white
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                        "
                      >
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`subtasks.${index}.assigned_to`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Assigned To
                  </label>
                  <select
                    id={`subtasks.${index}.assigned_to`}
                    {...register(`subtasks.${index}.assigned_to`)}
                    className="
                      w-full px-3 py-2 rounded border
                      border-zinc-300 dark:border-zinc-700
                      bg-white dark:bg-zinc-900
                      text-zinc-900 dark:text-white
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    "
                  >
                    <option value="">Assign (optional)</option>

                    {users?.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddSubtask}
              className="
                w-full py-2.5 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg
                text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400
                hover:border-blue-500 dark:hover:border-blue-400
                flex items-center justify-center gap-2 text-sm font-medium transition-colors
              "
            >
              <Plus className="w-4 h-4" />
              Add Subtask
            </button>

            {errors?.subtasks && (
              <p className="text-red-500 text-sm">{errors.subtasks.message}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: isAdmin ? "/admin/tasks" : "/tasks" })}
                className="w-full md:w-auto px-5 py-2 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full md:w-auto px-5 py-2 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={useCreateTaskMutate.isPending}
                className="
                  w-full md:w-auto px-5 py-2 rounded text-white
                  bg-green-600 hover:bg-green-700
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {useCreateTaskMutate.isPending
                  ? "Creating Task..."
                  : "Create Task"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
