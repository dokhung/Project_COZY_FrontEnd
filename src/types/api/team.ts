export type CreateTeamDTO = {
    teamName?: string;
    description: string;
};

export type TeamResponseItem = {
    teamId?: string | number;
    id?: string | number;
    teamName?: string;
    name?: string;
    description?: string;
    memberCount?: number;
    projectCount?: number;
};

export type MyTeamResponse = {
    data?: {
        teamList?: TeamResponseItem[];
    };
    teamList?: TeamResponseItem[];
};

export type TeamRole = "MASTER" | "SUB_MASTER" | "USER";

export type MemberRole = TeamRole;

export type TeamMember = {
    memberId: string;
    nickname: string;
    role: MemberRole;
};

export type MemberListResponse = {
    teamId: string;
    teamName: string;
    members: TeamMember[];
};

export type CheckTeamNameResponse = {
    available: boolean;
};

export type UpdateTeamRequest = {
    teamId: string;
    description: string;
};

export type DeleteTeamRequest = {
    teamName: string;
    password: string;
};

export type TeamStats = {
    teamId: string;
    projectCount: number;
    noticeCount: number;
    joinRequestCount: number;
    upgradeRequestCount: number;
    leaveRequestCount: number;
    inactiveMemberCount: number;
    inactiveMembers?: Array<{
        userId: string;
        nickname: string;
        lastLoginAt?: string | null;
    }>;
};
