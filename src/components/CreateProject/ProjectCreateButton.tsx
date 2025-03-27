'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {getMyProjectInfoRequest} from "@/api/auth";

export default function ProjectCreateButton() {
    const [hasProject, setHasProject] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkProject = async () => {
            try {
                const res = await getMyProjectInfoRequest();
                setHasProject(!!res?.projectName);
            } catch (e) {
                setHasProject(false);
            }
        };
        checkProject();
    }, []);

    const handleClick = () => {
        if (hasProject) {
            router.push('/project'); // 기존 프로젝트 페이지
        } else {
            router.push('/createproject'); // 새 프로젝트 생성
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
