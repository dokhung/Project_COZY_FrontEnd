'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import {Button} from "@/components/ui/button";

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <h1 className="text-3xl font-bold text-black-600">어서오세요 {user?.nickname || '사용자'}님!</h1>
            <p className="mt-2 text-gray-700 text-center">
                아직 참여 중인 프로젝트가 없습니다.
                <br />
                새로운 프로젝트를 시작해보세요!
            </p>

            <div className="mt-6">
                <Button
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => {
                        setTimeout(() => router.push('/createproject'), 500);
                    }}
                >
                    새 프로젝트 생성
                </Button>
            </div>
        </div>
    );
}
