import apiClient from './Axios';
import {AxiosError} from 'axios';
import {useUserStore} from "@/store/userStore";


export const registerRequest = (formData: FormData) => {
    return apiClient.post('/api/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};


export const loginRequest = async (email: string, password: string): Promise<{ user: any; token: any } | undefined> => {
    try {
        const response = await apiClient.post('/api/auth/login', { email, password });
        const { token, user } = response.data;

        console.log("✅ 로그인 성공 - 토큰 저장: ", token);
        localStorage.setItem('accessToken', token);

        return { user, token };
    } catch (error: unknown) {
        handleApiError(error, "로그인 실패");
        return undefined;
    }
};


export const verifyPasswordRequest = async (password: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("❌ 인증 토큰이 없습니다.");

    try {
        const response = await apiClient.post(
            '/api/auth/verify-password',
            { password },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("✅ 비밀번호 확인 응답:", response.data);
        return response.data;
    } catch (error: unknown) {
        return handleApiError(error, "비밀번호 검증 실패");
    }
};

// ✅ 매개변수로 token 받게 변경
export const getCurrentUserRequest = async (token: string) => {
    if (!token) throw new Error("❌ 인증 토큰이 없습니다.");

    try {
        const response = await apiClient.get('/api/auth/current-user', {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error: unknown) {
        return handleApiError(error, "현재 유저 정보 가져오기 실패");
    }
};



export const updateUserInfoRequest = async (formData: FormData) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("❌ JWT 토큰이 없습니다. 로그인하세요.");

    try {
        const response = await apiClient.post('/api/auth/update-info', formData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ 유저 정보 업데이트 성공:", response.data);
        return response.data; // 🔥 수정된 프로필 정보를 반환
    } catch (error: any) {
        console.error("❌ 유저 정보 업데이트 실패:", error.response?.data || error.message);
        throw new Error("정보 수정 실패");
    }
};

// logoutRequest.ts
export const logoutRequest = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        // 그냥 클라이언트에서만 로그아웃 처리
        useUserStore.getState().logout();
        return;
    }
    try {
        await apiClient.post('/api/auth/logout', {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (e) {
        console.warn("만료된 토큰으로 로그아웃 시도 → 클라이언트에서만 로그아웃 처리");
    } finally {
        useUserStore.getState().logout();
    }
}


export const checkProjectNameRequest = async (projectName: string) : Promise<boolean> => {
    try {
        const res = await apiClient.get('/api/project/check-projectname', {
            params: { projectName }
        });
        return res.data.available;
    }catch (error: unknown) {
        handleApiError(error,"프로젝트 이름 중복 확인 실패");
        return false;
    }

}

export const createProjectSaveRequest = async (projectName: string, interest: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("❌ 인증 토큰이 없습니다.");

    try {
        const response = await apiClient.post(
            '/api/project/projectCreate',
            { projectName, interest },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error: unknown) {
        return handleApiError(error, "프로젝트 생성 실패");
    }
};

export const getMyProjectInfoRequest = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('❌ 인증 토큰이 없습니다.');

    const response = await apiClient.get('/api/project/my-projectInfo', {
        headers: { Authorization: `Bearer ${token}` },
    });

    console.log("🎯 프로젝트 API 응답:", response.data);
    return response.data; // 여기서 실제로 배열을 리턴하는지 확인!
};





//TODO: API보조함수
const handleApiError = (error: unknown, customMessage: string) => {
    if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || customMessage);
    }

    if (error instanceof Error) {
        console.error(`❌ ${customMessage}:`, error.message);
        throw new Error(error.message);
    }

    console.error(`❌ ${customMessage}: 알 수 없는 오류 발생`);
    throw new Error(customMessage);
};
