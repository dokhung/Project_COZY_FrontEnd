'use client';

import { useEffect, useState } from 'react';
import { getProjectByNameRequest } from '@/api/auth';
import { useParams } from 'next/navigation';
import ProjectBoard from '@/components/project/ProjectBoard';

export default function ProjectBoardPage() {
    const [project, setProject] = useState<any>(null);
    const params = useParams();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProjectByNameRequest(params.projectName as string);
                setProject(data);
            } catch (e) {
                console.error('❌ 프로젝트 정보를 가져오지 못했습니다:', e);
            }
        };

        if (params.projectName){
            fetchProject();
        }
    }, [params.projectName]);

    if (!project) return <div className="p-10">로딩 중...</div>;

    return <ProjectBoard project={project} />;
}
