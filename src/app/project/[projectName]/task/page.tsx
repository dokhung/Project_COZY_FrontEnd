'use client';

import {useEffect, useState} from 'react';
import {getTaskListRequest} from '@/api/requests/task';
import TaskDetailDialog from '@/components/task/TaskDetilDialog';
import TaskCreateDialog from '@/components/task/TaskCreateDialog';
import {useProjectStore} from '@/store/projectStore';
import {getMyProjectInfoRequest} from '@/api/requests/project';
import TaskTable, {Task} from "@/components/task/TaskTable";
import {router} from "next/client";

export default function TaskPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const {currentProjectId, setCurrentProjectId} = useProjectStore();

    useEffect(() => {
        const fetchProject = async () => {
            const info = await getMyProjectInfoRequest();
            if (info?.projectId) {
                setCurrentProjectId(info.projectId);
            } else {
                router.push('/project/create');
            }
        };
        fetchProject();
    }, []);


    const reload = async () => {
        if (!currentProjectId) return;
        try {
            setLoading(true);
            const list = await getTaskListRequest(currentProjectId);
            setTasks(list ?? []);
        } catch (e) {
            console.error('Task 불러오기 실패', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentProjectId) reload();
    }, [currentProjectId]);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-screen-xl px-6 py-8">
                <TaskTable
                    tasks={tasks}
                    loading={loading}
                    onRowClick={(id) => setSelectedTaskId(id)}
                    onAddClick={() => setIsCreateOpen(true)}
                />
            </div>

            {isCreateOpen && currentProjectId && (
                <TaskCreateDialog
                    projectId={currentProjectId}
                    onClose={() => setIsCreateOpen(false)}
                    onSuccess={async () => {
                        await reload();
                        setIsCreateOpen(false);
                    }}
                />
            )}
            
            {selectedTaskId && (
                <TaskDetailDialog
                    taskId={selectedTaskId}
                    onClose={() => setSelectedTaskId(null)}
                />
            )}
        </div>
    );
}
