// components/plan/PlanCreateDialog.tsx
'use client';

import { useState } from 'react';
import { useUserStore } from "@/store/userStore";
import LoginRequiredDialog from "@/components/public/LoginRequireDialog";
import { createPlanRequest } from "@/api/requests/plan";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
    projectId: number; // 반드시 전달받아야 함
}

export default function PlanCreateDialog({ onClose, onSuccess, projectId }: Props) {
    const { user } = useUserStore();
    const [title, setTitle] = useState('');
    const [date] = useState(new Date().toISOString().split('T')[0]);
    const [planText, setPlanText] = useState('');
    const [status, setStatus] = useState('Not Started');
    const [isClosing, setIsClosing] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => onClose(), 300);
    };

    const handleSubmit = async () => {
        try {
            if (!Number.isFinite(projectId) || projectId <= 0) {
                alert("유효하지 않은 projectId 입니다.");
                return;
            }

            const statusMap: Record<string, string> = {
                "Not Started": "시작 전",
                "In Progress": "진행 중",
                "Under Review": "검토 중",
                "Pending Approval": "승인 중",
                "Merge Requested": "머지 신청",
                "Merge Completed": "머지 완료",
            };
            const backendStatus = statusMap[status] ?? status;

            const planDto = {
                nickname: user?.nickname ?? "",
                title,
                status: backendStatus,
                planText,
                projectId: Number(projectId),
            };

            await createPlanRequest(planDto);
            onSuccess();
            handleClose();
        } catch (error: any) {
            if (error?.response?.status === 401) {
                setShowLoginDialog(true);
            } else {
                console.error("Error:", error);
                alert(error?.response?.data?.message || "An error occurred.");
            }
        }
    };

    return (
        <>
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
                <div className={`bg-white w-[600px] px-8 py-6 shadow-xl rounded-md transform transition-all duration-300 ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                    <h2 className="text-lg font-semibold mb-1">Create Plan</h2>
                    <hr className="mb-6 border-t" />
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <label className="w-20 text-sm font-semibold">Name</label>
                            <div className="bg-gray-100 text-sm px-4 py-2 rounded w-80 border border-gray-300">
                                {user?.nickname ?? ''}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-20 text-sm font-semibold">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-80 px-3 py-2 rounded text-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-20 text-sm font-semibold">Date</label>
                            <div className="bg-gray-100 text-sm px-4 py-2 rounded w-80 border border-gray-300">
                                {date}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-20 text-sm font-semibold">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-80 px-3 py-2 rounded text-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Pending Approval">Pending Approval</option>
                                <option value="Merge Requested">Merge Requested</option>
                                <option value="Merge Completed">Merge Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-semibold">Content</label>
                            <textarea
                                rows={10}
                                value={planText}
                                onChange={(e) => setPlanText(e.target.value)}
                                className="w-full resize-none p-3 rounded text-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button onClick={handleSubmit} className="bg-blue-500 text-white text-sm px-5 py-2 rounded hover:bg-blue-600">Submit</button>
                        <button onClick={handleClose} className="bg-gray-300 text-sm px-5 py-2 rounded hover:bg-gray-400">Cancel</button>
                    </div>
                </div>
            </div>

            {showLoginDialog && <LoginRequiredDialog onClose={() => setShowLoginDialog(false)} />}
        </>
    );
}
