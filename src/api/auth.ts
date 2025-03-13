import apiClient from './Axios';

// ✅ 회원가입 요청 함수
export const registerRequest = (formData: FormData) => {
    return apiClient.post('/api/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// ✅ 로그인 요청
export const loginRequest = async (email: string, password: string) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    const { token, user } = response.data;

    console.log("✅ 로그인 성공 - 토큰 저장: ", token);
    localStorage.setItem('accessToken', token);

    return { user, token };
};

export const verifyPasswordRequest = async (password: string) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        throw new Error("❌ 인증 토큰이 없습니다.");
    }

    try {
        const response = await apiClient.post(
            '/api/auth/verify-password',
            { password },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ JWT 토큰 포함
                    'Content-Type': 'application/json' // ✅ JSON 타입 지정
                }
            }
        );

        console.log("✅ 비밀번호 확인 응답:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ 비밀번호 확인 실패");
        throw error;
    }
};




// ✅ 유저 정보 수정 요청
export const updateUserInfoRequest = async (formData: FormData) => {
    const token = localStorage.getItem('accessToken');

    if (!token) throw new Error("JWT 토큰이 없습니다. 로그인하세요.");

    const response = await apiClient.post('/api/auth/update-info', formData, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
};

export const getCurrentUserRequest = async () => {
    const token = localStorage.getItem('accessToken'); // ✅ JWT 토큰 가져오기
    if (!token) {
        throw new Error("❌ 인증 토큰이 없습니다.");
    }

    try {
        const response = await apiClient.get('/api/auth/current-user', {
            headers: {
                Authorization: `Bearer ${token}` // ✅ 헤더에 JWT 추가
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};




