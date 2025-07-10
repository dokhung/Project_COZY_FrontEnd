'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProjectDashBoard from '@/components/project/ProjectDashBoard';
import {getProjectByNameRequest} from "@/api/requests/project";

export default function ProjectBoardPage() {
    const [project, setProject] = useState<any>(null);
    const params = useParams();

    useEffect(() => {
        const fetchProject = async () => {
                const data = await getProjectByNameRequest(params.projectName as string);
                setProject(data);
        };

        if (params.projectName){
            fetchProject();
        }
    }, [params.projectName]);

    if (!project) return <div className="p-10">로딩 중...</div>;

    return <ProjectDashBoard/>;
}
