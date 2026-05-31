export type ProjectDetail = {
    projectId: string;
    projectName: string;
    devInterest: string;
    description: string;
    leaderName: string;
    gitHubUrl: string | null;
    teamId: string;
    teamName?: string;
    leaderId: string;
    subLeaderId: string | null;
};

export type CreateProjectDTO = {
    projectName: string;
    devInterest: string;
    description: string;
    githubUrl?: string;
    teamId: string;
};

export type UpdateProjectDTO = {
    projectName: string;
    devInterest: string;
    description: string;
    gitHubUrl: string | null;
};

export type DeleteProjectRequest = {
    teamName: string;
    password: string;
};
