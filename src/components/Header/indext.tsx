'use client';

import Link from 'next/link';
import AvatarMenu from './AvatarMenu';
import Image from 'next/image';
import {useTranslation} from "react-i18next";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useUserStore } from "@/store/userStore";
import { localizePath, normalizeLocale } from "@/lib/locale-routing";
import { Globe2 } from "lucide-react";

export default function Header() {
    const { t, i18n } = useTranslation();
    const { initTheme } = useThemeStore();
    const user = useUserStore((s) => s.user);
    const locale = normalizeLocale(i18n.resolvedLanguage ?? i18n.language);
    const [open, setOpen] = useState(false);
    const isOperator = user?.role === "OPERATOR";

    useEffect(() => {
        initTheme();
    }, [initTheme]);

    return (
        <header
            className="
                fixed top-0 z-20 w-full
                theme-header
                backdrop-blur-xl
                border-white/20
    "
        >
            <div className="h-16 flex items-center justify-between px-4 md:px-6">

                <div className="flex items-center space-x-4">
                    <Link href={localizePath("/", locale)} className="flex items-center space-x-2">
                        <Image src="/logo/LogiImg.svg" width={40} height={40} alt="logo" />
                        <span className="font-bold text-white drop-shadow-md">COZY</span>
                    </Link>

                    <nav className="hidden md:flex gap-1">
                        <Link
                            href={localizePath("/feature", locale)}
                            className="
                                px-3 py-1 rounded-lg text-sm
                                font-semibold text-white/90
                                hover:bg-white/10
                                drop-shadow
                    "
                        >
                            {t("nav.feature")}
                        </Link>

                        <Link
                            href={localizePath("/recruit", locale)}
                            className="
                                px-3 py-1 rounded-lg text-sm
                                font-semibold text-white/90
                                hover:bg-white/10
                                drop-shadow
                    "
                        >
                            {t("nav.recruit")}
                        </Link>

                        <Link
                            href={localizePath("/help", locale)}
                            className="
                                px-3 py-1 rounded-lg text-sm
                                font-semibold text-white/90
                                hover:bg-white/10
                                drop-shadow
                    "
                        >
                            {t("nav.help")}
                        </Link>
                        {isOperator && (
                            <Link
                                href={localizePath("/admin", locale)}
                                className="
                                    px-3 py-1 rounded-lg text-sm
                                    font-semibold text-white/90
                                    hover:bg-white/10
                                    drop-shadow
                        "
                            >
                                {t("nav.admin")}
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    {user && (
                        <Link
                            href={localizePath("/community-world", locale)}
                            className="
                                hidden items-center gap-2 rounded-full border border-cyan-200/40
                                bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-white
                                shadow-[0_0_24px_rgba(34,211,238,0.12)]
                                transition hover:border-cyan-100/70 hover:bg-cyan-200/20 md:flex
                            "
                        >
                            <Globe2 className="h-4 w-4" />
                            {t("nav.communityWorld")}
                        </Link>
                    )}
                    <button
                        className="md:hidden rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 transition hover:bg-white/20"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        {open ? t('common.close') : t('common.menu')}
                    </button>
                    <AvatarMenu />
                </div>
            </div>
            {open && (
                <div className="md:hidden border-t border-white/10 px-4 pb-4 pt-2">
                    <nav className="flex flex-col gap-2">
                        {user && (
                            <Link
                                href={localizePath("/community-world", locale)}
                                className="flex items-center gap-2 rounded-lg border border-cyan-200/30 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-200/20"
                                onClick={() => setOpen(false)}
                            >
                                <Globe2 className="h-4 w-4" />
                                {t("nav.communityWorld")}
                            </Link>
                        )}
                        <Link
                            href={localizePath("/feature", locale)}
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
                            onClick={() => setOpen(false)}
                        >
                            {t("nav.feature")}
                        </Link>
                        <Link
                            href={localizePath("/recruit", locale)}
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
                            onClick={() => setOpen(false)}
                        >
                            {t("nav.recruit")}
                        </Link>
                        <Link
                            href={localizePath("/help", locale)}
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
                            onClick={() => setOpen(false)}
                        >
                            {t("nav.help")}
                        </Link>
                        {isOperator && (
                            <Link
                                href={localizePath("/admin", locale)}
                                className="rounded-lg px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
                                onClick={() => setOpen(false)}
                            >
                                {t("nav.admin")}
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>

    );
}
