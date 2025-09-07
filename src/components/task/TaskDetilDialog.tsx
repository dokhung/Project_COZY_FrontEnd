// src/components/task/TaskDetailDialog.tsx
'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getTaskDetailRequest } from "@/api/requests/task";

interface Props {
    taskId: number;      // ← 상세조회는 id 사용
    onClose: () => void;
    onDeleted?: () => void;
    onUpdated?: () => void;
}

type TaskDetail = {
    id: number;
    title: string;
    nickName: string;    // ← 서버 키와 일치
    createdAt: string;
    planText: string;
    status?: string;
};

export default function TaskDetailDialog({ taskId, onClose }: Props) {
    const [loading, setLoading] = useState(true);
    const [task, setTask] = useState<TaskDetail | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await getTaskDetailRequest(taskId);
                setTask(data);
                console.log("task detail:", JSON.stringify(data, null, 2));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        if (taskId) fetchTask();
    }, [taskId]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow">로딩 중...</div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow">
                    <div>게시글을 불러오지 못했습니다.</div>
                    <Button onClick={onClose} className="mt-4">닫기</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow max-w-xl w-full">
                <h2 className="text-2xl font-bold text-center mb-4">{task.title}</h2>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <div>작성자 : {task.nickName}</div>
                    <div>{task.createdAt?.split('T')[0]}</div>
                </div>
                <div className="text-center whitespace-pre-wrap text-gray-800">
                    {task.planText}
                </div>
                <div className="mt-6 text-right">
                    <Button onClick={onClose}>닫기</Button>
                </div>
            </div>
        </div>
    );
}
