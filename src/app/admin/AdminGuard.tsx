"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { t } = useTranslation();
    const { user, isHydrated } = useUserStore();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (!isHydrated) return;
        const isOperator = user?.role === "OPERATOR";
        if (!user) {
            router.replace("/login");
            return;
        }
        if (!isOperator) {
            router.replace("/");
            return;
        }
        setChecking(false);
    }, [isHydrated, user, router]);

    if (!isHydrated || checking) {
        return (
            <div className="theme-page relative min-h-screen px-4 pb-16 pt-28 md:px-8">
                <div className="theme-glow-1 pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full blur-3xl" />
                <div className="theme-glow-2 pointer-events-none absolute -bottom-24 right-6 h-48 w-48 rounded-full blur-2xl" />
                <div className="theme-stars pointer-events-none absolute inset-0" />
                <div className="relative z-10 mx-auto w-full max-w-3xl">
                    <div className="theme-card rounded-3xl p-6 text-white md:p-8">
                        <h1 className="text-xl font-semibold">{t("admin.guardTitle")}</h1>
                        <p className="mt-2 text-sm text-white/70">{t("admin.guardBody")}</p>
                        <div className="mt-4 flex items-center gap-2">
                            <Button asChild className="theme-btn-secondary">
                                <Link href="/login">{t("admin.loginCta")}</Link>
                            </Button>
                            <Button asChild className="theme-btn-secondary">
                                <Link href="/">{t("admin.backHome")}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
