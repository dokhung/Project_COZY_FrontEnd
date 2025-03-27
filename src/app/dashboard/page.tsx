'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import {getMyProjectInfoRequest} from '@/api/auth';
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    const router = useRouter();
    const { user, isLoggedIn } = useUserStore();
    const [hasProject, setHasProject] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        } else {
            // ✅ 유저의 프로젝트 존재 여부 확인
            const fetchProject = async () => {
                const data = await getMyProjectInfoRequest();
                if (data && data.projectName) {
                    setHasProject(true); // ✅ 프로젝트 있음
                } else {
                    setHasProject(false); // ❌ 프로젝트 없음
                }
                setLoading(false);
            };

            fetchProject();
        }
    }, [isLoggedIn]);

    if (loading) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <h1 className="text-3xl font-bold text-black-600">어서오세요 {user?.nickname || '사용자'}님!</h1>

            {hasProject ? (
                <p className="mt-2 text-green-700 text-center">✅ 이미 참여 중인 프로젝트가 있습니다.</p>
            ) : (
                <>
                    <p className="mt-2 text-gray-700 text-center">
                        아직 참여 중인 프로젝트가 없습니다.
                        <br />
                        새로운 프로젝트를 시작해보세요!
                    </p>
                    <div className="mt-6">
                        <Button
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => router.push('/createproject')}
                        >
                            새 프로젝트 생성
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
