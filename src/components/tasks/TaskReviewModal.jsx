import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { X, CheckCircle2, XCircle, ClipboardList } from "lucide-react";
import { useApproveTask, useRejectTask } from "../../app/Queries/Tasks.query";
import { getStatusClasses } from "../../utils/statusColors";

export default function TaskReviewModal({ open, onClose, task }) {
  const [action, setAction] = useState(null);

  const payload = task?.requested_payload?.payload;
  const RejectTaskMutate = useRejectTask();
  const ApproveTaskMutate = useApproveTask();
  const isRejectPending = RejectTaskMutate.isPending;
  const isApprovePending = ApproveTaskMutate.isPending;

  const {
    register: approveRegister,
    handleSubmit: handleApproveSubmit,
    control,
    reset: resetApprove,
  } = useForm({
    defaultValues: {
      comment: "",
      sub_tasks: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "sub_tasks",
  });

  // REJECT FORM
  const {
    register: rejectRegister,
    handleSubmit: handleRejectSubmit,
    reset: resetReject,
  } = useForm({
    defaultValues: {
      comment: "",
    },
  });

  // populate subtasks
  useEffect(() => {
    if (payload?.sub_tasks?.length) {
      replace(
        payload.sub_tasks.map((subtask) => ({
          client_subtask_id: subtask.client_subtask_id,
          title: subtask.title,
          weightage_priority: subtask.weightage_priority || "",
        })),
      );
    }

    resetApprove({
      comment: "",
      sub_tasks:
        payload?.sub_tasks?.map((subtask) => ({
          temporary_subtask_id: subtask.temporary_subtask_id,
          title: subtask.title,
          weightage_priority: subtask.weightage_priority || "",
          subtask_priority: subtask.subtask_priority || "medium",
        })) || [],
    });

    resetReject({
      comment: "",
    });
  }, [payload, replace, resetApprove, resetReject]);

  if (!open || !task) return null;

  // APPROVE SUBMIT
  const onApproveSubmit = (data) => {
    const approvePayload = {
      request_id: task.id,
      comment: data.comment,
      approved_payload: {
        sub_tasks: data.sub_tasks.map((subtask) => ({
          temporary_subtask_id: subtask.temporary_subtask_id,
          weightage_priority: Number(subtask.weightage_priority),
          subtask_priority: subtask.subtask_priority,
        })),
      },
    };
    ApproveTaskMutate.mutate(approvePayload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  // REJECT SUBMIT
  const onRejectSubmit = (data) => {
    const rejectPayload = {
      request_id: task.id,
      comment: data.comment,
    };
    RejectTaskMutate.mutate(rejectPayload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="
          w-full max-w-4xl
          bg-white dark:bg-[#09142a]
          border border-zinc-200 dark:border-[#1e293b]
          rounded-3xl
          overflow-hidden
          shadow-2xl
        "
      >
        {/* HEADER */}
        <div
          className="
            flex items-center justify-between
            px-6 py-5
            border-b border-zinc-200 dark:border-[#1e293b]
          "
        >
          <div>
            <h2 className="text-2xl font-semibold text-[#101828] dark:text-white">
              Review Task Request
            </h2>

            <p className="text-[#667085] dark:text-[#94a3b8] mt-1">
              Review and take action on this task request.
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              w-11 h-11 rounded-2xl
              bg-zinc-100 dark:bg-[#0b1730]
              hover:bg-zinc-200 dark:hover:bg-[#13203b]
              flex items-center justify-center
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-h-[85vh] overflow-y-auto">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* TASK DETAILS */}
            <div className="bg-zinc-50 dark:bg-[#0b1730] border border-zinc-200 dark:border-[#1e293b] rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <ClipboardList className="w-5 h-5 text-[#667085] dark:text-[#94a3b8]" />
                <h3 className="text-lg font-medium text-[#101828] dark:text-white">
                  Task Details
                </h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm text-[#667085] dark:text-[#94a3b8]">
                    Task Name
                  </label>
                  <p className="text-[#101828] dark:text-white mt-1 text-lg">
                    {payload?.title}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-[#667085] dark:text-[#94a3b8]">
                    Requested By
                  </label>
                  <p className="text-[#101828] dark:text-white mt-1">
                    {task?.requested_by?.name}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-[#667085] dark:text-[#94a3b8]">
                    Status
                  </label>
                  <div className="mt-1">
                    <span className={`px-2 py-1 text-xs rounded-md ${getStatusClasses(task?.status)}`}>
                      {task?.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[#667085] dark:text-[#94a3b8]">
                    Description
                  </label>
                  <p className="text-[#101828] dark:text-white mt-1">
                    {payload?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* ACTION SELECT */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setAction("approve")}
                className={`rounded-2xl p-4 border ${
                  action === "approve"
                    ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                    : "bg-zinc-100 dark:bg-[#0b1730]"
                }`}
              >
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2" />
                Approve
              </button>

              <button
                onClick={() => setAction("reject")}
                className={`rounded-2xl p-4 border ${
                  action === "reject"
                    ? "bg-red-500/15 border-red-500 text-red-400"
                    : "bg-zinc-100 dark:bg-[#0b1730]"
                }`}
              >
                <XCircle className="w-6 h-6 mx-auto mb-2" />
                Reject
              </button>
            </div>

            {/* APPROVE FORM */}
            {action === "approve" && (
              <form
                onSubmit={handleApproveSubmit(onApproveSubmit)}
                className="bg-zinc-50 dark:bg-[#0b1730] border border-zinc-200 dark:border-[#1e293b] rounded-3xl p-5 space-y-5"
              >
                <textarea
                  rows={4}
                  placeholder="Approval comment..."
                  {...approveRegister("comment")}
                  className="w-full rounded-2xl px-4 py-3 border"
                />

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border rounded-2xl p-4 space-y-3"
                  >
                    <input
                      value={field.title}
                      readOnly
                      className="w-full px-3 py-2 rounded-xl border"
                    />

                    <input
                      type="number"
                      placeholder="Weightage"
                      {...approveRegister(
                        `sub_tasks.${index}.weightage_priority`,
                      )}
                      className="w-full px-3 py-2 rounded-xl border"
                    />

                    <select
                      {...approveRegister(
                        `sub_tasks.${index}.subtask_priority`,
                      )}
                      className="
                      w-full px-3 py-2 rounded-xl border
                      border-zinc-300 dark:border-[#1e293b]
                      bg-white dark:bg-[#09142a]
                      text-[#101828] dark:text-white
                      focus:outline-none focus:ring-2 focus:ring-emerald-500
                    "
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>

                    <input
                      type="hidden"
                      {...approveRegister(
                        `sub_tasks.${index}.temporary_subtask_id`,
                      )}
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={isApprovePending}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3 rounded-2xl"
                >
                  {isApprovePending ? "Approving..." : "Approve Task"}
                </button>
              </form>
            )}

            {/* REJECT FORM */}
            {action === "reject" && (
              <form
                onSubmit={handleRejectSubmit(onRejectSubmit)}
                className="bg-zinc-50 dark:bg-[#0b1730] border border-zinc-200 dark:border-[#1e293b] rounded-3xl p-5 space-y-5"
              >
                <textarea
                  rows={5}
                  placeholder="Provide rejection reason..."
                  {...rejectRegister("comment")}
                  className="w-full rounded-2xl px-4 py-3 border"
                />

                <button
                  type="submit"
                  disabled={isRejectPending}
                  className="w-full bg-red-500 hover:bg-red-400 text-white font-semibold py-3 rounded-2xl"
                >
                  {isRejectPending ? "Rejecting..." : "Reject Task"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
