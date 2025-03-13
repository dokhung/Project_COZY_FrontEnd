'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export default function Dashboard() {
    const router = useRouter();
    const { user, isLoggedIn } = useUserStore();

    // 로그인되지 않은 사용자는 로그인 페이지로 리디렉트
    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold">🚀 대시보드</h1>
            <p className="mt-2 text-gray-600">현재 로그인된 사용자: {user?.nickname || '알 수 없음'}</p>

            {/* 추후 기능 추가할 자리 */}
            <div className="mt-6 p-4 bg-white shadow-md rounded-md">
                <p className="text-gray-700">여기에 원하는 기능을 추가하세요.</p>
            </div>
        </div>
    );
}
