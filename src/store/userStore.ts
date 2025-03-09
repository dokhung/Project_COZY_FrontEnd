import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 🔹 UserState 타입 정의
type UserState = {
    isLoggedIn: boolean;
    user: {
        id: number;
        email: string;
        nickname: string;
        profileImage?: string;
    } | null;
    accessToken: string;
    login: (user: { id: number; email: string; nickname: string; profileImage?: string }, token: string) => void;
    logout: () => void;
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            isLoggedIn: false,
            user: null,
            accessToken: '',

            login: (user, token) => {
                console.log('✅ 로그인 상태 저장됨 (전):', get().user);
                set({ isLoggedIn: true, user, accessToken: token });
                console.log('✅ 로그인 상태 저장됨 (후):', get().user);
            },

            logout: () => {
                set({ isLoggedIn: false, user: null, accessToken: '' });
                console.log('🚪 로그아웃됨');
            },
        }),
        {
            name: 'user-store',
            partialize: (state) => ({
                isLoggedIn: state.isLoggedIn,
                user: state.user,
                accessToken: state.accessToken,
            })
        }
    )
);

