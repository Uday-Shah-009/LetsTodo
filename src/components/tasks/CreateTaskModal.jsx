import { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useCreateTask, useGetMyTasks, useGetAllTasks, useAddSubTaskToExistingTask } from "../../app/Queries/Tasks.query";
import { toast } from "react-toastify";
import { useNavigate } from "@tanstack/react-router";

export default function CreateTaskModal({
  users = [],
  categories = [],
  departments = [],
  isAdmin = false,
}) {
  const [step, setStep] = useState(1);
  const useCreateTaskMutate = useCreateTask();
  const useAddSubTaskToExistingTaskMutate = useAddSubTaskToExistingTask();

  const navigate = useNavigate();

  const myTasksQuery = useGetMyTasks({ enabled: !isAdmin });
  const allTasksQuery = useGetAllTasks({ pageSize: 10, enabled: isAdmin });

  const existingTasks = isAdmin
    ? (allTasksQuery.data?.items || [])
    : (myTasksQuery.data?.items || []);
  const isLoadingExisting = isAdmin ? allTasksQuery.isPending : myTasksQuery.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      include_priority: isAdmin,
      non_priority_flag: false,
      subtasks: [
        {
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
        },
      ],
      destination_option: "create_new",
      existing_task_id: "",
      title: "",
      description: "",
      category_id: "",
      department_id: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const includePriority = useWatch({ control, name: "include_priority" });
  const noPriority = useWatch({ control, name: "non_priority_flag" });
  const subtasksWatch = useWatch({ control, name: "subtasks" }) || [];
  const destinationOption = useWatch({ control, name: "destination_option" });

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

  const handleNextStep1 = async () => {
    const isValid = await trigger("subtasks");
    if (isValid) {
      setStep(2);
    }
  };

  const onSubmit = (data) => {
    const isPriorityEnabled = (isAdmin || data.include_priority) && !data.non_priority_flag;

    if (data.destination_option === "add_to_existing") {
      const taskId = Number(data.existing_task_id);
      const subtasksMapped = (data.subtasks || []).map((task) => ({
        title: task.title?.trim(),
        description: task.description?.trim(),
        ...(isPriorityEnabled && {
          weightage_priority: Number(task.weightage_priority || 0),
          subtask_priority: task.subtask_priority || "medium",
        }),
        estimated_days: task.estimation_type === "days" ? Number(task.estimation_value || 0) : 0,
        estimated_hours: task.estimation_type === "hours" ? Number(task.estimation_value || 0) : 0,
        start_date: new Date(`${task.start_date}T${task.start_time}`).toISOString(),
        task_id: taskId,
        assigned_to: task.assigned_to ? Number(task.assigned_to) : null,
      }));

      const payload = subtasksMapped.length === 1 ? subtasksMapped[0] : subtasksMapped;

      useAddSubTaskToExistingTaskMutate.mutate(payload, {
        onSuccess: () => {
          toast.success("Tasks added to existing main task successfully");
          reset({
            include_priority: isAdmin,
            non_priority_flag: false,
            subtasks: [
              {
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
              },
            ],
            destination_option: "create_new",
            existing_task_id: "",
            title: "",
            description: "",
          });
          navigate({ to: isAdmin ? "/admin/tasks" : "/tasks" });
        },
      });
      return;
    }

    // "create_new" flow (do not change this payload format)
    const payload = {
      title: data.title?.trim(),
      description: data.description?.trim(),
      non_priority_flag: !!data.non_priority_flag,
      category_id: data.category_id ? Number(data.category_id) : null,
      ...(isAdmin && {
        department_id: data.department_id ? Number(data.department_id) : null,
      }),
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

    useCreateTaskMutate.mutate(payload, {
      onSuccess: () => {
        toast.success("Task created");
        reset({
          include_priority: isAdmin,
          non_priority_flag: false,
          subtasks: [
            {
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
            },
          ],
          destination_option: "create_new",
          existing_task_id: "",
          title: "",
          description: "",
          category_id: "",
          department_id: "",
        });
        navigate({ to: isAdmin ? "/admin/tasks" : "/tasks" });
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Create Tasks</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {step === 1 ? "Step 1 of 2: Configure subtasks & task details" : "Step 2 of 2: Set destination main task"}
          </p>
        </div>

        {/* Visual Stepper */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === 1
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-green-600 text-white"
              }`}
            >
              1
            </span>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Subtasks</span>
          </div>

          <div className="w-8 h-0.5 bg-zinc-200 dark:bg-zinc-800" />

          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === 2
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
              }`}
            >
              2
            </span>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Destination</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* STEP 1: Task Cards List */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input type="checkbox" {...register("non_priority_flag")} />
                <span>No admin review required ?</span>
              </label>
              {!isAdmin && (
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input type="checkbox" {...register("include_priority")} />
                  <span>Add priority and weightage fields</span>
                </label>
              )}
            </div>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-lg space-y-3 bg-white dark:bg-zinc-900/50 shadow-sm">
                  <div className="flex justify-between items-center border-b pb-2 mb-2 border-zinc-100 dark:border-zinc-800/80">
                    <h3 className="font-medium text-zinc-900 dark:text-white">Task {index + 1}</h3>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="
                          p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400
                          hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors
                        "
                        title="Remove Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`subtasks.${index}.title`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Task Title
                    </label>
                    <input
                      id={`subtasks.${index}.title`}
                      {...register(`subtasks.${index}.title`, {
                        required: "Task title is required",
                        minLength: { value: 3, message: "Minimum 3 characters" },
                        maxLength: { value: 200, message: "Maximum 200 characters" },
                      })}
                      placeholder="Task title"
                      className="w-full px-3 py-2 border rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors?.subtasks?.[index]?.title && (
                      <p className="text-red-500 text-sm">{errors.subtasks[index].title.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`subtasks.${index}.description`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Task Description
                    </label>
                    <textarea
                      id={`subtasks.${index}.description`}
                      {...register(`subtasks.${index}.description`)}
                      placeholder="Task description"
                      className="w-full px-3 py-2 border rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={`subtasks.${index}.start_date`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Start Date
                      </label>
                      <input
                        id={`subtasks.${index}.start_date`}
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        {...register(`subtasks.${index}.start_date`, {
                          required: "Start date is required",
                          validate: (val) =>
                            !val ||
                            val >= new Date().toISOString().split("T")[0] ||
                            "Date cannot be in the past",
                        })}
                        className="w-full px-3 py-2 border rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors?.subtasks?.[index]?.start_date && (
                        <p className="text-red-500 text-sm">{errors.subtasks[index].start_date.message || "Start date is required"}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={`subtasks.${index}.start_time`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Start Time
                      </label>
                      <input
                        id={`subtasks.${index}.start_time`}
                        {...register(`subtasks.${index}.start_time`, {
                          required: "Start time is required",
                        })}
                        type="time"
                        className="w-full px-3 py-2 border rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors?.subtasks?.[index]?.start_time && (
                        <p className="text-red-500 text-sm">{errors.subtasks[index].start_time.message || "Start time is required"}</p>
                      )}
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
                          min: { value: 0, message: "Value cannot be negative" },
                        })}
                        type="number"
                        placeholder={
                          (subtasksWatch[index]?.estimation_type || "days") === "days"
                            ? "Estimated Days"
                            : "Estimated Hours"
                        }
                        className="w-full px-3 py-2 border rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors?.subtasks?.[index]?.estimation_value && (
                        <p className="text-red-500 text-sm">{errors.subtasks[index].estimation_value.message}</p>
                      )}
                    </div>
                  </div>

                  {((isAdmin || includePriority) && !noPriority) && (
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
                          className="w-full px-3 py-2 border rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor={`subtasks.${index}.subtask_priority`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Task Priority
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
            </div>

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
              Add Task
            </button>

            {errors?.subtasks && !Array.isArray(errors.subtasks) && (
              <p className="text-red-500 text-sm">{errors.subtasks.message}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate({ to: isAdmin ? "/admin/tasks" : "/tasks" })}
                className="w-full md:w-auto px-5 py-2 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNextStep1}
                className="w-full md:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Destination & Main Task Settings */}
        {step === 2 && (
          <div className="space-y-6 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-5 rounded-lg">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Choose Destination
                </span>
                <div className="flex gap-6 border-b pb-4 border-zinc-100 dark:border-zinc-800">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      value="create_new"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      {...register("destination_option")}
                    />
                    <span>Create a New Main Task</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      value="add_to_existing"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      {...register("destination_option")}
                    />
                    <span>Add to Existing Main Task</span>
                  </label>
                </div>
              </div>

              {destinationOption === "create_new" ? (
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="title" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Main Task Title
                    </label>
                    <input
                      id="title"
                      {...register("title", {
                        required: destinationOption === "create_new" ? "Main task title is required" : false,
                        minLength: { value: 3, message: "Minimum 3 characters" },
                        maxLength: { value: 200, message: "Maximum 200 characters" },
                      })}
                      placeholder="Main Task Title"
                      className="w-full px-3 py-2 border rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors?.title && (
                      <p className="text-red-500 text-sm">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="description" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Main Task Description
                    </label>
                    <textarea
                      id="description"
                      {...register("description", {
                        maxLength: { value: 1000, message: "Maximum 1000 characters" },
                      })}
                      placeholder="Main Task Description"
                      className="w-full px-3 py-2 border rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors?.description && (
                      <p className="text-red-500 text-sm">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="category_id" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Category
                    </label>
                    <select
                      id="category_id"
                      {...register("category_id")}
                      className="
                        w-full px-3 py-2 rounded border
                        border-zinc-300 dark:border-zinc-700
                        bg-white dark:bg-zinc-900
                        text-zinc-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                      "
                    >
                      <option value="">Select Category</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {isAdmin && (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="department_id" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Department
                      </label>
                      <select
                        id="department_id"
                        {...register("department_id")}
                        className="
                          w-full px-3 py-2 rounded border
                          border-zinc-300 dark:border-zinc-700
                          bg-white dark:bg-zinc-900
                          text-zinc-900 dark:text-white
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                        "
                      >
                        <option value="">Select Department</option>
                        {departments?.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <label htmlFor="existing_task_id" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Select Existing Main Task
                  </label>
                  {isLoadingExisting ? (
                    <div className="text-sm text-zinc-500 py-2">Loading existing tasks...</div>
                  ) : (
                    <select
                      id="existing_task_id"
                      {...register("existing_task_id", {
                        required: destinationOption === "add_to_existing" ? "Please select a main task" : false,
                      })}
                      className="
                        w-full px-3 py-2 rounded border
                        border-zinc-300 dark:border-zinc-700
                        bg-white dark:bg-zinc-900
                        text-zinc-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                      "
                    >
                      <option value="">Select Task</option>
                      {existingTasks?.map((task) => (
                        <option key={task.id} value={task.id}>
                          #{task.id} - {task.title}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors?.existing_task_id && (
                    <p className="text-red-500 text-sm">{errors.existing_task_id.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate({ to: isAdmin ? "/admin/tasks" : "/tasks" })}
                className="w-full md:w-auto px-5 py-2 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full md:w-auto px-5 py-2 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={useCreateTaskMutate.isPending || useAddSubTaskToExistingTaskMutate.isPending}
                className="
                  w-full md:w-auto px-5 py-2 rounded text-white
                  bg-green-600 hover:bg-green-700
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  transition-colors
                "
              >
                {useCreateTaskMutate.isPending || useAddSubTaskToExistingTaskMutate.isPending
                  ? "Submitting..."
                  : "Submit"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
