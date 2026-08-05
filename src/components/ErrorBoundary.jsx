import { Component } from "react";

/**
 * Error Boundary — catches any unhandled render-time exceptions in the
 * component tree and shows a clean fallback instead of a raw stack trace.
 *
 * Prevents stack traces, component names, and internal state from leaking
 * to the browser console/UI in production.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In production, send to an error monitoring service (e.g. Sentry).
    // Never log raw errors to the console in production.
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Something went wrong
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Please refresh the page. If the problem persists, contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
