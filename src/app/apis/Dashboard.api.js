import axiosInstance from "./axiosInterceptor";

export const DashBoardData = async() => {
    const res = await axiosInstance.get("dashboard")
    return res.data
}