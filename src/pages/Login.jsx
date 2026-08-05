import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { useLoginMutation } from "../app/Queries/auth.query";
import { toast } from "react-toastify";

export default function Login() {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Container */}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-blue-500 italic">LETS</span>
            <span className="text-gray-900">TODO</span>
          </h1>
          <p className="text-gray-500 mt-2">Welcome Back!</p>
        </div>

        {/* Card */}
        <div className="bg-white shadow-md rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Login</h2>

          <p className="text-gray-500 text-sm mb-6">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-700 font-medium">Username</label>

              <input
                type="text"
                placeholder="Your Username"
                {...register("username", {
                  required: "username is required",
                })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-700 font-medium">
                Password
              </label>

              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 transition text-white font-medium py-2.5 rounded-lg cursor-pointer"
              disabled={loginMutate.isPending}
            >
              {loginMutate.isPending ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
