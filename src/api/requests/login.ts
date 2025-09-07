import apiClient from "@/api/Axios";
import {useUserStore} from "@/store/userStore";

export const loginRequest = async (
    email: string,
    password: string
): Promise<{ accessToken: string; refreshToken: string } | undefined> => {
    try {
        const response = await apiClient.post('/api/auth/login', { email, password });
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return { accessToken, refreshToken };
    } catch (error: any) {
        return undefined;
    }
};

// 비밀번호 검증
export const verifyPasswordRequest = async (password: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("인증 토큰이 없습니다.");

    try {
        const response = await apiClient.post(
            '/api/auth/verify-password',
            { password },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("비밀번호 검증 실패:", error.message);
        alert("비밀번호 검증 실패");
        return false;
    }
};

// 로그아웃
export const logoutRequest = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        useUserStore.getState().logout();
        return;
    }

    try {
        await apiClient.post('/api/auth/logout', null, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error: any) {
        console.error("문제발생")
    } finally {
        useUserStore.getState().logout();
    }
};