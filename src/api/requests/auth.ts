import apiClient from "@/api/Axios";

export const registerRequest = (formData: FormData) => {
    return apiClient.post('/api/user/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};