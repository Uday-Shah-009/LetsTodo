import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "../../store/authStore"

export default function UserSidebar({ sidebarOpen, setSidebarOpen }) {

  const location = useLocation()
  const navigate = useNavigate()
    const logoutHandle = () => {
      const { logout} = useAuthStore.getState()
      logout();
      navigate({to: "/"})
    }

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Tasks", path: "/tasks" },
    { name: "Add Task", path: "/add-task" },
    { name: "Timeline", path: "/timeline" },
    { name: "Settings", path: "/settings" },
  ]

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static z-40 w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >

        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold">LETS TODO</h2>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">

          {navItems.map((item) => {

            const active = location.pathname === item.path

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`block px-4 py-2 rounded-lg
                ${
                  active
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {item.name}
              </Link>
            )

          })}

        </nav>
          <div onClick={() => logoutHandle()} className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button className="w-full px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition">
              Logout
            </button>
          </div>

      </aside>
    </>
  )
}