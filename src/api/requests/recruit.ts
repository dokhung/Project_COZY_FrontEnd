import apiClient from "@/api/Axios";
import type { CreateRecruitDto, UpdateRecruitPayload } from "@/types/api/recruit";

export const getRecruitListRequest = async () => {
    const res = await apiClient.get("/api/recruit/list");
    return res.data;
};

export const getRecruitDetailRequest = async (id: number) => {
    const res = await apiClient.get(`/api/recruit/${id}`);
    return res.data;
}

export const createRecruitRequest = async (
    recruitDto: CreateRecruitDto
) => {
    return await apiClient.post("/api/recruit/create", recruitDto);
};

export const updateRecruitRequest = async (
    id: number,
    recruitDto: UpdateRecruitPayload
) => {
    const res = await apiClient.put(`/api/recruit/${id}`, recruitDto);
    return res.data;
};

export const deleteRecruitRequest = async (id: number) => {
    const res = await apiClient.delete(`/api/recruit/${id}`);
    return res.data;
};
