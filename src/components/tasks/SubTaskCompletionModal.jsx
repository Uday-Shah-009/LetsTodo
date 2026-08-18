import React from "react";

export default function SubTaskCompletionModal({
  isOpen,
  onClose,
  onConfirm,
  subTask,
  isLoading,
}) {
  if (!isOpen || !subTask) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Confirm Completion
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to mark <span className="font-medium text-gray-900 dark:text-white">"{subTask.title}"</span> as complete?
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
