import apiClient from "@/api/Axios";
import type { AdminUser } from "@/types/api/admin";

export const getAdminUsersRequest = async (): Promise<AdminUser[]> => {
    const res = await apiClient.get<AdminUser[]>("/api/admin/users");
    return res.data;
};

export const updateAdminUserBlockRequest = async (
    userId: string,
    blocked: boolean
): Promise<AdminUser> => {
    const res = await apiClient.patch<AdminUser>(`/api/admin/users/${userId}/block`, {
        blocked,
    });
    return res.data;
};
