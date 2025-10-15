// 프로젝트 이름 중복 확인
import apiClient from "@/api/Axios";

export type ProjectDetail = {
    projectId: number;
    projectName: string;
    description: string;
    devInterest: string;
    gitHubUrl: string;
    ownerId: string;
    ownerName: string;
    createdAt: string;
};

export type CreateProjectDTO = {
    projectName: string;
    devInterest: string;
    description: string;
    leaderName: string;
    gitHubUrl: string;
};

export type UpdateProjectDTO = {
    projectName: string;
    devInterest: string;
    description: string;
    gitHubUrl: string | null;
    leaderName?: string;
};

export const getProjectDetailRequest = async (projectName: string): Promise<ProjectDetail> => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const res = await apiClient.get(`/api/project/detail/${encodeURIComponent(projectName)}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const raw = res.data;
    return {
        projectId: raw.projectId,
        projectName: raw.projectName,
        description: raw.description,
        devInterest: raw.devInterest,
        gitHubUrl: raw.gitHubUrl,
        ownerId: raw.ownerId,
        ownerName: raw.ownerName,
        createdAt: raw.createdAt,
    };
};

export const checkProjectNameRequest = async (projectName: string): Promise<boolean> => {
    try {
        const response = await apiClient.get('/api/project/check-project-name', {
            params: { projectName },
        });
        return response.data.available;
    } catch (error: any) {
        alert("프로젝트 이름 중복 확인 실패");
        return false;
    }
};

// 프로젝트 저장
export const createProjectSaveRequest = async (dto: CreateProjectDTO) => {
    const token = localStorage.getItem('accessToken');
    const res = await apiClient.post(
        '/api/project/project-create',
        dto,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );
    return res.data;
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


// 프로젝트 이름으로 조회
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

export const updateProjectRequest = async (projectId: number, dto: UpdateProjectDTO) => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    const res = await apiClient.put(`/api/project/${projectId}`, dto, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

// 삭제
export const deleteProjectRequest = async (projectId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("인증 토큰이 없습니다.");

    await apiClient.delete(`/api/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};