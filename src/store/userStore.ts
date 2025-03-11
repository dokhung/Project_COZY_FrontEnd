import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 🔹 User 상태 타입 정의
type User = {
    id: number;
    email: string;
    nickname: string;
    profileImage?: string;
    statusMessage?: string; // 상태 메시지 추가
};

// 🔹 Zustand 상태 정의
type UserState = {
    isLoggedIn: boolean;
    user: User | null;
    accessToken: string;
    setUser: (user: User) => void; // ✅ `setUser` 추가
    login: (user: User, token: string) => void;
    logout: () => void;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,
            accessToken: '',

            // ✅ `setUser` 추가
            setUser: (user) => set({ user }),

            login: (user, token) => {
                set({ isLoggedIn: true, user, accessToken: token });
            },

            logout: () => {
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
        }
    )
);
