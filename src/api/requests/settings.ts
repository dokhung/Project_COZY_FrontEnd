import apiClient from "@/api/Axios";
import type { UserSettingsPayload } from "@/types/api/settings";

export const getUserSettingsRequest = async () => {
    const res = await apiClient.get("/api/user/settings");
    return res.data as UserSettingsPayload;
};

export const updateUserSettingsRequest = async (payload: UserSettingsPayload) => {
    const res = await apiClient.patch("/api/user/settings", payload);
    return res.data as UserSettingsPayload;
};
