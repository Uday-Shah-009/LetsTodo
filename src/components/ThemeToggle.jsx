import { useThemeStore } from "../store/themeStore"

export default function ThemeToggle() {

  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700
      text-sm bg-white dark:bg-gray-800"
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  )
}