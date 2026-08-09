import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, CheckCircle2, XCircle, ClipboardList } from "lucide-react";
import {
  useApproveSubTaskRequest,
  useRejectSubTaskRequest,
} from "../../app/Queries/Tasks.query";
import { getStatusClasses } from "../../utils/statusColors";

export default function SubTaskReviewModal({ open, onClose, request }) {
  const [action, setAction] = useState(null);

  const ApproveSubTaskMutate = useApproveSubTaskRequest();
  const RejectSubTaskMutate = useRejectSubTaskRequest();

  const isApprovePending = ApproveSubTaskMutate.isPending;
  const isRejectPending = RejectSubTaskMutate.isPending;

  const {
    register: approveRegister,
    handleSubmit: handleApproveSubmit,
    reset: resetApprove,
  } = useForm({
    defaultValues: {
      weightage_priority: "",
      subtask_priority: "medium",
      comment: "",
    },
  });

  const {
    register: rejectRegister,
    handleSubmit: handleRejectSubmit,
    reset: resetReject,
  } = useForm({
    defaultValues: {
      comment: "",
    },
  });

  useEffect(() => {
    resetApprove({
      weightage_priority: "",
      subtask_priority: "medium",
      comment: "",
    });
    resetReject({
      comment: "",
    });
    setAction(null);
  }, [request, resetApprove, resetReject]);

  if (!open || !request) return null;

  const onApproveSubmit = (data) => {
    ApproveSubTaskMutate.mutate(
      {
        requestId: request.id,
        weightage_priority: Number(data.weightage_priority),
        subtask_priority: data.subtask_priority,
        comment: data.comment,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const onRejectSubmit = (data) => {
    RejectSubTaskMutate.mutate(
      {
        requestId: request.id,
        comment: data.comment,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-[#09142a] border border-zinc-200 dark:border-[#1e293b] rounded-3xl overflow-hidden shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-[#1e293b]">
          <div>
            <h2 className="text-2xl font-semibold text-[#101828] dark:text-white">
              Review Subtask Update Request
            </h2>
            <p className="text-[#667085] dark:text-[#94a3b8] mt-1 text-sm">
              Review and set priority fields for Subtask #{request?.sub_task_id}.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-[#0b1730] hover:bg-zinc-200 dark:hover:bg-[#13203b] flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* REQUEST DETAILS */}
          <div className="bg-zinc-50 dark:bg-[#0b1730] border border-zinc-200 dark:border-[#1e293b] rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="w-5 h-5 text-[#667085] dark:text-[#94a3b8]" />
              <h3 className="text-base font-semibold text-[#101828] dark:text-white">
                Subtask Request Details
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-xs text-[#667085] dark:text-[#94a3b8]">Subtask ID</label>
                <p className="font-semibold text-[#101828] dark:text-white">#{request?.sub_task_id}</p>
              </div>

              <div>
                <label className="text-xs text-[#667085] dark:text-[#94a3b8]">Requested By</label>
                <p className="font-semibold text-[#101828] dark:text-white">{request?.requested_by?.name || "-"}</p>
              </div>

              <div>
                <label className="text-xs text-[#667085] dark:text-[#94a3b8]">Status</label>
                <div className="mt-1">
                  <span className={`px-2 py-0.5 text-xs rounded-md capitalize ${getStatusClasses(request?.status)}`}>
                    {request?.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#667085] dark:text-[#94a3b8]">Note</label>
                <p className="text-[#101828] dark:text-white">{request?.requested_changes?.note || "-"}</p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAction("approve")}
              className={`rounded-2xl p-4 border flex items-center justify-center gap-2 font-medium transition cursor-pointer ${
                action === "approve"
                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "bg-zinc-100 dark:bg-[#0b1730] border-zinc-200 dark:border-[#1e293b] text-gray-700 dark:text-gray-300"
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              Approve Request
            </button>

            <button
              type="button"
              onClick={() => setAction("reject")}
              className={`rounded-2xl p-4 border flex items-center justify-center gap-2 font-medium transition cursor-pointer ${
                action === "reject"
                  ? "bg-red-500/15 border-red-500 text-red-600 dark:text-red-400"
                  : "bg-zinc-100 dark:bg-[#0b1730] border-zinc-200 dark:border-[#1e293b] text-gray-700 dark:text-gray-300"
              }`}
            >
              <XCircle className="w-5 h-5" />
              Reject Request
            </button>
          </div>

          {/* APPROVE FORM */}
          {action === "approve" && (
            <form
              onSubmit={handleApproveSubmit(onApproveSubmit)}
              className="bg-zinc-50 dark:bg-[#0b1730] border border-zinc-200 dark:border-[#1e293b] rounded-2xl p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Weightage Priority
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2"
                  required
                  {...approveRegister("weightage_priority", { required: true })}
                  className="w-full rounded-xl px-4 py-2.5 border border-zinc-300 dark:border-[#1e293b] bg-white dark:bg-[#09142a] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Subtask Priority
                </label>
                <select
                  {...approveRegister("subtask_priority")}
                  className="w-full rounded-xl px-4 py-2.5 border border-zinc-300 dark:border-[#1e293b] bg-white dark:bg-[#09142a] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Comment
                </label>
                <textarea
                  rows={3}
                  placeholder="Approval comment..."
                  {...approveRegister("comment")}
                  className="w-full rounded-xl px-4 py-2.5 border border-zinc-300 dark:border-[#1e293b] bg-white dark:bg-[#09142a] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isApprovePending}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {isApprovePending ? "Approving..." : "Approve Subtask Request"}
              </button>
            </form>
          )}

          {/* REJECT FORM */}
          {action === "reject" && (
            <form
              onSubmit={handleRejectSubmit(onRejectSubmit)}
              className="bg-zinc-50 dark:bg-[#0b1730] border border-zinc-200 dark:border-[#1e293b] rounded-2xl p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Rejection Reason
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide rejection reason..."
                  required
                  {...rejectRegister("comment", { required: true })}
                  className="w-full rounded-xl px-4 py-2.5 border border-zinc-300 dark:border-[#1e293b] bg-white dark:bg-[#09142a] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={isRejectPending}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {isRejectPending ? "Rejecting..." : "Reject Subtask Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
