import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { useChangePassword } from "../app/Queries/users.query";
import { toast } from "react-toastify";
import { Eye, EyeOff, ArrowLeft, Lock } from "lucide-react";

export default function ChangePasswordUI() {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const changePasswordMutate = useChangePassword();
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const newPassword = watch("new_password", "");

  const getStrength = (password) => {
    if (!password) return "";
    if (password.length < 6) return "Weak";
    if (password.length < 10) return "Medium";
    return "Strong";
  };

  const strength = getStrength(newPassword);

  const strengthColor = {
    Weak: "bg-red-500 w-1/3",
    Medium: "bg-yellow-500 w-2/3",
    Strong: "bg-green-500 w-full",
  };

  const onSubmit = (data) => {
    const payload = {
      current_password: data.current_password,
      new_password: data.new_password,
    };
    changePasswordMutate.mutate(payload, {
      onSuccess: (res) => {
        toast.success(res.message || "Password changed successfully");
        reset();
        navigate({ to: "/" });
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-2xl p-6 md:p-8 space-y-5">
        <button
          onClick={() => navigate({ to: "/" })}
          className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-500 mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Keep your account secure by updating your password regularly
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800"></div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="current-pw" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
            <div className="flex">
              <input
                id="current-pw"
                type={show.current ? "text" : "password"}
                {...register("current_password", {
                  required: "Current password is required",
                })}
                placeholder="Enter current password"
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2.5 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                aria-label={show.current ? "Hide password" : "Show password"}
                onClick={() =>
                  setShow((prev) => ({ ...prev, current: !prev.current }))
                }
                className="px-3 border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                {show.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.current_password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.current_password.message}</p>}
          </div>

          <div>
            <label htmlFor="new-pw" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <div className="flex">
              <input
                id="new-pw"
                type={show.new ? "text" : "password"}
                {...register("new_password", {
                  required: "New password is required",
                  minLength: { value: 8, message: "Minimum 8 characters" },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                    message: "Must include at least one letter and one number",
                  },
                })}
                placeholder="Enter new password"
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2.5 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                aria-label={show.new ? "Hide password" : "Show password"}
                onClick={() => setShow((prev) => ({ ...prev, new: !prev.new }))}
                className="px-3 border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                {show.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.new_password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.new_password.message}</p>}
            {newPassword && !errors.new_password && (
              <>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strengthColor[strength]}`}></div>
                </div>
                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400 font-medium">Strength: {strength}</p>
              </>
            )}
          </div>

          <div>
            <label htmlFor="confirm-pw" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <div className="flex">
              <input
                id="confirm-pw"
                type={show.confirm ? "text" : "password"}
                {...register("confirm_password", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === watch("new_password") || "Passwords do not match",
                })}
                placeholder="Confirm new password"
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2.5 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                aria-label={show.confirm ? "Hide password" : "Show password"}
                onClick={() =>
                  setShow((prev) => ({ ...prev, confirm: !prev.confirm }))
                }
                className="px-3 border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {watch("confirm_password") && (
              <p
                className={`text-xs mt-1 font-medium ${
                  watch("confirm_password") === newPassword
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                {watch("confirm_password") === newPassword
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={changePasswordMutate.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50 shadow-sm mt-2"
          >
            {changePasswordMutate.isPending ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
