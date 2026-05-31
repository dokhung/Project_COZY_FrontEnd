export type RecurrenceType = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";

export type PersonalMemo = {
    memoId: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
};

export type PersonalSchedule = {
    scheduleId: string;
    title: string;
    description?: string | null;
    location?: string | null;
    startAt: string;
    endAt: string;
    allDay: boolean;
    recurrenceType?: RecurrenceType;
    recurrenceInterval?: number;
    recurrenceUntil?: string | null;
    recurrenceCount?: number | null;
    createdAt: string;
    updatedAt: string;
};

export type PersonalPost = {
    postId: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};

export type CreatePersonalMemoPayload = {
    title: string;
    content: string;
    tags?: string[];
};

export type UpdatePersonalMemoPayload = {
    title?: string;
    content?: string;
    tags?: string[];
};

export type CreatePersonalSchedulePayload = {
    title: string;
    description?: string;
    location?: string;
    startAt: string;
    endAt: string;
    allDay?: boolean;
    recurrenceType?: RecurrenceType;
    recurrenceInterval?: number;
    recurrenceUntil?: string | null;
    recurrenceCount?: number | null;
};

export type UpdatePersonalSchedulePayload = Partial<CreatePersonalSchedulePayload>;

export type CreatePersonalPostPayload = {
    title: string;
    content: string;
};

export type UpdatePersonalPostPayload = {
    title?: string;
    content?: string;
};
