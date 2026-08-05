import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useCreateDepartment,
  useGetDepartments,
} from "../../app/Queries/admin.query";

export default function AddDepartmentPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const {
    data: departments = [],
    isPending,
  } = useGetDepartments();

  const DepartmentMutate = useCreateDepartment();

  const onSubmit = (data) => {
    DepartmentMutate.mutate(data, {
      onSuccess: (res) => {
        toast.success(`${res.name} added`);
        reset();
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 dark:bg-[#020B1D]">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Department Management
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Create and manage organization departments.
          </p>
        </div>

        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-8
            shadow-sm
            dark:border-white/10
            dark:bg-[#07152F]
          "
        >
          <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
            Add Department
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Department Name
              </label>

              <input
                type="text"
                placeholder="Engineering"
                {...register("name", {
                  required: "Department name is required",
                  minLength: {
                    value: 2,
                    message: "Department name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Department name cannot exceed 100 characters",
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
                "
              />

              {errors.name && (
                <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={DepartmentMutate.isPending}
                className="
                  rounded-xl
                  bg-blue-500
                  px-6
                  py-3
                  font-medium
                  text-white
                  transition
                  hover:bg-blue-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {DepartmentMutate.isPending
                  ? "Creating..."
                  : "Create Department"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#07152F]">
          <div className="border-b border-slate-200 p-6 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Available Departments
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Departments currently available in the organization.
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                {departments.length} Departments
              </span>
            </div>
          </div>

          {isPending ? (
            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="
                    animate-pulse
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-5
                    dark:border-white/10
                    dark:bg-[#0B1D3D]
                  "
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="h-5 w-32 rounded bg-slate-300 dark:bg-slate-700" />
                      <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>

                    <div className="h-6 w-14 rounded bg-slate-200 dark:bg-slate-700" />
                  </div>

                  <div className="mt-6 border-t border-slate-200 pt-4 dark:border-white/10">
                    <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="mt-2 h-8 w-12 rounded bg-slate-300 dark:bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : departments.length > 0 ? (
            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((department) => (
                <div
                  key={department.id}
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-5
                    transition-all
                    hover:shadow-md
                    dark:border-white/10
                    dark:bg-[#0B1D3D]
                  "
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {department.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Department
                      </p>
                    </div>

                    <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                      Active
                    </span>
                  </div>

                  <div className="mt-6 border-t border-slate-200 pt-4 dark:border-white/10">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Total Persons
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                      {department.user_count ?? 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                No Departments Found
              </h3>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Create your first department using the form above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}