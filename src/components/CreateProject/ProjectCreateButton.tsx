'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getMyProjectInfoRequest } from "@/api/auth";
import { useUserStore } from '@/store/userStore'; // ✅ 로그인 상태 불러오기

export default function ProjectCreateButton() {
    const { isLoggedIn } = useUserStore(); // ✅ 로그인 여부 확인
    const [hasProject, setHasProject] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) return; // ✅ 로그인 안 되어 있으면 호출 중단

        const checkProject = async () => {
            try {
                const res = await getMyProjectInfoRequest();
                setHasProject(!!res?.projectName);
            } catch (e) {
                setHasProject(false);
            }
        };
        checkProject();
    }, [isLoggedIn]);

    if (!isLoggedIn) return null; // ✅ 비로그인 상태에서는 버튼 자체 숨김

    const handleClick = () => {
        if (hasProject) {
            router.push(`/project/${encodeURIComponent(hasProject)}`);
        } else {
            router.push('/createproject');
        }
    };

    return (
        <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
            onClick={handleClick}
        >
            {hasProject ? '내 프로젝트로 이동' : '새 프로젝트 생성'}
        </Button>
    );
}
