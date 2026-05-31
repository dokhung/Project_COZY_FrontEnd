import apiClient from "@/api/Axios";
import {Team} from "@/store/teamStore";
import type {
    CheckTeamNameResponse,
    CreateTeamDTO,
    DeleteTeamRequest,
    MemberListResponse,
    MyTeamResponse,
    TeamStats,
    UpdateTeamRequest,
} from "@/types/api/team";

// 3. 팀 생성 요청
export const createTeamRequest = async (dto: CreateTeamDTO) => {
    const res = await apiClient.post("/api/team", dto);
    return res.data;
};

// 4. 내 팀 리스트 요청
export const getMyTeamInfoRequest = async (): Promise<Team[]> => {
    const res = await apiClient.get<MyTeamResponse>("/api/team/my-team");
    const payload = res.data;

    const list =
        (Array.isArray(payload?.data?.teamList) && payload.data!.teamList) ||
        (Array.isArray(payload?.teamList) && payload.teamList) ||
        [];

    const teams: Team[] = list.map((t): Team => ({
        id: String(t.teamId ?? t.id ?? ""),
        teamName: t.teamName ?? t.name ?? "Unnamed Team",
        description: t.description ?? "",
        memberCount: typeof t.memberCount === "number" ? t.memberCount : undefined,
        projectCount: typeof t.projectCount === "number" ? t.projectCount : undefined,
    }));
    return teams;
};

export const checkTeamNameRequest = async (teamName: string): Promise<boolean> => {
    try {
        const res = await apiClient.get<CheckTeamNameResponse>("/api/team/check-team-name", {
            params: { teamName },
        });
        return res.data.available;
    } catch (e) {
        console.error("checkTeamNameRequest error:", e);
        return false;
    }
};



/** 팀 멤버 리스트 조회 */
export const getMemberListRequest = async (
    teamId: string
): Promise<MemberListResponse> => {
    const res = await apiClient.get<MemberListResponse>(
        "/api/member/list",
        {
            params: { teamId },
        }
    );
    return res.data;
};

export const getTeamDetailInfoRequest = async (teamId: string) => {
    const res = await apiClient.get("/api/team/get-team-detail-info", {
        params: {
            team: teamId,
        },
    });
    return res.data;
};

export const updateTeamRequest = async (payload: UpdateTeamRequest) => {
    const res = await apiClient.patch("/api/team", payload);
    return res.data; // TeamDetailDTO
};


export const deleteTeamRequest = async (teamId: string, payload: DeleteTeamRequest) => {
    await apiClient.delete("/api/team", {
        params: {
            team: teamId,
        },
        data: payload,
    });
};

export const getTeamStatsRequest = async (teamId: string): Promise<TeamStats> => {
    const res = await apiClient.get<TeamStats>("/api/team/stats", {
        params: { team: teamId },
    });
    return res.data;
};

export const requestUpgrade = async (teamId: string, message?: string) => {
    await apiClient.post("/api/team/upgrade-request", { teamId, message });
};

export const getUpgradeRequests = async (teamId: string) => {
    const res = await apiClient.get("/api/team/upgrade-request", {
        params: { team: teamId },
    });
    return res.data;
};

export const approveUpgrade = async (requestId: string) => {
    await apiClient.patch(`/api/team/upgrade-request/${requestId}/approve`);
};

export const rejectUpgrade = async (requestId: string, message?: string) => {
    await apiClient.patch(`/api/team/upgrade-request/${requestId}/reject`, { message });
};

export const requestLeave = async (teamId: string, message?: string) => {
    await apiClient.post("/api/team/leave-request", { teamId, message });
};

export const getLeaveRequests = async (teamId: string) => {
    const res = await apiClient.get("/api/team/leave-request", {
        params: { team: teamId },
    });
    return res.data;
};

export const approveLeave = async (requestId: string) => {
    await apiClient.patch(`/api/team/leave-request/${requestId}/approve`);
};

export const rejectLeave = async (requestId: string, message?: string) => {
    await apiClient.patch(`/api/team/leave-request/${requestId}/reject`, { message });
};
