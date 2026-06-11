'use client';

import { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import Image from 'next/image';
import {Locale, LOCALE} from "@/enum/locale";
import {useTranslation} from "react-i18next";
import { resolveProfileImageUrl } from "@/utils/resolveProfileImageUrl";
import { localizePath, normalizeLocale } from "@/lib/locale-routing";
import { changeLanguage } from "@/lib/changeLanguage";

export default function AvatarMenu() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { isLoggedIn, user, logout } = useUserStore();
    const isOperator = user?.role === "OPERATOR";
    const [isOpen, setIsOpen] = useState(false);
    const {t, i18n} = useTranslation();
    const locale = normalizeLocale(i18n.resolvedLanguage ?? i18n.language);

    const cycleLanguage = () => {
        const order: Locale[] = [LOCALE.EN, LOCALE.KO, LOCALE.JA];
        const currentIndex = order.indexOf(locale);
        const nextIndex = (currentIndex + 1) % order.length;
        const nextLocale = order[nextIndex];

        const query = searchParams.toString();
        changeLanguage(nextLocale, pathname, query ? `?${query}` : "");
    };

    const languageLabel =
        locale === LOCALE.KO
            ? t("locale.korean")
            : locale === LOCALE.EN
                ? t("locale.english")
                : t("locale.japanese");

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
        router.push(localizePath('/login', locale));
    };

    const profileImageSrc = resolveProfileImageUrl(user?.profileImage);

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                {isLoggedIn && user ? (
                    <div className="flex items-center space-x-3 cursor-pointer">
                        <Button variant='ghost' size='icon' className='rounded-full'>
                            <Avatar className='h-8 w-8'>
                                {profileImageSrc ? (
                                    <Image src={profileImageSrc} alt={t('auth.profileImageLabel')} width={32} height={32} className="rounded-full object-cover" />
                                ) : (
                                    <AvatarFallback className="bg-white/20 text-lg font-bold text-white">
                                        {user?.nickname?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                        </Button>
                        <span className="text-white/90 font-medium text-sm md:text-base">
                            {t('header.welcome', { name: user?.nickname })}
                        </span>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        className="px-4 py-2 rounded-full border border-white/70 bg-white/10 text-white font-semibold hover:bg-white/20 transition"
                        onClick={() => router.push(localizePath('/login', locale))}
                    >
                        {t('auth.loginButton')}
                    </Button>
                )}
            </DropdownMenuTrigger>

            {isLoggedIn && user && (
                <DropdownMenuContent
                    align='end'
                    className="theme-card w-72 rounded-xl p-4 text-white"
                    onPointerDownOutside={() => setIsOpen(false)}
                >
                    <div className="flex flex-col items-center">
                        <Avatar className="h-16 w-16 mb-2">
                            {profileImageSrc ? (
                                <Image src={profileImageSrc} alt={t('auth.profileImageLabel')} width={64} height={64} className="rounded-full object-cover" />
                            ) : (
                                <AvatarFallback className="bg-white/20 text-lg font-bold text-white">
                                    {user?.nickname?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <span className="font-semibold text-lg text-white">{user?.nickname}</span>
                        <span className="text-sm text-white/60">
                            {user?.statusMessage || t('header.statusPlaceholder')}
                        </span>
                    </div>

                    <div className="my-3 border-t border-white/20"/>

                    <div className="grid grid-cols-2 gap-3">
                        {isOperator && (
                            <DropdownMenuItem asChild>
                                <Link
                                    href={localizePath('/admin', locale)}
                                    className="theme-btn-primary flex items-center justify-center rounded-lg p-3 font-semibold transition hover:brightness-110"
                                >
                                    {t("menu.admin")}
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                            <Link href={localizePath('/myinfo', locale)}
                                  className="theme-btn-secondary flex items-center justify-center rounded-lg p-3 font-semibold transition hover:brightness-110">
                                {t("menu.myinfo")}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={localizePath('/settings', locale)}
                                  className="theme-btn-secondary flex items-center justify-center rounded-lg p-3 font-semibold text-white transition hover:brightness-110">
                                {t("menu.settings")}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={handleLogout}
                            className="theme-btn-secondary flex items-center justify-center rounded-lg p-3 font-semibold text-white transition hover:brightness-110"
                        >
                            {t("menu.logout")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                cycleLanguage();
                            }}
                            className={"theme-btn-secondary flex flex-col items-center justify-center rounded-lg font-semibold transition hover:brightness-110"}>
                            <span className={"text-sm"}>{t('menu.language')}</span>
                            <span className={"text-xs text-white/60"}>
                                {languageLabel}
                            </span>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            )}
        </DropdownMenu>
    );
}
