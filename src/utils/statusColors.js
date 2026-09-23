export const getStatusClasses = (status) => {
  switch (status?.toLowerCase()) {
    case "complete":
    case "completed":
      return "bg-emerald-100 text-emerald-800 border border-emerald-300/80 dark:bg-[#09331d] dark:text-[#10b981] dark:border-[#116335]/80 font-medium";
    case "in progress":
    case "in-progress":
      return "bg-amber-100 text-amber-800 border border-amber-300/80 dark:bg-[#332508] dark:text-[#eab308] dark:border-[#634a11]/80 font-medium";
    case "not complete":
    case "not-started":
    case "overdue":
    default:
      return "bg-red-100 text-red-800 border border-red-300/80 dark:bg-[#330c0c] dark:text-[#ef4444] dark:border-[#631111]/80 font-medium";
  }
};

export const getRequestStatusClasses = (status) => {
  switch (String(status).toLowerCase()) {
    case "approved":
    case "complete":
    case "completed":
      return "bg-emerald-100 text-emerald-800 border border-emerald-300/80 dark:bg-[#09331d] dark:text-[#10b981] dark:border-[#116335]/80 font-medium";
    case "pending":
    case "in progress":
    case "in-progress":
      return "bg-amber-100 text-amber-800 border border-amber-300/80 dark:bg-[#332508] dark:text-[#eab308] dark:border-[#634a11]/80 font-medium";
    case "reject":
    case "rejected":
    default:
      return "bg-red-100 text-red-800 border border-red-300/80 dark:bg-[#330c0c] dark:text-[#ef4444] dark:border-[#631111]/80 font-medium";
  }
};
