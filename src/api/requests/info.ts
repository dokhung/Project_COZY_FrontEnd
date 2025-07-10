// 유저 정보 조회
import apiClient from "@/api/Axios";

export const getCurrentUserRequest = async (): Promise<any | undefined> => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert("토큰이 없습니다.");
        return undefined;
    }

    try {
        const response = await apiClient.get('/api/auth/current-user', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error("❌ 유저 정보 조회 실패:", error.message);
        return undefined;
    }
};

export const updateUserInfoRequest = async (
    nickname: string,
    statusMessage: string,
    profileImage?: File
) => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("❌ 토큰이 없습니다.");

    const formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("statusMessage", statusMessage);
    if (profileImage) {
        formData.append("profileImage", profileImage);
    }

    const response = await apiClient.post("/api/auth/update-info", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};
