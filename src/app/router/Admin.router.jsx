import React, { lazy, Suspense } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./router";

import AdminLayout from "../../layout/AdminLayout";
import { requireAuth } from "./requireAuth";
import { checkUserRole } from "./isAdmin";

/* Lazy-loaded Admin Pages */

const AdminDashboard = lazy(() => import("../../pages/admin/AdminDashboard"));
const AdminTasks = lazy(() => import("../../pages/admin/AdminTasks"));
const AdminTasksDetails = lazy(() => import("../../pages/admin/AdminTasksDetails"));
const AdminTimeline = lazy(() => import("../../pages/admin/AdminTimeline"));
const Users = lazy(() => import("../../pages/admin/Users"));
const Settings = lazy(() => import("../../pages/admin/Settings"));
const AdminAddTask = lazy(() => import("../../pages/admin/AdminAddTasks"));
const TaskRequestsPage = lazy(() => import("../../pages/admin/TaskCreationRequests"));
const AddDepartmentPage = lazy(() => import("../../pages/admin/DepartmentManager"));
import ManageUserDepartment from "../../components/users/ManageUserDepartments"
const CategoryManager = lazy(() => import("../../pages/admin/CategoryManager"));
const ReviseTaskPage = lazy(() => import("../../pages/ReviseTaskPage"));

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
);

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
  component: withSuspense(AdminDashboard),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

/* Tasks */

export const adminTasksRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/tasks",
  component: withSuspense(AdminTasks),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminAddTasksRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/add-task",
  component: withSuspense(AdminAddTask),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});
/* Task Details */

export const adminTaskDetailsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/tasks/$taskId",
  component: withSuspense(AdminTasksDetails),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminTaskReviseRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/tasks/$taskId/revise",
  component: withSuspense(ReviseTaskPage),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

/* Timeline */

export const adminTimelineRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/timeline",
  component: withSuspense(AdminTimeline),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

/* Users */

export const adminUsersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/users",
  component: withSuspense(Users),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

/* Settings */

export const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/settings",
  component: withSuspense(Settings),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminTaskRequests = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/task-requests",
  component: withSuspense(TaskRequestsPage),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminDepartmentManager = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/departments",
  component: withSuspense(AddDepartmentPage),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminUserDepartmentManager = createRoute({
  getParentRoute: () => adminUsersRoute,
  path: "$id/departments",
  component: withSuspense(ManageUserDepartment),
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminCategoryManager = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/categories",
  component: withSuspense(CategoryManager),
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

