import apiClient from "@/api/Axios";

export type UserSettingsPayload = {
    notificationsEmail?: boolean;
    notificationsPush?: boolean;
    digestWeekly?: boolean;
    profileVisible?: boolean;
    locale?: string;
};

export const getUserSettingsRequest = async () => {
    const res = await apiClient.get("/api/user/settings");
    return res.data as UserSettingsPayload;
};

export const updateUserSettingsRequest = async (payload: UserSettingsPayload) => {
    const res = await apiClient.patch("/api/user/settings", payload);
    return res.data as UserSettingsPayload;
};
