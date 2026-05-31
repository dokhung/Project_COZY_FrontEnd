export type CreateRecruitDto = {
    teamId: string;
    title: string;
    nickName: string;
    recruitText: string;
};

export type UpdateRecruitPayload = {
    title: string;
    recruitText: string;
};
