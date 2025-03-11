import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            alert('인증이 만료되어 로그아웃됩니다.');
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        } else if (error.response?.status === 400) {
            return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
        }
        return Promise.reject(error);
    }
);

export default apiClient;
