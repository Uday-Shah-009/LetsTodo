import { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useGetDepartments } from "../../app/Queries/admin.query";
import { adminUserDepartmentManager } from "../../app/router/Admin.router";
import {
  useAssignDepartments,
  useGetAllUsers,
} from "../../app/Queries/users.query";
import { toast } from "react-toastify";

export default function ManageUserDepartment() {
  const navigate = useNavigate();
  const { id } = adminUserDepartmentManager.useParams();
  const { data: users, isLoading: usersLoading } = useGetAllUsers();
  const { data: departmentsData, isLoading: departmentsLoading } =
    useGetDepartments();
  const departments = departmentsData || [];
  const user = users?.find((u) => u.id === Number(id));
  const [departmentIds, setDepartmentIds] = useState([]);
  const [prevUserId, setPrevUserId] = useState(null);

  if (user && user.id !== prevUserId) {
    setPrevUserId(user.id);
    setDepartmentIds(
      user.departments.map((dept) =>
        typeof dept === "object" ? dept.id : dept,
      ),
    );
  }

  const AssignDepartmentMutate = useAssignDepartments();
  const isSaving = AssignDepartmentMutate.isPending;


  const toggleDepartment = (departmentId) => {
    setDepartmentIds((prev) =>
      prev.includes(departmentId)
        ? prev.filter((id) => id !== departmentId)
        : [...prev, departmentId],
    );
  };

  const handleSubmit = () => {
    const payload = {
      user_id: id,
      department_ids: departmentIds,
    };

    AssignDepartmentMutate.mutate(payload, {
      onSuccess: (res) =>
        toast.success(res?.data?.message),
    });
  };

  const isLoading = usersLoading || departmentsLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <button
            onClick={() => navigate({ to: "/admin/users" })}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-4"
          >
            <ArrowLeft size={18} />
            Back to Users
          </button>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage User Departments
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Assign or remove departments for this user
          </p>
        </div>

        {/* User Info */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Information
          </h2>

          {usersLoading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading user...</p>
          ) : (
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  User ID
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {id}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user?.name ?? "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user?.email ?? "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                <p className="text-gray-900 dark:text-white font-medium capitalize">
                  {user?.role ?? "-"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Departments */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Departments
            </h2>

            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm">
              {departmentIds.length} Selected
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              Loading departments...
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              No departments found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((department) => {
                const isSelected = departmentIds.includes(department.id);

                return (
                  <button
                    key={department.id}
                    type="button"
                    onClick={() => toggleDepartment(department.id)}
                    className={`relative p-5 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                        : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 hover:border-gray-300 dark:hover:border-gray-700"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle
                        size={20}
                        className="absolute top-4 right-4 text-blue-500 dark:text-blue-400"
                      />
                    )}

                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {department.name}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Department ID: {department.id}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate({ to: "/admin/users" })}
            className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-blue-600"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
