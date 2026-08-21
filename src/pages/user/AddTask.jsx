import { useGetCategories } from "../../app/Queries/admin.query";
import { useGetUserDepartments } from "../../app/Queries/users.query";
import CreateTaskModal from "../../components/tasks/CreateTaskModal";

export default function AddTask() {
  const { data: categories } = useGetCategories();
  const { data: departments } = useGetUserDepartments();

  return <CreateTaskModal categories={categories} departments={departments} />;
}