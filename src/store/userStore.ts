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

            setUser: (user, token) => {
                set({ user });
                if (token) {
                    localStorage.setItem('accessToken', token);
                    set({ accessToken: token });
                }
            },

            // ✅ 수정: 프로필 이미지가 상태에서 즉시 반영되도록 변경
            updateProfileImage: (imageUrl) => {
                set((state) => ({
                    user: state.user ? { ...state.user, profileImage: imageUrl } : null,
                }));
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
