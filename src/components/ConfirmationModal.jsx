import { useEffect, useRef } from "react";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isPending = false,
}) {
  const modalRef = useRef(null);

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

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      ),
      confirmBtn:
        "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/30",
    },
    warning: {
      icon: (
        <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      ),
      confirmBtn:
        "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500/30",
    },
  };

  const style = variantStyles[variant] || variantStyles.danger;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="
          relative z-10 w-full max-w-md mx-4
          rounded-2xl border
          border-slate-200 dark:border-white/10
          bg-white dark:bg-[#07152F]
          p-6 shadow-2xl
          animate-[fadeIn_0.2s_ease-out]
        "
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
            {style.icon}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="
              px-4 py-2 rounded-xl text-sm font-medium
              border border-slate-300 dark:border-white/10
              text-slate-700 dark:text-slate-300
              hover:bg-slate-100 dark:hover:bg-white/5
              disabled:opacity-50 disabled:cursor-not-allowed
              transition
            "
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium
              disabled:opacity-50 disabled:cursor-not-allowed
              transition focus:ring-2
              ${style.confirmBtn}
            `}
          >
            {isPending ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
