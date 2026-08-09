import { useState } from "react";
import UsersTable from "../../components/users/UsersTable";
import AddUserModal from "../../components/users/AddUserModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorState from "../../components/ui/ErrorState";
import { useGetAllUsers, useDeleteUsers } from "../../app/Queries/users.query";
import { toast } from "react-toastify";
import { Outlet } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";

export default function Users() {
  const [showModal, setShowModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { data, isPending, error, refetch } = useGetAllUsers();
  const deleteUserMutation = useDeleteUsers();

  const users = data || [];

  const handleRemoveClick = (id) => {
    setSelectedUserId(id);
    setRemoveModal(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedUserId) return;
    deleteUserMutation.mutate(selectedUserId, {
      onSuccess: (res) => {
        toast.success(res.message || "User removed successfully");
        setRemoveModal(false);
        setSelectedUserId(null);
      },
      onError: () => {
        toast.error("Failed to delete user");
        setRemoveModal(false);
        setSelectedUserId(null);
      },
    });
  };

  if (isPending) return <LoadingSpinner message="Loading users..." fullPage />;
  if (error) return <ErrorState title="Failed to load users" message="Unable to fetch user list." onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Users</h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage system users and access permissions
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <UsersTable users={users} onRemove={handleRemoveClick} />

      {showModal && <AddUserModal closeModal={() => setShowModal(false)} />}

      <ConfirmationModal
        isOpen={removeModal}
        onClose={() => {
          setRemoveModal(false);
          setSelectedUserId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Remove User"
        message="Are you sure you want to remove this user? This action cannot be undone."
        confirmText="Remove User"
        cancelText="Cancel"
        variant="danger"
        isPending={deleteUserMutation.isPending}
      />
      <Outlet />
    </div>
  );
}