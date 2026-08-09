import React from "react";

export default function LoadingSpinner({ message = "Loading...", fullPage = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
