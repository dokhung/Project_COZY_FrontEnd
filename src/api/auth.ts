import apiClient from './Axios';

export const loginRequest = (email: string, password: string) => {
    return apiClient.post('/api/auth/login', { email, password });
};


// 회원가입 요청
export const registerRequest = (email: string, password: string, nickname: string) => {
    return apiClient.post('/api/auth/register', { email, password, nickname });
};
