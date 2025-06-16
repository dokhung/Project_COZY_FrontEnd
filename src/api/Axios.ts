import axios from 'axios';
import { useUserStore } from '@/store/userStore';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// TODO : 로그아웃 판단
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
        ) {
            console.log("인증민료가 되어서 로그아웃함");
            useUserStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default apiClient;
