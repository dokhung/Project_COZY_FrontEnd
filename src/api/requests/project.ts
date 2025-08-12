// TODO : 프로젝트 이름 중복 확인
import apiClient from "@/api/Axios";

export const checkProjectNameRequest = async (projectName: string): Promise<boolean> => {
    try {
        const response = await apiClient.get('/api/project/check-projectname', {
            params: { projectName },
        });
        return response.data.available;
    } catch (error: any) {
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

// 로그인을 하고 나서 가지고 있는 프로젝트 정보 가져옴
export const getMyProjectInfoRequest = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const response = await apiClient.get('/api/project/my-projectInfo', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
        } else {
            console.error('프로젝트 정보 조회 실패:', error);
            throw error;
        }
    }
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