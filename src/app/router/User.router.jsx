import React from "react"
import { createRoute, lazyRouteComponent } from "@tanstack/react-router"
import UserLayout from "../../layout/UserLayout"
import { rootRoute } from "./router"
import { requireAuth } from "./requireAuth"

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
  component: lazyRouteComponent(() => import("../../pages/user/Dashboard")),
  beforeLoad: requireAuth
})

export const timelineRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/timeline",
  component: lazyRouteComponent(() => import("../../pages/user/Timeline")),
  beforeLoad: requireAuth
})

export const tasksRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/tasks",
  component: lazyRouteComponent(() => import("../../pages/user/Tasks")),
  beforeLoad: requireAuth
})

export const taskDetailsRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/tasks/$taskId",
  component: lazyRouteComponent(() => import("../../pages/user/TaskDetails")),
  beforeLoad: requireAuth
})

export const userReviseTaskRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/tasks/$taskId/revise",
  component: lazyRouteComponent(() => import("../../pages/ReviseTaskPage")),
  beforeLoad: requireAuth
})

export const addTaskRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/add-task",
  component: lazyRouteComponent(() => import("../../pages/user/AddTask")),
  beforeLoad: requireAuth
})

export const settingsRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: "/settings",
  component: lazyRouteComponent(() => import("../../pages/user/Settings")),
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