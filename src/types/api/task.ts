export type CreateTaskDTO = {
    projectId: string;
    nickName: string;
    title: string;
    status: string;
    taskText: string;
};

export type UpdateTaskPayload = {
    title: string;
    status: string;
    taskText: string;
};
