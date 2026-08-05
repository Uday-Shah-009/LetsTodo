import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./router";

import AdminLayout from "../../layout/AdminLayout";

import AdminDashboard from "../../pages/admin/AdminDashboard";
import AdminTasks from "../../pages/admin/AdminTasks";
import AdminTasksDetails from "../../pages/admin/AdminTasksDetails";
import AdminTimeline from "../../pages/admin/AdminTimeline";
import Users from "../../pages/admin/Users";
import Settings from "../../pages/admin/Settings";
import AdminAddTask from "../../pages/admin/AdminAddTasks";
import { requireAuth } from "./requireAuth";
import { checkUserRole } from "./isAdmin";
import TaskRequestsPage from "../../pages/admin/TaskCreationRequests";
import AddDepartmentPage from "../../pages/admin/DepartmentManager";
import ManageUserDepartment from "../../components/users/ManageUserDepartments";

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
  component: AdminDashboard,
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

/* Tasks */

export const adminTasksRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/tasks",
  component: AdminTasks,
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminAddTasksRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/add-task",
  component: AdminAddTask,
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});
/* Task Details */

export const adminTaskDetailsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/tasks/$taskId",
  component: AdminTasksDetails,
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

/* Timeline */

export const adminTimelineRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/timeline",
  component: AdminTimeline,
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

/* Users */

export const adminUsersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/users",
  component: Users,
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

/* Settings */

export const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/settings",
  component: Settings,
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminTaskRequests = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/task-requests",
  component: TaskRequestsPage,
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminDepartmentManager = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/departments",
  component: AddDepartmentPage,
  beforeLoad: () => {
    requireAuth();
    checkUserRole();
  },
});

export const adminUserDepartmentManager = createRoute({
  getParentRoute: () => adminUsersRoute,
  path: "$id/departments",
  component: ManageUserDepartment,
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
  adminAddTasksRoute,
  adminTimelineRoute,
  adminUsersRoute.addChildren([adminUserDepartmentManager]),
  adminSettingsRoute,
  adminTaskRequests,
  adminDepartmentManager,
]);
