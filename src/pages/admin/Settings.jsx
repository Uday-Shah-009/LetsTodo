import { Link } from "@tanstack/react-router";
import ThemeToggle from "../../components/ThemeToggle";
import { KeyRound, SunMoon } from "lucide-react";

export default function Settings() {

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Account & System Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your administrator profile, security parameters, and theme preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
        {/* Security & Preferences */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-6">
          {/* Security */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Security</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manage login credentials</p>
              </div>
            </div>

            <Link to="/change-password" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition shadow-xs">
              <KeyRound className="w-4 h-4" />
              Change Password
            </Link>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800" />

          {/* Theme */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <SunMoon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Appearance</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Toggle light or dark theme</p>
              </div>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
