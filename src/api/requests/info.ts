import apiClient from "@/api/Axios";

export type CurrentUserInfo = {
    userId: string;
    email: string;
    nickname: string;
    profileImageUrl: string | null;
    statusMessage: string | null;
    role: string;
    themeMode: string | null;
    notificationsEmail: boolean;
    notificationsPush: boolean;
    digestWeekly: boolean;
    profileVisible: boolean;
    locale: string | null;
};

export const getCurrentUserRequest = async (): Promise<CurrentUserInfo | undefined> => {
    try {
        const response = await apiClient.get('/api/user/check-current');
        return response.data;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("유저 정보 조회 실패:", message);
        return undefined;
    }
};

export const updateUserInfoRequest = async (
    nickname: string,
    statusMessage: string,
    profileImage?: File
) => {
    const formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("statusMessage", statusMessage);
    if (profileImage) {
        formData.append("profileImage", profileImage);
    }

    const response = await apiClient.post("/api/user/update", formData);
    return response.data;
};
