'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/userStore';
import {getMyProjectInfoRequest} from "@/api/requests/project";

export default function ProjectCreateButton() {
    const { isLoggedIn } = useUserStore();
    const router = useRouter();
    const [projectName, setProjectName] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoggedIn) return;

        const checkProject = async () => {
            try {
                const res = await getMyProjectInfoRequest();
                if (res?.projectName) {
                    setProjectName(res.projectName);
                } else {
                    setProjectName(null);
                }
            } catch (e) {
                setProjectName(null);
            }
        };
        checkProject();
    }, [isLoggedIn]);


    if (!isLoggedIn) return null;

    const handleClick = () => {
        if (projectName) {
            router.push(`/project/${projectName}/dashboard`);
        } else {
            router.push('/createproject');
        }
    };


    return (
        <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
            onClick={handleClick}
        >
            {projectName ? '내 프로젝트로 이동' : '새 프로젝트 생성'}
        </Button>

    );
}
