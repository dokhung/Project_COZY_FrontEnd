import apiClient from "@/api/Axios";
import type {
    ChatCandidate,
    ChatMessage,
    ChatRoomSummary,
    ChatRoomType,
} from "@/types/api/chat";

const roomPath = (type: ChatRoomType, roomName: string) =>
    `/api/chat/${type}/${encodeURIComponent(roomName)}/messages`;

export async function getChatMessages(type: ChatRoomType, roomName: string) {
    const response = await apiClient.get<ChatMessage[]>(roomPath(type, roomName));
    return response.data;
}

export async function sendChatMessage(
    roomId: string,
    content: string
) {
    const response = await apiClient.post<ChatMessage>(`/api/chat/rooms/${roomId}/messages`, {
        content,
    });
    return response.data;
}

export async function getChatRooms(type: ChatRoomType, roomName: string) {
    const response = await apiClient.get<ChatRoomSummary[]>(
        `/api/chat/${type}/${encodeURIComponent(roomName)}/rooms`
    );
    return response.data;
}

export async function getChatCandidates(type: ChatRoomType, roomName: string) {
    const response = await apiClient.get<ChatCandidate[]>(
        `/api/chat/${type}/${encodeURIComponent(roomName)}/candidates`
    );
    return response.data;
}

export async function createChatRoom(
    type: ChatRoomType,
    roomName: string,
    payload: { name: string; direct: boolean; memberIds: string[] }
) {
    const response = await apiClient.post<ChatRoomSummary>(
        `/api/chat/${type}/${encodeURIComponent(roomName)}/rooms`,
        payload
    );
    return response.data;
}

export async function leaveChatRoom(roomId: string) {
    await apiClient.delete(`/api/chat/rooms/${roomId}/members/me`);
}

export async function getRoomMessages(roomId: string) {
    const response = await apiClient.get<ChatMessage[]>(
        `/api/chat/rooms/${roomId}/messages`
    );
    return response.data;
}
