import React from "react"
import ReactDOM from "react-dom/client"
import "./store/themeStore"
import App from "./App.jsx"
import "./index.css"
import { ErrorBoundary } from "./components/ErrorBoundary.jsx"

const preventNumberInputWheel = (event) => {
  const target = event.target
  if (target instanceof HTMLElement && target.closest('input[type="number"]')) {
    event.preventDefault()
  }
}

document.addEventListener("wheel", preventNumberInputWheel, {
  passive: false,
  capture: true,
})



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
