'use client';

import { useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getMyProjectInfoRequest } from '@/api/auth';

const ProjectList = () => {
    const { projects, addProject } = useProjectStore();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getMyProjectInfoRequest();

                console.log("✅ 프로젝트 API 응답", data);

                const projectId = data.projectId;
                const projectName = data.projectName;

                // 중복 방지 후 추가
                if (
                    projectId &&
                    projectName &&
                    !projects.some((p) => p.id === projectId)
                ) {
                    addProject({
                        id: projectId,
                        name: projectName,
                        description: "", // 필요시 추가
                    });
                }
            } catch (error) {
                console.error("❌ 프로젝트 불러오기 실패", error);
            }
        };

        fetchProjects();
    }, [addProject, projects]);


    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-3/5 mb-6 text-center"
        >
            {projects.length === 0 ? (
                <div className="flex flex-col items-center space-y-3 p-6 bg-gray-100 rounded-lg shadow-md">
                    <p className="text-lg font-semibold text-gray-600">
                        현재 참여 중인 프로젝트가 없습니다.
                    </p>
                    <p className="text-sm text-gray-500">
                        새로운 프로젝트를 시작하거나 참여해보세요!
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-lg font-semibold text-gray-700">참여 중인 프로젝트</p>
                    <ul className="space-y-3">
                        {projects.map((project) => (
                            <li
                                key={`${project.id}-${project.name}`} // ✅ 안전한 유니크 키
                                className="flex justify-between items-center p-4 bg-white border rounded-lg shadow"
                            >
                                <div className="text-left">
                                    <p className="text-md font-semibold text-black">{project.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {project.description || '설명이 없습니다.'}
                                    </p>
                                </div>
                                <Button variant="default" size="sm" asChild>
                                    <Link href={`/project/${project.name}`}>참가하기</Link>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.div>
    );
};

export default ProjectList;
