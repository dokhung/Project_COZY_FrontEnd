'use client';

import React, { useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useUserStore } from '@/store/userStore';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getMyProjectInfoRequest } from '@/api/requests/project';
import { useRouter } from 'next/navigation';
import { User, Info, FolderKanban } from 'lucide-react';

export const ProjectList = () => {
    const { isLoggedIn } = useUserStore();
    const { projects, addProject } = useProjectStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) return;

        (async () => {
            const data = await getMyProjectInfoRequest();
            const { projectId, projectName, description, leader } = data || {};
            if (projectId && projectName && !projects.some((p) => p.id === projectId)) {
                addProject({
                    id: projectId,
                    name: projectName,
                    description: description ?? '',
                    leader: leader ?? '',
                });
            }
        })();
    }, [addProject, projects, isLoggedIn]);

    if (!isLoggedIn) return null;

    const handleJoin = (_publicId: string, name: string) => {
        router.push(`/project/${encodeURIComponent(name)}/dashboard`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto w-full max-w-3xl px-4 mb-10"
        >
            {projects.length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-white/70 backdrop-blur p-8 text-center shadow-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                        <FolderKanban className="h-6 w-6" />
                    </div>
                    <p className="text-lg font-semibold text-slate-800">You are not in any projects yet</p>
                    <p className="mt-1 text-sm text-slate-500">Create a project and invite teammates.</p>
                    <Button asChild className="mt-5 rounded-xl">
                        <Link href="/createproject">Create New Project</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-5">
                    <div className="text-center">
                        <p className="text-sm tracking-wide text-slate-500">Participating</p>
                        <h2 className="text-xl font-semibold text-slate-900">Projects You Are Involved In</h2>
                    </div>

                    <ul className="space-y-4">
                        {projects.map((project) => (
                            <motion.li
                                key={`${project.id}-${project.name}`}
                                whileHover={{ y: -2 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="group relative flex items-center justify-between overflow-hidden rounded-2xl border bg-white/80 backdrop-blur shadow-sm transition hover:shadow-lg"
                            >
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500" />

                                <div className="p-5 text-left">
                                    <div className="flex items-center gap-2">
                                        <FolderKanban className="h-4 w-4 text-slate-500" />
                                        <p className="truncate text-base font-semibold text-slate-900">
                                            ProjectName : {project.name}
                                        </p>
                                    </div>

                                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                        <User className="h-4 w-4" />
                                        <span className="truncate">Leader : {project.leader || '-'}</span>
                                    </div>

                                    <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                                        <Info className="mt-0.5 h-4 w-4 shrink-0" />
                                        <p className="line-clamp-2">
                                            {project.description
                                                ? `description : ${project.description}`
                                                : 'No description provided.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="pr-5">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleJoin(String(project.id), project.name)}
                                        className="rounded-xl px-6 py-2 text-sm font-medium text-white shadow-sm transition
                                                   bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 focus:outline-none
                                                   focus-visible:ring-2 focus-visible:ring-blue-500"
                                    >
                                        Join
                                    </motion.button>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.div>
    );
};
