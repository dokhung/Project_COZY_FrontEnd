import apiClient from '@/api/Axios';
import type { CreateTaskDTO, UpdateTaskPayload } from "@/types/api/task";

export const getTaskListRequest = async (projectId: string) => {
    const res = await apiClient.get('/api/task/list', {
        params: { projectId },
    });
    return res.data;
};

export const getTaskDetailRequest = async (
    projectId: string,
    taskId: number
) => {
    const res = await apiClient.get(`/api/task/detail`, {
        params: { projectId,taskId },
    });
    return res.data;
};

export const createTaskRequest = async (dto: CreateTaskDTO) => {
    const res = await apiClient.post('/api/task/create', dto);
    return res.data;
};

export const deleteTaskRequest = async (id: number) => {
    await apiClient.delete(`/api/task/${id}`);
};

export const updateTaskRequest = async (
    id: number,
    payload: UpdateTaskPayload
) => {
    const res = await apiClient.put(`/api/task/${id}`, payload);
    return res.data;
};
