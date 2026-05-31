export type AdminUser = {
    userId: string;
    email: string;
    nickname: string;
    role: "USER" | "OPERATOR" | string;
    blocked: boolean;
    lastLoginAt: string | null;
};
