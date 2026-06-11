'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTeamStore } from "@/store/teamStore";
import { getTeamJoinRequests } from "@/api/requests/joinRequest";
import { localizePath, stripUrlLocale } from "@/lib/locale-routing";
import { useLocaleStore } from "@/store/useLocalStore";

export default function TeamLayoutSideBar({ teamName }: { teamName: string }) {
    const { t } = useTranslation();
    const pathname = usePathname();
    const routePathname = stripUrlLocale(pathname);
    const locale = useLocaleStore((state) => state.locale);
    const [mounted, setMounted] = useState(false);
    const currentTeamId = useTeamStore((s) => s.currentTeamId);
    const [requestCount, setRequestCount] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!currentTeamId) return;
        let active = true;
        const fetchCount = async () => {
            try {
                const res = await getTeamJoinRequests(currentTeamId);
                const list =
                    res.data?.data?.requests ??
                    res.data?.requests ??
                    [];
                if (active) setRequestCount(Array.isArray(list) ? list.length : 0);
            } catch {
                if (active) setRequestCount(0);
            }
        };
        fetchCount();
        const timer = setInterval(fetchCount, 30000);
        return () => {
            active = false;
            clearInterval(timer);
        };
    }, [currentTeamId]);

    const base = `/team/${teamName}`;

    const tabs = [
        { labelKey: 'team.sidebarDashboard', path: 'dashboard' },
        { labelKey: 'team.sidebarNotice', path: 'notice' },
        { labelKey: 'team.sidebarBoard', path: 'board' },
        { labelKey: 'chat.sidebar', path: 'chat' },
        { labelKey: 'team.sidebarMembers', path: 'team-userlist' },
        { labelKey: 'team.sidebarProjects', path: 'project-list' },
        { labelKey: 'team.sidebarSettings', path: 'team-setting' },
        { labelKey: 'team.sidebarRequests', path: 'team-request' },
    ];

    return (
        <aside className="theme-card relative w-full md:w-56 px-4 py-4 md:py-6 shadow-[0_18px_40px_rgba(15,23,42,0.35)]">
            <div className="mb-6 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                {t('team.sidebarTitle', { defaultValue: 'TEAM' })}
            </div>
            <nav className="flex gap-2 md:flex-col md:gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                {tabs.map((tab) => {
                    const href = `${base}/${tab.path}`;

                    // ⭐ 핵심: mounted 이후에만 active 계산
                    const isActive =
                        mounted && routePathname.startsWith(href);

                    return (
                        <Link
                            key={tab.path}
                            href={localizePath(href, locale)}
                            className={cn(
                                'text-sm px-3 py-2 rounded-lg text-center w-full md:w-auto whitespace-nowrap transition duration-200',
                                isActive
                                    ? 'bg-white/25 text-white font-semibold shadow-[0_12px_26px_rgba(0,0,0,0.35)] ring-1 ring-white/30'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                            )}
                        >
                            <span suppressHydrationWarning className="inline-flex items-center gap-2">
                                {mounted ? t(tab.labelKey) : ''}
                                {tab.path === 'team-request' && requestCount > 0 && (
                                    <span className="ml-1 inline-flex min-w-6 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                                        {requestCount}
                                    </span>
                                )}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
