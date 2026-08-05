import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router"

import Login from "../../pages/Login"

import { userRoutes } from "./User.router"
import { adminRoutes } from "./Admin.router"
import ChangePasswordUI from "../../pages/ChangePassword"
import { requireAuth } from "./requireAuth"

export const rootRoute = createRootRoute()

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Login,
})

const changePasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/change-password",
  component: ChangePasswordUI,
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