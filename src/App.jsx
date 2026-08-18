import { RouterProvider } from "@tanstack/react-router";
import { router } from "./app/router/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/queryClient";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useThemeStore } from "./store/themeStore";

function App() {
  const { theme } = useThemeStore();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer theme={theme === "dark" ? "dark" : "light"} />
    </QueryClientProvider>
  );
}

export default App;