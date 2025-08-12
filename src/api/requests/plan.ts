import apiClient from "@/api/Axios";

export const getPlanListRequest = async () => {
    const res = await apiClient.get('/api/plan/list');
    return res.data;
};

// 게시글 작성 요청
export const createPlanRequest = async (
    planDto: {
        nickName: string;
        title: string;
        status: string;
        planText: string;
    }
) => {
    return await apiClient.post('/api/plan/create', planDto);
};

export const deletedPlanRequest = async (id : number) => {
    await apiClient.delete(`/api/plan/${id}`);
}

export const updatePlanRequest = async (
    id: number,
    planDto: {
        title: string;
        status: string;
        planText: string;
    }
) => {
    const res = await apiClient.put(`/api/plan/${id}`, planDto);
    return res.data;
};

export const getPlanDetailRequest = async (id: number) => {
    const res = await apiClient.get(`/api/plan/${id}`);
    return res.data;
};
