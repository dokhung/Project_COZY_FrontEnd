// src/api/requests/task.ts
import apiClient from "@/api/Axios";

export type CreateTaskDTO = {
    projectId: number;
    nickName: string;
    title: string;
    status: string;
    taskText: string;
};

// 리스트
export const getTaskListRequest = async (projectId: number) => {
    try {
        const res = await apiClient.get("/api/task/list", {
            params: { projectId } ,
        });
        return res.data ?? [];
    } catch (e: any) {
        const code = e?.response?.status;
        if (code === 204 || code === 404) return [];
        throw e;
    }
};


// 생성
export const createTaskRequest = async (dto: CreateTaskDTO) => {
    console.log("createTaskDTO::", dto);
    const res = await apiClient.post("/api/task/create", dto);
    return res.data;
};

// 삭제
export const deleteTaskRequest = async (id: number) => {
    await apiClient.delete(`/api/task/${id}`);
};

// 수정
export const updateTaskRequest = async (
    id: number,
    payload: { title: string; status: string; planText: string }
) => {
    const res = await apiClient.put(`/api/task/${id}`, payload);
    return res.data;
};

// 상세
export const getTaskDetailRequest = async (id: number) => {
    const res = await apiClient.get(`/api/task/${id}`);
    return res.data;
};
