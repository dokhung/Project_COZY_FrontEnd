'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function TabsHeader({ projectName }: { projectName: string }) {
    const pathname = usePathname();
    const base = `/project/${projectName}`;

    const tabs = [
        { label: '보드', path: '' },
        { label: '타임라인', path: 'timeline' },
        { label: '캘린더', path: 'calendar' },
        { label: '파일', path: 'files' },
        { label: '설정', path: 'settings' },
    ];

    return (
        <div className="bg-white border-b border-gray-200 overflow-x-auto">
            <div className="flex gap-6 px-4 sm:px-10 pt-6 pb-3 min-w-fit whitespace-nowrap">
                {tabs.map((tab) => {
                    const href = `${base}${tab.path ? `/${tab.path}` : ''}`;
                    const isActive = pathname === href;

                    return (
                        <Link
                            key={tab.path}
                            href={href}
                            className={cn(
                                'text-sm font-medium pb-2 border-b-2',
                                isActive
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-400'
                            )}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
