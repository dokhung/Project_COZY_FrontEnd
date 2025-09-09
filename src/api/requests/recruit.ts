import apiClient from "@/api/Axios";

export const getRecruitListRequest = async () => {
    const token = localStorage.getItem("token");
    const headers = token
    ? { Authorization: `Bearer ${token}` }
        : {};
    const res = await apiClient.get('/api/recruit/list', { headers });
    return res.data;
}

export const createRecruitRequest = async (
    recruitDto: {
        title: string;
        nickName: string;
        recruitText: string;
    }
) => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return await apiClient.post('/api/recruit/create', recruitDto, { headers });
};


export const updateRecruitRequest = async (
    id: number,
    recruitDto: { title: string; recruitText: string }
) => {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.put(`/api/recruit/${id}`, recruitDto, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const deleteRecruitRequest = async (id: number) => {
    const token = localStorage.getItem("accessToken");
    const res = await apiClient.delete(`/api/recruit/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
