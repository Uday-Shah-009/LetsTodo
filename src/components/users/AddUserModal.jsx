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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-[#0e1626] border border-gray-200 dark:border-[#263347] rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100">Add User</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="user-modal-username" className="block text-xs font-medium text-gray-700 dark:text-slate-300">Username *</label>
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
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-[#263347] bg-white dark:bg-[#182232] text-gray-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="user-modal-email" className="block text-xs font-medium text-gray-700 dark:text-slate-300">Email Address *</label>
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
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-[#263347] bg-white dark:bg-[#182232] text-gray-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="user-modal-password" className="block text-xs font-medium text-gray-700 dark:text-slate-300">Password *</label>
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
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-[#263347] bg-white dark:bg-[#182232] text-gray-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 dark:border-[#263347] text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-[#182232] rounded-lg text-xs font-medium transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition cursor-pointer"
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
