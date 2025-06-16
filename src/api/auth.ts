import apiClient from './Axios';
import {useUserStore} from "@/store/userStore";
import {handleApiError} from "@/api/handleApiError";


export const registerRequest = (formData: FormData) => {
    return apiClient.post('/api/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// TODO : 로그인을 하기 위해서 입력된 아이디와 비밀번호를 서버에 보낸다.
export const loginRequest = async (
    email: string,
    password: string): Promise<{ accessToken : string; refreshToken:string; } | undefined> => {
    try {
        const response = await apiClient.post('/api/auth/login', { email, password });
        const { accessToken, refreshToken } = response.data;
        console.log("accessToken"+accessToken);
        console.log("refreshToken"+refreshToken);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        return { accessToken, refreshToken };
    } catch (error: unknown) {
        handleApiError(error, "로그인 실패");
        return undefined;
    }
};

//TODO : 로그인된 유저의 정보를 JWT를 통해서 캐치한다.
export const getCurrenUserRequest = async () : Promise<any | undefined> => {
    const token:string|null = localStorage.getItem('accessToken');
    if (!token) {
        alert("토큰이 없어요");
        return undefined;
    }

    try {
        const res = await apiClient.get('/api/auth/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }catch (error: unknown) {
    return undefined;
    }
};


export const verifyPasswordRequest = async (password: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error(' 인증 토큰이 없습니다.');

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


export const getCurrentUserRequest = async (): Promise<any | undefined> => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert(" 토큰이 없습니다.");
        return undefined;
    }

    try {
        const response = await apiClient.get('/api/auth/current-user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: unknown) {
        handleApiError(error, '유저 정보 조회 실패');
        return undefined;
    }
};



export const updateUserInfoRequest = async (formData: FormData) => {
    const token : string|null = localStorage.getItem('accessToken');
    if (!token) throw new Error("토큰이 없습니다.");

    try {
        const response = await apiClient.post('/api/auth/update-info', formData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        throw new Error("정보 수정 실패");
    }
};

export const logoutRequest = async () =>  {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        useUserStore.getState().logout();
        return;
    }
    try {
        await apiClient.post('/api/auth/logout', {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (e : unknown) {
        console.warn("만료된 토큰으로 로그아웃 시도 → 클라이언트에서만 로그아웃 처리");
    } finally {
        useUserStore.getState().logout();
    }
}


export const checkProjectNameRequest = async (projectName: string) : Promise<boolean> => {
    console.log(projectName);
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
    if (!token) throw new Error(' 인증 토큰이 없습니다.');

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
    if (!token) throw new Error(' 인증 토큰이 없습니다.');

    const response = await apiClient.get('/api/project/my-projectInfo', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getProjectByNameRequest = async (projectName: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) throw new Error(' 인증 토큰이 없습니다.');

    try {
        const response = await apiClient.get(`/api/project/name/${projectName}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        return response.data;
    } catch (error: unknown) {
        return handleApiError(error, '프로젝트 정보 가져오기 실패');
    }
};

//TODO : 게시판 리스트 가져오기
export const getBoardListRequest = async () => {
    try {
        const res = await apiClient.get('/api/board');
        return res.data;
    }
    catch (error) {
        return handleApiError(error, " Request Error");
    }


}






