'use client';

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { getCurrentUserRequest } from "@/api/auth";

export const useAuthCheck = () => {
    const { isHydrated, accessToken, login, logout } = useUserStore();

    useEffect(() => {
        if (!isHydrated) return; // persist에서 복구될 때까지 기다림

        const checkAuth = async () => {
            try {
                if (!accessToken) throw new Error("❌ 토큰 없음");
                const user = await getCurrentUserRequest(accessToken);
                login(user, accessToken);
            } catch (e) {
                console.warn("❌ 인증 실패 → 자동 로그아웃");
                logout();
            }
        };

        checkAuth();
    }, [isHydrated, accessToken]);
}
