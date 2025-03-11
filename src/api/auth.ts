import apiClient from './Axios';
import { AxiosError } from 'axios';

// ✅ 회원가입 요청 함수
export const registerRequest = (formData: FormData) => {
    return apiClient.post('/api/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// ✅ 로그인 요청 함수
export const loginRequest = (email: string, password: string) => {
    return apiClient.post('/api/auth/login', { email, password });
};

// 🔹 비밀번호 검증 API 호출
export const verifyPasswordRequest = async (password: string) => {
    try {
        const response = await apiClient.post('/api/auth/verify-password', { password });
        return response.data; // { valid: true }
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 400) {
                throw new Error("비밀번호가 일치하지 않습니다.");
            } else if (error.response?.status === 401) {
                throw new Error("로그인이 필요합니다.");
            }
        }
        throw new Error("서버 오류가 발생했습니다.");
    }
};

// ✅ 사용자 정보 업데이트 요청 함수
export const updateUserInfoRequest = async (data: { nickname: string; statusMessage: string }) => {
    try {
        const response = await apiClient.post('/api/auth/update-info', data);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "정보 수정에 실패했습니다.");
        }
        throw new Error("서버 오류가 발생했습니다.");
    }
};
