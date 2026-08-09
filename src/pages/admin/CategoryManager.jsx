import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import {
  useGetCategories,
  useCreateCategory,
  useDeleteCategory,
} from "../../app/Queries/admin.query";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function CategoryManager() {
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
    data: categories = [],
    isPending,
  } = useGetCategories();

  const createCategoryMutate = useCreateCategory();
  const deleteCategoryMutate = useDeleteCategory();

  const [deleteTarget, setDeleteTarget] = useState(null);

  const onSubmit = (data) => {
    createCategoryMutate.mutate(data, {
      onSuccess: (res) => {
        toast.success(`${res.name} category added`);
        reset();
      },
    });
  };

  const handleDeleteClick = (category) => {
    setDeleteTarget(category);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteCategoryMutate.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`${deleteTarget.name} category deleted`);
        setDeleteTarget(null);
      },
      onError: () => {
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 dark:bg-[#020B1D]">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Category Management
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Create and manage task categories.
          </p>
        </div>

        {/* Create Category Form */}
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
            Add Category
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Category Name
              </label>

              <input
                type="text"
                placeholder="Bug"
                {...register("name", {
                  required: "Category name is required",
                  minLength: {
                    value: 2,
                    message: "Category name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Category name cannot exceed 100 characters",
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
                disabled={createCategoryMutate.isPending}
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
                {createCategoryMutate.isPending
                  ? "Creating..."
                  : "Create Category"}
              </button>
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#07152F]">
          <div className="border-b border-slate-200 p-6 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Available Categories
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Categories currently available for tasks.
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                {categories.length} Categories
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
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
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
                        {category.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Category
                      </p>
                    </div>

                    <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                      Active
                    </span>
                  </div>

                  <div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(category)}
                      className="
                        flex items-center gap-2
                        rounded-lg px-3 py-1.5
                        text-sm font-medium
                        text-red-500
                        bg-red-50 dark:bg-red-500/10
                        hover:bg-red-100 dark:hover:bg-red-500/20
                        transition
                      "
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                No Categories Found
              </h3>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Create your first category using the form above.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isPending={deleteCategoryMutate.isPending}
      />
    </div>
  );
}
