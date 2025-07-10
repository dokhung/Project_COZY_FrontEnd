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

// 유저 정보 업데이트
export const updateUserInfoRequest = async (formData: FormData) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("토큰이 없습니다.");

    try {
        const response = await apiClient.post('/api/auth/update-info', formData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error("❌ 정보 수정 실패:", error.message);
        alert("정보 수정 실패");
        return undefined;
    }
};