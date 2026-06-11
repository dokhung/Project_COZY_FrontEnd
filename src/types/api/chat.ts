export type ChatRoomType = "TEAM" | "PROJECT";

export type ChatRoomSummary = {
    roomId: string;
    name: string;
    direct: boolean;
    memberCount: number;
    lastMessage?: string | null;
    lastMessageAt?: string | null;
};

export type ChatCandidate = {
    userId: string;
    nickname: string;
};

export type ChatMessage = {
    messageId: string;
    senderId: string;
    senderNickname: string;
    senderProfileImage?: string | null;
    currentScheduleTitle?: string | null;
    currentScheduleStartAt?: string | null;
    currentScheduleEndAt?: string | null;
    content: string;
    createdAt: string;
};
