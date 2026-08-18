import { useGetAllTasks } from "../../app/Queries/Tasks.query";
import { useGetDepartments, useGetCategories } from "../../app/Queries/admin.query";
import TaskTable from "../../components/tasks/TaskTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorState from "../../components/ui/ErrorState";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function AdminTasks() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: departments = [] } = useGetDepartments();
  const { data: categories = [] } = useGetCategories();

  const { data, isPending, error, refetch } = useGetAllTasks({
    status: selectedStatus,
    department_id: selectedDepartment,
    category_id: selectedCategory,
    page,
    pageSize,
  });

  if (isPending) return <LoadingSpinner message="Loading system tasks..." fullPage />;
  if (error) return <ErrorState title="Failed to load tasks" message="Unable to fetch tasks at this time." onRetry={refetch} />;
 
  const tasks = data?.items ?? [];

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const handleDepartmentChange = (departmentId) => {
    setSelectedDepartment(departmentId);
    setPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Tasks</h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage system tasks
          </p>
        </div>

        <button
          onClick={() => {
            navigate({ to: "/admin/add-task" });
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          + Create Task
        </button>
      </div>

      <TaskTable
        tasks={tasks}
        basePath="/admin/tasks"
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        departments={departments}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={handleDepartmentChange}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        page={page}
        totalPages={data?.total_pages ?? 1}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
