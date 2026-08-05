export const getStatusClasses = (status) => {
  switch (status?.toLowerCase()) {
    case "complete":
      return "bg-green-600/20 text-green-600 border border-green-600/30"
    case "in progress":
      return "bg-yellow-600/20 text-yellow-600 border border-yellow-600/30"
    case "not complete":
    default:
      return "bg-red-600/20 text-red-600 border border-red-600/30"
  }
}

export const getRequestStatusClasses = (status) => {
  switch (String(status).toLowerCase()) {
    case "approved":
      return "bg-green-600/20 text-green-600 border border-green-600/30"
    case "pending":
      return "bg-yellow-600/20 text-yellow-600 border border-yellow-600/30"
    case "reject":
    case "rejected":
    default:
      return "bg-red-600/20 text-red-600 border border-red-600/30"
  }
}
