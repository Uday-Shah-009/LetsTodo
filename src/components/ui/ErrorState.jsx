import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorState({
  title = "Something went wrong",
  message = "Failed to load data. Please try again.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/10">
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}
