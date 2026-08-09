import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { useLoginMutation } from "../app/Queries/auth.query";
import { toast } from "react-toastify";
import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const loginMutate = useLoginMutation();

  const onSubmit = async (data) => {
    loginMutate.mutate(data, {
      onSuccess: (res) => {
        reset();
        res.role === "user"
          ? navigate({ to: "/dashboard" })
          : navigate({ to: "/admin/dashboard" });
        toast.success(`Welcome ${res.username}`);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors relative overflow-hidden">

      {/* Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="text-blue-500 italic">LETS</span>
            <span className="text-gray-900 dark:text-white">TODO</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Welcome back! Please log in to your account.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-2xl rounded-2xl p-8 backdrop-blur-sm">
          <div className="mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sign In</h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username Field */}
            <div>
              <label htmlFor="login-username" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="login-username"
                  type="text"
                  placeholder="Enter your username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-800/80 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="w-full pl-10 pr-11 py-2.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-800/80 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutate.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 text-sm mt-2"
            >
              {loginMutate.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
