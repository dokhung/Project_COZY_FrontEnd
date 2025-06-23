import apiClient from './Axios';
import { useUserStore } from "@/store/userStore";

// ✅ 회원가입
export const registerRequest = (formData: FormData) => {
    return apiClient.post('/api/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// ✅ 로그인
export const loginRequest = async (
    email: string,
    password: string
): Promise<{ accessToken: string; refreshToken: string } | undefined> => {
    try {
        const response = await apiClient.post('/api/auth/login', { email, password });
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return { accessToken, refreshToken };
    } catch (error: any) {
        alert("로그인 실패: " + (error?.response?.data?.error || "서버 오류"));
        return undefined;
    }
};

// ✅ 비밀번호 검증
export const verifyPasswordRequest = async (password: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("인증 토큰이 없습니다.");

    try {
        const response = await apiClient.post(
            '/api/auth/verify-password',
            { password },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("❌ 비밀번호 검증 실패:", error.message);
        alert("비밀번호 검증 실패");
        return false;
    }
};

// ✅ 유저 정보 조회 (중복 제거 가능)
export const getCurrentUserRequest = async (): Promise<any | undefined> => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert("토큰이 없습니다.");
        return undefined;
    }

    try {
        const response = await apiClient.get('/api/auth/current-user', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error("❌ 유저 정보 조회 실패:", error.message);
        return undefined;
    }
};

// ✅ 유저 정보 업데이트
export const updateUserInfoRequest = async (formData: FormData) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("토큰이 없습니다.");

    try {
        const response = await apiClient.post('/api/auth/update-info', formData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error("❌ 정보 수정 실패:", error.message);
        alert("정보 수정 실패");
        return undefined;
    }
};

// ✅ 로그아웃
export const logoutRequest = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        useUserStore.getState().logout();
        return;
    }

    try {
        await apiClient.post('/api/auth/logout', null, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error: any) {
        console.warn("❌ 만료된 토큰으로 로그아웃 시도 → 클라이언트에서만 로그아웃 처리");
    } finally {
        useUserStore.getState().logout();
    }
};

// ✅ 프로젝트 이름 중복 확인
export const checkProjectNameRequest = async (projectName: string): Promise<boolean> => {
    try {
        const response = await apiClient.get('/api/project/check-projectname', {
            params: { projectName },
        });
        return response.data.available;
    } catch (error: any) {
        console.error("❌ 프로젝트 이름 확인 실패:", error.message);
        alert("프로젝트 이름 중복 확인 실패");
        return false;
    }
};

// TODO : 프로젝트 저장
export const createProjectSaveRequest = async (projectName: string, interest: string) => {
    const token = localStorage.getItem('accessToken');
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
};

// TODO : 로그인을 하고 나서 가지고 있는 프로젝트 정보 가져옴
export const getMyProjectInfoRequest = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("인증 토큰이 없습니다.");
        const response = await apiClient.get('/api/project/my-projectInfo', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
};

// TODO : 프로젝트 이름으로 조회
export const getProjectByNameRequest = async (projectName: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) throw new Error("인증 토큰이 없습니다.");

    try {
        const response = await apiClient.get(`/api/project/name/${projectName}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error("❌ 프로젝트 정보 가져오기 실패:", error.message);
        alert("프로젝트 정보 가져오기 실패");
        return undefined;
    }
};

// ✅ 게시판 리스트 가져오기
export const getBoardListRequest = async () => {
    try {
        const response = await apiClient.get('/api/board');
        return response.data;
    } catch (error: any) {
        console.error("❌ 게시판 데이터 가져오기 실패:", error.message);
        alert("게시판 데이터를 불러오지 못했습니다.");
        return undefined;
    }
};
