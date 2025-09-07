'use client';

import { useEffect, useState } from 'react';
import { getTaskListRequest } from "@/api/requests/task";
import TaskDetailDialog from "@/components/task/TaskDetilDialog";
import {useParams} from "next/navigation";
import {useProjectStore} from "@/store/projectStore";

const columns = ['시작 전', '진행 중', '검토 중', '승인 중', '머지 신청', '머지 완료'];

export default function ProjectDashBoard() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const params = useParams();
    const projectName = params.projectName;
    const { currentProjectId } = useProjectStore();

    useEffect(() => {
        console.log("currentProjectId :: ", currentProjectId);
        const fetchTasks = async () => {
            try {
                const data = await getTaskListRequest(currentProjectId);
                setTasks(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <h1 className="mb-8 text-3xl font-extrabold text-blue-900">
                {projectName}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {columns.map((status) => {
                    const list = Array.isArray(tasks) ? tasks : [];
                    const statusTasks = list.filter((task) => task.status === status);
                    return (
                        <div
                            key={status}
                            className="flex flex-col gap-2 rounded-xl bg-gray-50 border border-gray-200 shadow-sm"
                        >
                            <div className="bg-white border-b border-gray-300 py-2 text-center font-bold text-gray-700">
                                {status}
                            </div>
                            <div className="bg-white min-h-48 flex flex-col gap-2 p-3">
                                {isLoading ? (
                                    <div className="text-center text-gray-500 text-sm">로딩 중...</div>
                                ) : statusTasks.length === 0 ? (
                                    <div className="text-center text-gray-400 text-sm">작업 없음</div>
                                ) : (
                                    statusTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="border border-gray-200 rounded-lg p-3 shadow-sm bg-white cursor-pointer"
                                            onClick={() => setSelectedTaskId(task.id)}
                                        >
                                            <div className="text-sm font-semibold text-gray-800 truncate">{task.title}</div>
                                            <div className="text-xs text-gray-500">{task.nickName}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedTaskId && (
                <TaskDetailDialog
                    taskId={selectedTaskId}
                    onClose={() => setSelectedTaskId(null)}
                    onDeleted={async () => {
                        setIsLoading(true);
                        const data = await getTaskListRequest(currentProjectId);
                        setTasks(data);
                        setIsLoading(false);
                        setSelectedTaskId(null);
                    }}
                    onUpdated={async () => {
                        setIsLoading(true);
                        const data = await getTaskListRequest(currentProjectId);
                        setTasks(data);
                        setIsLoading(false);
                    }}
                />
            )}
        </div>
    );
}
