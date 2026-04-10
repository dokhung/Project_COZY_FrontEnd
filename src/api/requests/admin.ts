import apiClient from "@/api/Axios";

export type AdminUser = {
    userId: string;
    email: string;
    nickname: string;
    role: "USER" | "OPERATOR" | string;
    blocked: boolean;
    lastLoginAt: string | null;
};

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
