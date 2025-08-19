'use client';

import { useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useUserStore } from '@/store/userStore';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {getMyProjectInfoRequest} from "@/api/requests/project";
export const ProjectList = () => {
    const { isLoggedIn } = useUserStore();
    const { projects, addProject } = useProjectStore();

    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchProjects = async () => {
            const data = await getMyProjectInfoRequest();
            console.log(" 프로젝트 API 응답", data);

            const { projectId, projectName } = data;

            if (projectId && projectName && !projects.some((p) => p.id === projectId)) {
                addProject({ id: projectId, name: projectName, description: "" });
            }
        };

        fetchProjects();
    }, [addProject, projects, isLoggedIn]);

    if (!isLoggedIn) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-3/5 mb-6 text-center"
        >
            {projects.length === 0 ? (
                <div className="flex flex-col items-center space-y-4 p-6 bg-gray-100 rounded-lg shadow-md">
                    <p className="text-lg font-semibold text-gray-600">
                        현재 참여 중인 프로젝트가 없습니다.
                    </p>
                    <Button asChild className="mt-2">
                        <Link href="/createproject">새 프로젝트 만들기</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-lg font-semibold text-gray-700">참여 중인 프로젝트</p>
                    <ul className="space-y-3">
                        {projects.map((project) => (
                            <li
                                key={`${project.id}-${project.name}`}
                                className="flex justify-between items-center p-4 bg-white border rounded-lg shadow"
                            >
                                <div className="text-left">
                                    <p className="text-md font-semibold text-black">{project.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {project.description || '소개글이 없습니다.'}
                                    </p>
                                </div>
                                <Button variant="default" size="sm" asChild>
                                    <Link href={`/project/${project.name}/dashboard`}>참가하기</Link>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.div>
    );
};

// export default ProjectList;