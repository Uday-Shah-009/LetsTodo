import { Link } from "@tanstack/react-router";
import EmptyState from "../ui/EmptyState";
import {Settings2, Trash2 } from "lucide-react";

export default function UsersTable({ users = [], onRemove }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <tr className="text-left font-semibold text-gray-700 dark:text-gray-300">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center">
                  <EmptyState title="No users found" description="No registered users exist in the system yet." />
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </td>

                  <td className="p-4 text-gray-500 dark:text-gray-400">
                    {user.email}
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                      String(user.role).toLowerCase() === "admin"
                        ? "bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800/50"
                        : "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/50"
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-3">
                    <Link
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition"
                      to="/admin/users/$id/departments"
                      params={{ id: user.id.toString() }}
                    >
                      <Settings2 className="w-4 h-4" />
                      Manage
                    </Link>

                    {String(user.role).toLowerCase() !== "admin" && (
                      <button
                        type="button"
                        onClick={() => onRemove(user.id)}
                        className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
