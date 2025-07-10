import apiClient from "@/api/Axios";

export const registerRequest = (formData: FormData) => {
    return apiClient.post('/api/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};