import { RouterProvider } from "@tanstack/react-router";
import { router } from "./app/router/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useThemeStore } from "./store/themeStore";

const queryClient = new QueryClient();

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