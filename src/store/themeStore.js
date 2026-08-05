import { create } from "zustand"
import { persist } from "zustand/middleware"

const THEME_STORAGE_KEY = "theme-storage"

const applyThemeClass = (theme) => {
  if (typeof document === "undefined") {
    return
  }

  document.documentElement.classList.remove("light", "dark")
  document.documentElement.classList.add(theme)
}

const getStoredTheme = () => {
  if (typeof window === "undefined") {
    return "light"
  }

  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)

    if (!storedTheme) {
      return "light"
    }

    const parsedTheme = JSON.parse(storedTheme)
    return parsedTheme?.state?.theme || "light"
  } catch {
    return "light"
  }
}

applyThemeClass(getStoredTheme())

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: getStoredTheme(),

      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light"

        applyThemeClass(newTheme)

        set({ theme: newTheme })
      },

      setTheme: (theme) => {
        applyThemeClass(theme)

        set({ theme })
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyThemeClass(state.theme)
        }
      },
    }
  )
)