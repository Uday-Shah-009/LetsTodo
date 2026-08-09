import { useGetCategories, useGetDepartments } from "../../app/Queries/admin.query";
import { useGetAllUsers } from "../../app/Queries/users.query";
import CreateTaskModal from "../../components/tasks/CreateTaskModal";

export default function AdminAddTask() {
  const { data } = useGetAllUsers();
  const { data: departments } = useGetDepartments();
  const { data: categories } = useGetCategories();

  return (
    <CreateTaskModal
      isAdmin={true}
      users={data}
      departments={departments}
      categories={categories}
    />
  );
}