import React from "react";
import { FolderOpen } from "lucide-react";

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = "No data found",
  description = "There are no items to display right now.",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center space-y-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
          {description}
        </p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
