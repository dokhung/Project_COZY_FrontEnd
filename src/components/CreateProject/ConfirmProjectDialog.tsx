'use client';
import { useEffect } from 'react';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    loading?: boolean;
    data: {
        projectName: string;
        interest: string;
        description: string;
        leaderName: string; // 필요 시 ownerId 등으로 교체 가능
    };
}

export default function ConfirmProjectDialog({ open, onClose, onConfirm, loading, data }: Props) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (open) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">프로젝트 생성 내용을 확인하세요</h2>

                <div className="space-y-3">
                    <div className="rounded-lg border p-3">
                        <p className="text-xs text-gray-500">Project Name</p>
                        <p className="font-semibold">{data.projectName}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                        <p className="text-xs text-gray-500">Interest</p>
                        <p className="font-semibold">{data.interest}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                        <p className="text-xs text-gray-500">Leader Nickname</p>
                        <p className="font-semibold">{data.leaderName}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                        <p className="text-xs text-gray-500">Description</p>
                        <div className="max-h-60 overflow-auto whitespace-pre-wrap">
                            {data.description}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2">
                    <button
                        className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={onClose}
                        disabled={loading}
                    >
                        수정하기
                    </button>
                    <button
                        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? '생성 중...' : '확인 후 생성'}
                    </button>
                </div>
            </div>
        </div>
    );
}
