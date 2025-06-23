'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function TabsHeader({ projectName }: { projectName: string }) {
    const pathname = usePathname();
    const base = `/project/${projectName}`;

    const tabs = [
        { label: '대쉬보드', path: 'dashboard' },
        { label: '계획', path: 'plan' },
        { label: '캘린더', path: 'calendar' },
    ];

    return (
        <aside className="w-40 bg-white border-r border-gray-200 py-6 px-4">
            <nav className="flex flex-col gap-4">
                {tabs.map((tab) => {
                    const href = `${base}${tab.path ? `/${tab.path}` : ''}`;
                    const isActive = pathname === href;

                    return (
                        <Link
                            key={tab.path}
                            href={href}
                            className={cn(
                                'text-sm font-medium px-2 py-1.5 rounded text-center w-full',
                                isActive
                                    ? 'bg-blue-100 text-blue-700 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
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
