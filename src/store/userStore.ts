import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 🔹 User 타입 정의
type User = {
    id: number;
    email: string;
    nickname: string;
    profileImage?: string;
    statusMessage?: string;
};

// 🔹 Zustand 상태 정의
type UserState = {
    isLoggedIn: boolean;
    user: User | null;
    accessToken: string;
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

            // ✅ 유저 상태 업데이트 함수 (토큰 포함 가능)
            setUser: (user, token) => {
                set((state) => ({
                    user: { ...state.user, ...user }, // 기존 데이터 유지하면서 업데이트
                    ...(token ? { accessToken: token } : {}), // 토큰이 있을 때만 저장
                }));
                if (token) localStorage.setItem('accessToken', token);
            },

            // ✅ 프로필 이미지 업데이트 (기존 값 유지)
            updateProfileImage: (imageUrl) => {
                set((state) => {
                    if (!state.user) return state; // user가 없으면 업데이트하지 않음
                    return { user: { ...state.user, profileImage: imageUrl } };
                });
            },

            login: (user, token) => {
                localStorage.setItem('accessToken', token);
                set({ isLoggedIn: true, user, accessToken: token });
            },

            logout: () => {
                localStorage.removeItem('accessToken');
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
