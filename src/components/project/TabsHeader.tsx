'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { localizePath, stripUrlLocale } from '@/lib/locale-routing';
import { useLocaleStore } from '@/store/useLocalStore';

export default function TabsHeader({ projectName }: { projectName: string }) {
    const pathname = usePathname();
    const routePathname = stripUrlLocale(pathname);
    const locale = useLocaleStore((state) => state.locale);
    const base = `/project/${projectName}`;

    const tabs = [
        { label: 'Dashboard', path: 'dashboard' },
        { label: 'Task', path: 'task' },
        { label: 'Calendar', path: 'calendar' },
        { label: 'Chat', path: 'chat' },
        { label: 'Setting', path: 'setting' },
    ];

    return (
        <aside className="theme-card w-full md:w-40 py-4 md:py-6 px-4">
            <nav className="flex gap-2 md:flex-col md:gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                {tabs.map((tab) => {
                    const href = `${base}${tab.path ? `/${tab.path}` : ''}`;
                    const isActive = routePathname === href;

                    return (
                        <Link
                            key={tab.path}
                            href={localizePath(href, locale)}
                            className={cn(
                                'text-sm font-medium px-3 py-1.5 rounded text-center w-full md:w-auto whitespace-nowrap transition',
                                isActive
                                    ? 'bg-white/25 text-white font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.35)]'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                            )}
                        >
                            {tab.label}
                        </Link>

                    );
                })}
            </nav>
        </aside>
    );
}
