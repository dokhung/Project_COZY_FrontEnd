'use client';

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useUserStore } from '@/store/userStore';
import { loginRequest } from '@/api/requests/login';
import { getCurrentUserRequest } from '@/api/requests/info';
import { normalizeUser } from "@/utils/normalizeUser";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function LoginClient() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { login, isLoggedIn, setAccessToken } = useUserStore();
    const { t } = useTranslation();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, router]);

    const handleLogin = async () => {
        setError('');
        setLoading(true);

        try {
            const { accessToken } = await loginRequest(email, password);
            setAccessToken(accessToken);

            const userInfo = await getCurrentUserRequest();
            login(normalizeUser(userInfo as never), accessToken);
            router.push('/');
        } catch (e: unknown) {
            console.error(e);

            if (axios.isAxiosError(e) && [400, 401, 403, 404, 422].includes(e.response?.status ?? 0)) {
                setError(t('auth.errorInvalidCredentials'));
            } else {
                setError(t('auth.errorLoginFailed'));
            }
        } finally {
            setLoading(false);
        }
    };


    const tr = (key: string) => (mounted ? t(key) : "");

    return (
        <div className="theme-page relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 md:px-10">
            <div className="theme-glow-1 pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full blur-3xl" />
            <div className="theme-glow-2 pointer-events-none absolute -bottom-24 right-6 h-48 w-48 rounded-full blur-2xl" />
            <div className="theme-stars pointer-events-none absolute inset-0" />
            <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col justify-center md:pr-10">
                <h1 className="text-3xl font-extrabold text-white leading-snug md:text-5xl max-w-xl">
                    {tr('auth.marketingHeadline')}
                    <span className="text-white/80"> {tr('auth.marketingBrand')}</span>
                </h1>

                <p className="mt-4 text-base text-white/70 md:mt-6 md:text-xl max-w-lg">
                    {tr('auth.marketingSubhead')}
                </p>
                </div>

            <Card
                className="
                    theme-card
                    w-full max-w-md
                    rounded-2xl
                    text-white
                "
            >
                <CardHeader className="pb-4">
                    <CardTitle className="text-center text-2xl font-semibold tracking-wide">
                        {tr('auth.loginTitle')}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                    {/* 이메일 */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm text-white/80">
                            {tr('auth.emailLabel')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={tr('auth.emailPlaceholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="
                                border border-white/30
                                bg-white/10
                                text-white
                                placeholder:text-white/60
                                focus-visible:ring-white
                                focus-visible:ring-1
                                focus-visible:border-white
                            "
                        />
                    </div>

                    {/* 비밀번호 */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm text-white/80">
                            {tr('auth.passwordLabel')}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder={tr('auth.passwordPlaceholder')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="
                                border border-white/30
                                bg-white/10
                                text-white
                                placeholder:text-white/60
                                focus-visible:ring-white
                                focus-visible:ring-1
                                focus-visible:border-white
                            "
                        />
                    </div>

                    {/* 에러 메시지 */}
                    {error && (
                        <Alert
                            variant="destructive"
                            className="w-full border-red-300 bg-red-500/20 text-red-100 px-4 py-2"
                        >
                            <AlertTitle className="font-bold">{t('auth.errorTitle')}</AlertTitle>
                            <p className="text-sm whitespace-nowrap">{error}</p>
                        </Alert>
                    )}

                    {/* 로그인 버튼 */}
                    <Button
                        className="theme-btn-primary mt-2 w-full rounded-xl font-semibold transition hover:brightness-110"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? tr('auth.loginLoading') : tr('auth.loginButton')}
                    </Button>

                    {/* 회원가입 링크 */}
                    <div className="mt-4 text-center text-sm text-white/80">
                        {tr('auth.noAccount')}{' '}
                        <a href="/signup" className="underline text-white">
                            {tr('auth.signupLink')}
                        </a>
                    </div>
                </CardContent>
            </Card>
            </div>
        </div>
    );
}
