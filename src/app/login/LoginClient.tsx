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
import { findEmailRequest, loginRequest, resetPasswordRequest } from '@/api/requests/login';
import { getCurrentUserRequest } from '@/api/requests/info';
import { normalizeUser } from "@/utils/normalizeUser";
import axios from "axios";
import { useTranslation } from "react-i18next";

type RecoveryMode = 'login' | 'findEmail' | 'resetPassword';

export default function LoginClient() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [recoveryMode, setRecoveryMode] = useState<RecoveryMode>('login');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
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
        setMessage('');
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

    const handleFindEmail = async () => {
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const { email: foundEmail } = await findEmailRequest(nickname);
            setMessage(t('auth.findEmailSuccess', { email: foundEmail }));
        } catch (e: unknown) {
            console.error(e);
            setError(t('auth.findEmailFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await resetPasswordRequest(email, nickname, newPassword, confirmPassword);
            setMessage(t('auth.resetPasswordSuccess'));
            setPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setRecoveryMode('login');
        } catch (e: unknown) {
            console.error(e);

            if (axios.isAxiosError(e) && e.response?.status === 422) {
                setError(t('auth.resetPasswordInvalid'));
            } else {
                setError(t('auth.resetPasswordFailed'));
            }
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (mode: RecoveryMode) => {
        setRecoveryMode(mode);
        setError('');
        setMessage('');
        setLoading(false);
    };

    const handleSubmit = () => {
        if (recoveryMode === 'findEmail') {
            void handleFindEmail();
            return;
        }

        if (recoveryMode === 'resetPassword') {
            void handleResetPassword();
            return;
        }

        void handleLogin();
    };

    const titleKey = recoveryMode === 'findEmail'
        ? 'auth.findEmailTitle'
        : recoveryMode === 'resetPassword'
            ? 'auth.resetPasswordTitle'
            : 'auth.loginTitle';

    const buttonKey = recoveryMode === 'findEmail'
        ? 'auth.findEmailButton'
        : recoveryMode === 'resetPassword'
            ? 'auth.resetPasswordButton'
            : 'auth.loginButton';

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
                        {tr(titleKey)}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                    {recoveryMode !== 'findEmail' && (
                        <Field
                            id="email"
                            type="email"
                            label={tr('auth.emailLabel')}
                            placeholder={tr('auth.emailPlaceholder')}
                            value={email}
                            onChange={setEmail}
                        />
                    )}

                    {recoveryMode === 'login' && (
                        <Field
                            id="password"
                            type="password"
                            label={tr('auth.passwordLabel')}
                            placeholder={tr('auth.passwordPlaceholder')}
                            value={password}
                            onChange={setPassword}
                        />
                    )}

                    {recoveryMode !== 'login' && (
                        <Field
                            id="nickname"
                            type="text"
                            label={tr('auth.nicknameLabel')}
                            placeholder={tr('auth.nicknamePlaceholder')}
                            value={nickname}
                            onChange={setNickname}
                        />
                    )}

                    {recoveryMode === 'resetPassword' && (
                        <>
                            <Field
                                id="newPassword"
                                type="password"
                                label={tr('auth.newPasswordLabel')}
                                placeholder={tr('auth.newPasswordPlaceholder')}
                                value={newPassword}
                                onChange={setNewPassword}
                            />
                            <Field
                                id="confirmPassword"
                                type="password"
                                label={tr('auth.confirmPasswordLabel')}
                                placeholder={tr('auth.confirmPasswordPlaceholder')}
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                            />
                        </>
                    )}

                    {message && (
                        <Alert className="w-full border-cyan-200 bg-cyan-500/20 px-4 py-2 text-cyan-50">
                            <AlertTitle className="font-bold">{tr('auth.noticeTitle')}</AlertTitle>
                            <p className="text-sm">{message}</p>
                        </Alert>
                    )}

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
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? tr('auth.loginLoading') : tr(buttonKey)}
                    </Button>

                    <div className="flex items-center justify-center gap-4 text-sm text-white/80">
                        <button
                            type="button"
                            className="underline underline-offset-4 transition hover:text-white"
                            onClick={() => switchMode('findEmail')}
                        >
                            {tr('auth.findEmailLink')}
                        </button>
                        <button
                            type="button"
                            className="underline underline-offset-4 transition hover:text-white"
                            onClick={() => switchMode('resetPassword')}
                        >
                            {tr('auth.resetPasswordLink')}
                        </button>
                    </div>

                    {/* 회원가입 링크 */}
                    <div className="mt-4 text-center text-sm text-white/80">
                        {recoveryMode === 'login' ? (
                            <>
                                {tr('auth.noAccount')}{' '}
                                <a href="/signup" className="underline text-white">
                                    {tr('auth.signupLink')}
                                </a>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="underline text-white"
                                onClick={() => switchMode('login')}
                            >
                                {tr('auth.backToLogin')}
                            </button>
                        )}
                    </div>
                </CardContent>
            </Card>
            </div>
        </div>
    );
}

function Field({
    id,
    type,
    label,
    placeholder,
    value,
    onChange,
}: {
    id: string;
    type: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm text-white/80">
                {label}
            </Label>
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
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
    );
}
