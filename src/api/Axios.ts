import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');

    // 🚀 [수정] 토큰이 없는 경우에도 요청이 나갈 수 있도록 수정
    if (token) {
        console.log("🔍 요청 Authorization 헤더: Bearer " + token);
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn("⚠️ JWT 토큰 없음 (로그인 필요)");
    }

    return config;
}, (error) => Promise.reject(error));

export default apiClient;
