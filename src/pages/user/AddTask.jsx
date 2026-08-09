import { useGetCategories } from "../../app/Queries/admin.query";
import CreateTaskModal from "../../components/tasks/CreateTaskModal";

export default function AddTask() {
  const { data: categories } = useGetCategories();
  return <CreateTaskModal categories={categories} />;
}