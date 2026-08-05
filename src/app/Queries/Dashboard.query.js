import { useQuery } from "@tanstack/react-query";
import { DashBoardData } from "../apis/Dashboard.api";

export const useGetDashboard = () => {
    return useQuery({
        queryKey: ["DashboardData"],
        queryFn: DashBoardData
    })
}