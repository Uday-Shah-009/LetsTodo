import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useReviseTask } from "../../app/Queries/Tasks.query";

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
  const [bumpType, setBumpType] = useState("minor");
  const reviseTaskMutation = useReviseTask();

  if (!open || !task) return null;

  const handleRevise = (event) => {
    event.preventDefault();

    reviseTaskMutation.mutate(
      {
        taskId: task.id,
        bumpType,
      },
      {
        onSuccess: (createdTask) => {
          toast.success("Task revised successfully");
          onRevised?.(createdTask);
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 dark:border-gray-800 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Revise Task</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create a new version of {task.title || `task ${task.id}`}.
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

        <form onSubmit={handleRevise} className="space-y-6 px-6 py-5">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bump type
            </label>

            <div className="grid gap-3 md:grid-cols-3">
              {bumpOptions.map((option) => {
                const isSelected = bumpType === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setBumpType(option.value)}
                    className={`rounded-2xl border-2 p-4 text-left ${
                      isSelected
                        ? "border-blue-600 dark:border-blue-500 bg-white dark:bg-gray-900"
                        : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">{option.label}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{option.version}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={reviseTaskMutation.isPending}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reviseTaskMutation.isPending ? "Revising..." : "Revise Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}