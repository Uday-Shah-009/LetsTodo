import { useState } from "react";
import UsersTable from "../../components/users/UsersTable";
import AddUserModal from "../../components/users/AddUserModal";
import { ConfirmModal } from "../../components/users/RemoveUserModal";
import { useGetAllUsers, useDeleteUsers } from "../../app/Queries/users.query";
import { toast } from "react-toastify";
import { Outlet } from "@tanstack/react-router";

export default function Users() {
  const [showModal, setShowModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { data, isPending, error } = useGetAllUsers();
  const deleteUserMutation = useDeleteUsers();

  const users = data;

  const handleRemoveClick = (id) => {
    setSelectedUserId(id);
    setRemoveModal(true);
  };

  const handleConfirmDelete = () => {
    deleteUserMutation.mutate(selectedUserId, {
      onSuccess: (res) => {
        toast.success(res.message);
        setRemoveModal(false);
      },
      onError: () => {
        toast.error("Failed to delete user");
        setRemoveModal(false);
      },
    });
  };

  if (isPending) return <div>Loading Users...</div>;
  if (error) return <div>Something went wrong</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage system users
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          + Add User
        </button>
      </div>

      <UsersTable users={users} onRemove={handleRemoveClick} />

      {showModal && <AddUserModal closeModal={() => setShowModal(false)} />}

      <ConfirmModal
        isOpen={removeModal}
        onClose={() => setRemoveModal(false)}
        onConfirm={handleConfirmDelete}
      />
      <Outlet />
    </div>
  );
}