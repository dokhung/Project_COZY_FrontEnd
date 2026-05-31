import apiClient from "@/api/Axios";

/** 가입 요청 생성 */
export const createJoinRequest = async (teamId: string, message: string) => {
    return await apiClient.post(`/api/join-request`, { teamId, message });
};

/** 내가 보낸 가입 요청 목록 */
export const getMyJoinRequests = async () => {
    return await apiClient.get(`/api/join-request/my-requests`);
};

export const getTeamJoinRequests = async (teamId: string) => {
    return apiClient.get("/api/join-request/team-requests", {
        params: { teamId },
    });
};

export const approveJoinRequest = async (requestId: string) => {
    return await apiClient.patch(
        `/api/join-request/${requestId}/approve`
    );
};

export const rejectJoinRequest = async (requestId: string, reason: string) => {
    return await apiClient.patch(
        `/api/join-request/${requestId}/reject`,
        { reason }
    );
};


/** 내가 보낸 가입 요청 취소 */
export const cancelJoinRequest = async (requestId: string) => {
    return await apiClient.delete(`/api/join-request/${requestId}`);
};
