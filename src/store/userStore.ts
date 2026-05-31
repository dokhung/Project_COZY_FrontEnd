import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authClient, resetTokenExpiryAlert } from "@/api/Axios";
import { useTeamStore } from "@/store/teamStore";

export type User = {
    id: string;          // UUID
    email: string;
    nickname: string;
    profileImage?: string;
    statusMessage?: string;
    role?: "USER" | "OPERATOR" | string;
};

type UserState = {
    isLoggedIn: boolean;
    user: User | null;
    accessToken: string;
    isHydrated: boolean;

    login: (user: User, token: string) => void;
    setUser: (user: User | null) => void;
    setAccessToken: (token: string) => void;
    setHydrated: (hydrated: boolean) => void;
    logout: () => Promise<void>;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,
            accessToken: "",
            isHydrated: false,

            login: (user, token) => {
                resetTokenExpiryAlert();
                set({
                    isLoggedIn: true,
                    user,
                    accessToken: token,
                });
            },

            setUser: (user) => {
                set({
                    user,
                    isLoggedIn: !!user,
                });
            },

            setAccessToken: (token) => {
                set({
                    accessToken: token,
                    isLoggedIn: !!token,
                });
            },

            setHydrated: (hydrated) => {
                set({ isHydrated: hydrated });
            },

            logout: async () => {
                try {
                    await authClient.post("/api/auth/logout");
                } catch (e) {
                    console.warn("logout api failed", e);
                }

                set({
                    isLoggedIn: false,
                    user: null,
                    accessToken: "",
                });

                useTeamStore.getState().reset();
            },
        }),
        {
            name: "user-store",
            partialize: (state) => ({
                isLoggedIn: state.isLoggedIn,
                user: state.user,
                accessToken: state.accessToken,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            },
        }
    )
);
