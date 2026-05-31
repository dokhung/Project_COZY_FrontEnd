import apiClient from "@/api/Axios";
import type {
    CreatePersonalMemoPayload,
    CreatePersonalPostPayload,
    CreatePersonalSchedulePayload,
    PersonalMemo,
    PersonalPost,
    PersonalSchedule,
    UpdatePersonalMemoPayload,
    UpdatePersonalPostPayload,
    UpdatePersonalSchedulePayload,
} from "@/types/api/personal";

// ===== Memo =====
export const getPersonalMemos = async (): Promise<PersonalMemo[]> => {
    const res = await apiClient.get<PersonalMemo[]>("/api/personal/memos");
    return res.data ?? [];
};

export const createPersonalMemo = async (payload: CreatePersonalMemoPayload): Promise<PersonalMemo> => {
    const res = await apiClient.post<PersonalMemo>("/api/personal/memos", payload);
    return res.data;
};

export const updatePersonalMemo = async (
    memoId: string,
    payload: UpdatePersonalMemoPayload
): Promise<PersonalMemo> => {
    const res = await apiClient.patch<PersonalMemo>(
        `/api/personal/memos/${memoId}`,
        payload
    );
    return res.data;
};

export const deletePersonalMemo = async (memoId: string) => {
    await apiClient.delete(`/api/personal/memos/${memoId}`);
};

// ===== Schedule =====
export const getPersonalSchedules = async (): Promise<PersonalSchedule[]> => {
    const res = await apiClient.get<PersonalSchedule[]>("/api/personal/schedules");
    return res.data ?? [];
};

export const createPersonalSchedule = async (payload: CreatePersonalSchedulePayload): Promise<PersonalSchedule> => {
    const res = await apiClient.post<PersonalSchedule>(
        "/api/personal/schedules",
        payload
    );
    return res.data;
};

export const updatePersonalSchedule = async (
    scheduleId: string,
    payload: UpdatePersonalSchedulePayload
): Promise<PersonalSchedule> => {
    const res = await apiClient.patch<PersonalSchedule>(
        `/api/personal/schedules/${scheduleId}`,
        payload
    );
    return res.data;
};

export const deletePersonalSchedule = async (scheduleId: string) => {
    await apiClient.delete(`/api/personal/schedules/${scheduleId}`);
};

// ===== Post =====
export const getPersonalPosts = async (): Promise<PersonalPost[]> => {
    const res = await apiClient.get<PersonalPost[]>("/api/personal/posts");
    return res.data ?? [];
};

export const createPersonalPost = async (payload: CreatePersonalPostPayload): Promise<PersonalPost> => {
    const res = await apiClient.post<PersonalPost>("/api/personal/posts", payload);
    return res.data;
};

export const updatePersonalPost = async (
    postId: string,
    payload: UpdatePersonalPostPayload
): Promise<PersonalPost> => {
    const res = await apiClient.patch<PersonalPost>(
        `/api/personal/posts/${postId}`,
        payload
    );
    return res.data;
};

export const deletePersonalPost = async (postId: string) => {
    await apiClient.delete(`/api/personal/posts/${postId}`);
};
