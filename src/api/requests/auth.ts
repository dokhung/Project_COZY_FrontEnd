import apiClient from "@/api/Axios";

export const registerRequest = (data: {
    email: string;
    password: string;
    confirmPassword: string;
    nickname: string;
}) => {
    return apiClient.post("/api/user/register", data, {
        headers: { "Content-Type": "application/json" },
    });
};