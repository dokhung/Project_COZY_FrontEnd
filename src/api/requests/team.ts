import apiClient from "@/api/Axios";

export type CreateTeamDTO = {
    teamName: string;
    description: string;
}

export const createTeamRequest = async (dto : CreateTeamDTO) => {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.post(
        '/api/team/create',dto,{
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        }
    );
    return res.data;
}

export const getMyTeamInfoRequest = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const res = await apiClient.get('/api/team/list',{
            headers: {Authorization: `Bearer ${token}`},
        });
        return res.data;
    } catch (error : any) {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
        } else {
            console.error('팀 정보 조회 실패:', error);
            throw error;
        }
    }
}

export const checkTeamNameRequest = async (teamName: string): Promise<boolean> => {
    try {
        const res = await apiClient.get('/api/team/check-team-name',
            {
                params: { teamName },
            });
        return res.data.available;
    }catch (e) {
        alert("error");
        return false;
    }
}