export function ConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg w-80">

        <p className="text-lg font-semibold mb-4 dark:text-black">
          Are you sure you want to remove this user?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded dark:text-black"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Confirm
          </button>
        </div>
       
      </div>
    </div>
  );
}