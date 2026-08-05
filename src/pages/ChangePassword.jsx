import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { useChangePassword } from "../app/Queries/users.query";
import { toast } from "react-toastify";

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
        toast.success(res.message);
        reset();
        navigate({ to: "/" });
      },
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-6">
      <button
        onClick={() => navigate({ to: "/" })}
        className="text-sm text-gray-600 hover:text-black mb-3 flex items-center gap-1"
      >
        ← Back to Login
      </button>


      <h2 className="text-2xl font-semibold text-center">Change Password</h2>

      <p className="text-sm text-gray-500 text-center mt-1 mb-4">
        Keep your account secure by updating your password regularly
      </p>

      <div className="border-t mb-5"></div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm mb-1">Current Password</label>
          <div className="flex">
            <input
              type={show.current ? "text" : "password"}
              {...register("current_password", {
                required: "Current password is required",
              })}
              placeholder="Enter current password"
              className="w-full border px-3 py-2 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={() =>
                setShow((prev) => ({ ...prev, current: !prev.current }))
              }
              className="px-3 border rounded-r-xl"
            >
              👁
            </button>
          </div>
          {errors.current_password && <p className="text-red-500 text-xs mt-1">{errors.current_password.message}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">New Password</label>
          <div className="flex">
            <input
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
              className="w-full border px-3 py-2 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={() => setShow((prev) => ({ ...prev, new: !prev.new }))}
              className="px-3 border rounded-r-xl"
            >
              👁
            </button>
          </div>
          {errors.new_password && <p className="text-red-500 text-xs mt-1">{errors.new_password.message}</p>}
          {newPassword && !errors.new_password && (
            <>
              <div className="h-2 bg-gray-200 rounded mt-2">
                <div className={`h-2 rounded ${strengthColor[strength]}`}></div>
              </div>
              <p className="text-xs mt-1 text-gray-600">Strength: {strength}</p>
            </>
          )}

          <p className="text-xs text-gray-500 mt-1">
            Use at least 8 characters for better security
          </p>
        </div>

        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <div className="flex">
            <input
              type={show.confirm ? "text" : "password"}
              {...register("confirm_password", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === watch("new_password") || "Passwords do not match",
              })}
              placeholder="Confirm new password"
              className="w-full border px-3 py-2 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={() =>
                setShow((prev) => ({ ...prev, confirm: !prev.confirm }))
              }
              className="px-3 border rounded-r-xl"
            >
              👁
            </button>
          </div>

          {watch("confirm_password") && (
            <p
              className={`text-xs mt-1 ${
                watch("confirm_password") === newPassword
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {watch("confirm_password") === newPassword
                ? "Passwords match"
                : "Passwords do not match"}
            </p>
          )}
        </div>
      <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-xl hover:opacity-90 transition"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
