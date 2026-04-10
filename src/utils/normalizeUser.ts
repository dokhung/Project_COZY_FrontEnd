import type { User } from "@/store/userStore";

type RawUser = {
    id?: string;
    userId?: string;
    email?: string;
    nickname?: string;
    profileImage?: string;
    profileImageUrl?: string;
    statusMessage?: string;
    role?: string;
};

export const normalizeUser = (raw: RawUser | null | undefined): User => {
    const fallback: User = {
        id: "",
        email: "",
        nickname: "",
        profileImage: undefined,
        statusMessage: undefined,
        role: undefined,
    };

    if (!raw) return fallback;

    return {
        id: String(raw.id ?? raw.userId ?? ""),
        email: String(raw.email ?? ""),
        nickname: String(raw.nickname ?? ""),
        profileImage: raw.profileImage ?? raw.profileImageUrl ?? undefined,
        statusMessage: raw.statusMessage ?? undefined,
        role: raw.role ?? undefined,
    };
};
