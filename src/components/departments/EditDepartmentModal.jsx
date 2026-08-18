import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Building2 } from "lucide-react";

export default function EditDepartmentModal({
  isOpen,
  onClose,
  department,
  onSave,
  isPending = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      deptname: "",
    },
  });

  useEffect(() => {
    if (department) {
      setValue("deptname", department.name || "");
    }
  }, [department, setValue]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !department) return null;

  const onSubmit = (data) => {
    onSave(data.deptname?.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative z-10 w-full max-w-md
          rounded-3xl border
          border-slate-200 dark:border-white/10
          bg-white dark:bg-[#07152F]
          p-6 shadow-2xl
          animate-[fadeIn_0.2s_ease-out]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Edit Department
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update department details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="
              w-9 h-9 rounded-xl
              bg-slate-100 dark:bg-white/5
              hover:bg-slate-200 dark:hover:bg-white/10
              text-slate-500 dark:text-slate-400
              flex items-center justify-center
              transition cursor-pointer
            "
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="edit-dept-name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Department Name *
            </label>

            <input
              id="edit-dept-name"
              type="text"
              placeholder="e.g. Engineering"
              {...register("deptname", {
                required: "Department name is required",
                minLength: {
                  value: 2,
                  message: "Must be at least 2 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Cannot exceed 100 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9\s-]+$/,
                  message: "Only letters, numbers, spaces and hyphens allowed",
                },
              })}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                py-3
                text-slate-900
                placeholder:text-slate-400
                focus:border-blue-500
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500/20
                dark:border-white/10
                dark:bg-[#0B1D3D]
                dark:text-white
                dark:placeholder:text-slate-500
                transition-all
              "
            />

            {errors.deptname && (
              <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-400">
                {errors.deptname.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="
                px-4 py-2.5 rounded-xl text-sm font-medium
                border border-slate-300 dark:border-white/10
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-white/5
                disabled:opacity-50 disabled:cursor-not-allowed
                transition cursor-pointer
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="
                px-5 py-2.5 rounded-xl text-sm font-medium
                bg-blue-600 hover:bg-blue-700 text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                transition shadow-sm cursor-pointer
              "
            >
              {isPending ? "Updating..." : "Update Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
