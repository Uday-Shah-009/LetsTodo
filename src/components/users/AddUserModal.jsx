import { useForm } from "react-hook-form";
import { useAddUser } from "../../app/Queries/users.query";
import { toast } from "react-toastify";

export default function AddUserModal({ closeModal }) {
  const AddUserMutate = useAddUser();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    AddUserMutate.mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message);
        reset();
        closeModal();
      },
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add User</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="user-modal-username" className="block text-xs font-medium text-gray-700 dark:text-gray-300">Username *</label>
            <input
              id="user-modal-username"
              type="text"
              placeholder="Username"
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
                maxLength: { value: 50, message: "Maximum 50 characters" },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: "Only letters, numbers and underscores",
                },
              })}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="user-modal-email" className="block text-xs font-medium text-gray-700 dark:text-gray-300">Email Address *</label>
            <input
              id="user-modal-email"
              type="email"
              placeholder="Email address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="user-modal-password" className="block text-xs font-medium text-gray-700 dark:text-gray-300">Password *</label>
            <input
              id="user-modal-password"
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                  message: "Must include at least one letter and one number",
                },
              })}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded-md"
              disabled={AddUserMutate.isPending}
            >
              {AddUserMutate.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
