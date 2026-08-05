import { useGetAllUsers } from "../../app/Queries/users.query";
import CreateTaskModal from "../../components/tasks/CreateTaskModal"

export default function AdminAddTask() {

  const { data } = useGetAllUsers();

  return (
    <CreateTaskModal isAdmin={true} users={data} />
  )
}