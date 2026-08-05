import { RouterProvider } from "@tanstack/react-router";
import { router } from "./app/router/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";



function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}/> 
    <ToastContainer />
    </QueryClientProvider>  
  )
}

export default App;