import React from "react";
import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { rootRoute } from "./router";

import AdminLayout from "../../layout/AdminLayout";
import { requireAuth } from "./requireAuth";
import { checkUserRole } from "./isAdmin";

/* Admin Parent Route */

export const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLayout,
});

/* Dashboard */

export const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/dashboard",
  component: lazyRouteComponent(() => import("../../pages/admin/AdminDashboard")),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

/* Tasks */

export const adminTasksRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/tasks",
  component: lazyRouteComponent(() => import("../../pages/admin/AdminTasks")),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminAddTasksRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/add-task",
  component: lazyRouteComponent(() => import("../../pages/admin/AdminAddTasks")),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

/* Task Details */

export const adminTaskDetailsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/tasks/$taskId",
  component: lazyRouteComponent(() => import("../../pages/admin/AdminTasksDetails")),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminTaskReviseRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/tasks/$taskId/revise",
  component: lazyRouteComponent(() => import("../../pages/ReviseTaskPage")),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

/* Timeline */

export const adminTimelineRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/timeline",
  component: lazyRouteComponent(() => import("../../pages/admin/AdminTimeline")),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

/* Users */

export const adminUsersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/users",
  component: lazyRouteComponent(() => import("../../pages/admin/Users")),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

/* Settings */

export const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/settings",
  component: lazyRouteComponent(() => import("../../pages/admin/Settings")),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminTaskRequests = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/task-requests",
  component: lazyRouteComponent(() => import("../../pages/admin/TaskCreationRequests")),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminDepartmentManager = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/departments",
  component: lazyRouteComponent(() => import("../../pages/admin/DepartmentManager")),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminUserDepartmentManager = createRoute({
  getParentRoute: () => adminUsersRoute,
  path: "$id/departments",
  component: lazyRouteComponent(() => import("../../components/users/ManageUserDepartments")),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminCategoryManager = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/categories",
  component: lazyRouteComponent(() => import("../../pages/admin/CategoryManager")),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

/* Export Admin Routes */

export const adminRoutes = adminLayoutRoute.addChildren([
  adminDashboardRoute,
  adminTasksRoute,
  adminTaskDetailsRoute,
  adminTaskReviseRoute,
  adminAddTasksRoute,
  adminTimelineRoute,
  adminUsersRoute.addChildren([adminUserDepartmentManager]),
  adminSettingsRoute,
  adminTaskRequests,
  adminDepartmentManager,
  adminCategoryManager,
]);

