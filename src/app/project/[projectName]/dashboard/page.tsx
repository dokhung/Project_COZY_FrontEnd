'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProjectDashBoard from '@/components/project/ProjectDashBoard';
import { getProjectByNameRequest } from "@/api/requests/project";
import { useProjectStore } from "@/store/projectStore";

export default function ProjectBoardPage() {
    const [project, setProject] = useState<any>(null);
    const { setCurrentProjectId } = useProjectStore();
    const params = useParams();

    useEffect(() => {
        const fetchProject = async () => {
            const data = await getProjectByNameRequest(params.projectName as string);
            setProject(data);
            if (data?.projectId) setCurrentProjectId(data.projectId);
        };
        if (params.projectName) fetchProject();
    }, [params.projectName, setCurrentProjectId]);

    if (!project) return <div className="p-10">로딩 중...</div>;
    return <ProjectDashBoard />;
}
