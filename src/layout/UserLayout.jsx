import { useState } from "react"
import { Outlet } from "@tanstack/react-router"
import UserSidebar from "../components/Sidebar/UserSidebar"
import { useThemeStore } from "../store/themeStore"

export default function UserLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, toggleTheme } = useThemeStore()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">

      {/* Sidebar */}
      <UserSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Right Side */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Navbar */}
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4">

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <h1 className="font-semibold">
            Task Manager
          </h1>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 text-sm"
          >
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}
          </button>

        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  )
}