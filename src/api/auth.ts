import apiClient from './Axios';
import { AxiosError } from 'axios';


export const registerRequest = (formData: FormData) => {
    return apiClient.post('/api/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};


export const loginRequest = async (email: string, password: string) => {
    try {
        const response = await apiClient.post('/api/auth/login', { email, password });
        const { token, user } = response.data;

        console.log("✅ 로그인 성공 - 토큰 저장: ", token);
        localStorage.setItem('accessToken', token);

        return { user, token };
    } catch (error: unknown) {
        handleApiError(error, "로그인 실패");
    }
};


export const verifyPasswordRequest = async (password: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("❌ 인증 토큰이 없습니다.");

    try {
        const response = await apiClient.post(
            '/api/auth/verify-password',
            { password },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("✅ 비밀번호 확인 응답:", response.data);
        return response.data;
    } catch (error: unknown) {
        return handleApiError(error, "비밀번호 검증 실패");
    }
};

// ✅ 현재 로그인한 유저 정보 요청
export const getCurrentUserRequest = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("❌ 인증 토큰이 없습니다.");

    try {
        const response = await apiClient.get('/api/auth/current-user', {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error: unknown) {
        return handleApiError(error, "현재 유저 정보 가져오기 실패");
    }
};


export const updateUserInfoRequest = async (formData: FormData) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("❌ JWT 토큰이 없습니다. 로그인하세요.");

    try {
        const response = await apiClient.post('/api/auth/update-info', formData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ 유저 정보 업데이트 성공:", response.data);
        return response.data; // 🔥 수정된 프로필 정보를 반환
    } catch (error: any) {
        console.error("❌ 유저 정보 업데이트 실패:", error.response?.data || error.message);
        throw new Error("정보 수정 실패");
    }
};




const handleApiError = (error: unknown, customMessage: string) => {
    if (error instanceof AxiosError) {
        console.error(`❌ ${customMessage}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.error || customMessage);
    }

    if (error instanceof Error) {
        console.error(`❌ ${customMessage}:`, error.message);
        throw new Error(error.message);
    }

    console.error(`❌ ${customMessage}: 알 수 없는 오류 발생`);
    throw new Error(customMessage);
};
