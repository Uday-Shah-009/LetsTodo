import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTaskActivityRecorder } from "../../app/Queries/Tasks.query";
import { toast } from "react-toastify";

export default function CreateActivityModal({
  isOpen,
  onClose,
  subTaskId,
  subTaskTitle,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      note: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const ActivityMutate = useTaskActivityRecorder();
  const ActivityPending = ActivityMutate.isPending;
  const onSubmit = (data) => {
    const payload = {
      ...data,
      sub_task_id: subTaskId,
    };

    ActivityMutate.mutate(payload, {
      onSuccess: () => {
        reset();
        toast.success("Activity Recorded");
      },
    });
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-lg font-semibold">Add Activity</h2>
          <p className="text-sm text-gray-500">{subTaskTitle}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-5">
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium">Title *</label>

            <input
              type="text"
              placeholder="Implemented Login API"
              {...register("title", {
                required: "Title is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
                maxLength: { value: 200, message: "Maximum 200 characters" },
              })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            />

            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Description *
            </label>

            <textarea
              rows={4}
              placeholder="Describe the work completed..."
              {...register("description", {
                required: "Description is required",
                minLength: { value: 10, message: "Minimum 10 characters" },
                maxLength: { value: 2000, message: "Maximum 2000 characters" },
              })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="mb-1 block text-sm font-medium">Note</label>

            <textarea
              rows={3}
              placeholder="Additional details..."
              {...register("note", {
                maxLength: { value: 500, message: "Maximum 500 characters" },
              })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            />
          </div>

          {/* Date */}
          <div>
            <label className="mb-1 block text-sm font-medium">Date</label>
            <input type="date" readOnly {...register("date")} />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={ActivityPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {ActivityPending ? "Recording..." : "Record Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
