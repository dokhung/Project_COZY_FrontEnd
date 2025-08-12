import apiClient from "@/api/Axios";

export const getCommunityListRequest = async () => {
    const token = localStorage.getItem("token");
    const headers = token
    ? { Authorization: `Bearer ${token}` }
        : {};
    const res = await apiClient.get('/api/community/list', { headers });
    return res.data;
}

export const createCommunityRequest = async (
    communityDto: {
        title: string;
        nickName: string;
        communityText: string;
    }
) => {
    return await apiClient.post('/api/community/create', communityDto);
};

export const updateCommunityRequest = async (
    id: number,
    communityDto: {
        title: string;
        communityText: string;
    }
) => {
    const res = await apiClient.put(`/api/community/${id}`, communityDto);
    return res.data;
}

export const deleteCommunityRequest = async (
    id: number
) => {
    const res = await apiClient.delete(`/api/community/${id}`);
    return res.data;
}

export const getCommunityDetailRequest = async (id: number) => {
    const res = await apiClient.get(`/api/community/${id}`);
    return res.data;
}