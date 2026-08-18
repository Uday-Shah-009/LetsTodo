import React, { lazy, Suspense } from "react"
import { createRoute } from "@tanstack/react-router"
import UserLayout from "../../layout/UserLayout"
import { rootRoute } from "./router"
import { requireAuth } from "./requireAuth"

/* Lazy-loaded User Pages */

const Dashboard = lazy(() => import("../../pages/user/Dashboard"))
const MyTasks = lazy(() => import("../../pages/user/Tasks"))
const AddTask = lazy(() => import("../../pages/user/AddTask"))
const Settings = lazy(() => import("../../pages/user/Settings"))
const Timeline = lazy(() => import("../../pages/user/Timeline"))
const TaskDetails = lazy(() => import("../../pages/user/TaskDetails"))
const ReviseTaskPage = lazy(() => import("../../pages/ReviseTaskPage"))

/* Suspense Wrapper */

const withSuspense = (Component) => (props) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center h-full w-full min-h-[200px]">
        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    }
  >
    {React.createElement(Component, props)}
  </Suspense>
)

/* User Layout */

export const userLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "user-layout",
  component: UserLayout,
  beforeLoad: requireAuth
})

/* User Pages */

export const dashboardRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/dashboard",
  component: withSuspense(Dashboard),
  beforeLoad: requireAuth
})

export const timelineRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/timeline",
  component: withSuspense(Timeline),
  beforeLoad: requireAuth
})

export const tasksRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/tasks",
  component: withSuspense(MyTasks),
  beforeLoad: requireAuth
})

export const taskDetailsRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/tasks/$taskId",
  component: withSuspense(TaskDetails),
  beforeLoad: requireAuth
})

export const userReviseTaskRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/tasks/$taskId/revise",
  component: withSuspense(ReviseTaskPage),
  beforeLoad: requireAuth
})

export const addTaskRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/add-task",
  component: withSuspense(AddTask),
  beforeLoad: requireAuth
})

export const settingsRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/settings",
  component: withSuspense(Settings),
  beforeLoad: requireAuth
})

/* Export User Route Tree */

export const userRoutes = userLayoutRoute.addChildren([
  dashboardRoute,
  tasksRoute,
  taskDetailsRoute,
  userReviseTaskRoute,
  addTaskRoute,
  settingsRoute,
  timelineRoute,
])