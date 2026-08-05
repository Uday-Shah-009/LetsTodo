import { createRoute } from "@tanstack/react-router"
import Dashboard from "../../pages/user/Dashboard"
import MyTasks from "../../pages/user/Tasks"
import AddTask from "../../pages/user/AddTask"
import Settings from "../../pages/user/Settings"
import Timeline from "../../pages/user/Timeline"
import TaskDetails from "../../pages/user/TaskDetails"
import UserLayout from "../../layout/UserLayout"
import { rootRoute } from "./router"
import { requireAuth } from "./requireAuth"

/* User Layout */

export const userLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "user-layout",
  component: UserLayout,
})

/* User Pages */

export const dashboardRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/dashboard",
  component: Dashboard,
  beforeLoad: requireAuth
})

export const timelineRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/timeline",
  component: Timeline,
  beforeLoad: requireAuth
})

export const tasksRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/tasks",
  component: MyTasks,
  beforeLoad: requireAuth
})

export const taskDetailsRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/tasks/$taskId",
  component: TaskDetails,
  beforeLoad: requireAuth
})

export const addTaskRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/add-task",
  component: AddTask,
  beforeLoad: requireAuth
})

export const settingsRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/settings",
  component: Settings,
  beforeLoad: requireAuth
})

/* Export User Route Tree */

export const userRoutes = userLayoutRoute.addChildren([
  dashboardRoute,
  tasksRoute,
  taskDetailsRoute,
  addTaskRoute,
  settingsRoute,
  timelineRoute,
])