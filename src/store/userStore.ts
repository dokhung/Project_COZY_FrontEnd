import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
    id: number;
    email: string;
    nickname: string;
    profileImage?: string;
    statusMessage?: string;
};

type UserState = {
    isLoggedIn: boolean;
    user: User | null;
    accessToken: string;
    isHydrated: boolean;
    setUser: (user: User, token?: string) => void;
    updateProfileImage: (imageUrl: string) => void;
    login: (user: User, token: string) => void;
    logout: () => void;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,
            accessToken: '',
            isHydrated: false,

            setUser: (user, token) => {
                if (typeof window !== "undefined" && token) {
                    localStorage.setItem('accessToken', token);
                }
                set({ user, accessToken: token ?? '', isLoggedIn: true });
            },

            updateProfileImage: (imageUrl) => {
                set((state) => ({
                    user: state.user ? { ...state.user, profileImage: imageUrl } : null,
                }));
            },

            login: (user, token) => {
                if (typeof window !== "undefined") {
                    localStorage.setItem('accessToken', token);
                }
                set({ isLoggedIn: true, user, accessToken: token });
            },

            logout: () => {
                if (typeof window !== "undefined") {
                    localStorage.removeItem('accessToken');
                }
                set({ isLoggedIn: false, user: null, accessToken: '' });
            },
        }),
        {
            name: 'user-store',
            partialize: (state) => ({
                isLoggedIn: state.isLoggedIn,
                user: state.user,
                accessToken: state.accessToken,
            }),
            onRehydrateStorage: (state) => {
                return () => {
                    state.isHydrated = true;
                };
            }

        }
    )
);
