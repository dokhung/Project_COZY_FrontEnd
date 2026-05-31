import apiClient from "@/api/Axios";
import type { FindEmailResponse, LoginResponse, ResetPasswordResponse } from "@/types/api/auth";

export const loginRequest = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>("/api/auth/login", {
        email,
        password,
    });
    return res.data;
};

export const findEmailRequest = async (nickname: string) => {
    const res = await apiClient.post<FindEmailResponse>("/api/user/find-email", {
        nickname,
    });
    return res.data;
};

export const resetPasswordRequest = async (
    email: string,
    nickname: string,
    newPassword: string,
    confirmPassword: string
) => {
    const res = await apiClient.post<ResetPasswordResponse>("/api/user/reset-password", {
        email,
        nickname,
        newPassword,
        confirmPassword,
    });
    return res.data;
};

export const verifyPasswordRequest = async (password: string) => {
    try {
        const response = await apiClient.post(
            "/api/user/verify-password",
            { password },
        );
        return response.data;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("비밀번호 검증 실패:", message);
        return false;
    }
};
