import { Link } from "@tanstack/react-router";

export default function UsersTable({ users, onRemove }) {

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-200 dark:border-gray-800">
          <tr className="text-left">
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Tasks</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <td className="p-4">{user.name}</td>

              <td className="p-4">{user.email}</td>

              <td className="p-4">{user.role}</td>

              <td className="p-4 space-x-3">
                {String(user.role).toLowerCase() !== "admin" && (
                  <button
                    onClick={() => onRemove(user.id)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
                <Link
                  className="text-blue-500 hover:underline"
                  to="/admin/users/$id/departments"
                  params={{ id: user.id.toString() }}
                >
                  Manage
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
