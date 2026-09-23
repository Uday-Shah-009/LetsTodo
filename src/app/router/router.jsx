import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from "@tanstack/react-router"

import { userRoutes } from "./User.router"
import { adminRoutes } from "./Admin.router"
import { requireAuth } from "./requireAuth"

export const rootRoute = createRootRoute()

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(() => import("../../pages/Login")),
})

const changePasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/change-password",
  component: lazyRouteComponent(() => import("../../pages/ChangePassword")),
  beforeLoad: requireAuth
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  changePasswordRoute,
  userRoutes,
  adminRoutes
])

export const router = createRouter({
  routeTree,
})