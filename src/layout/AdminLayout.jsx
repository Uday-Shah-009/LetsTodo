import { useState } from "react"
import { Outlet, useLocation } from "@tanstack/react-router"
import AdminSidebar from "../components/Sidebar/AdminSidebar"
import { useAuthStore } from "../store/authStore"
import { useUser } from "../utils/token"
import { Menu, User, ChevronRight } from "lucide-react"

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const user = useUser()
  const username = useAuthStore((s) => s.username)

  const displayUsername = username || user?.name || "Admin"

  const getBreadcrumbTitle = (pathname) => {
    if (pathname.includes("/admin/tasks/")) return "Task Details"
    if (pathname.includes("/admin/task-requests")) return "Task Requests"
    if (pathname.includes("/admin/departments")) return "Departments"
    if (pathname.includes("/admin/categories")) return "Categories"
    if (pathname.includes("/admin/timeline")) return "Timeline"
    if (pathname.includes("/admin/users")) return "Users"
    if (pathname.includes("/admin/add-task")) return "Create Task"
    if (pathname.includes("/admin/settings")) return "Settings"
    return "Admin Dashboard"
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Right Side */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4 md:px-6 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm font-medium">
              <span className="text-gray-400 dark:text-gray-500">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-900 dark:text-white font-semibold">
                {getBreadcrumbTitle(location.pathname)}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* User Profile Chip */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300">
              <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-[10px]">
                {displayUsername[0]?.toUpperCase() || <User className="w-3 h-3" />}
              </div>
              <span>{displayUsername}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}