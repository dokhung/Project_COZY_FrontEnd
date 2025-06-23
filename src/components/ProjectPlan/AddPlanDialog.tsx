'use client';

import React, {useState} from "react";

interface AddPlanDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function AddPlanDialog({ open, onClose }: AddPlanDialogProps) {

    const [description, setDescription] = useState("춘식이 일본");

    if (!open) return null;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // 👉 여기에 저장 로직 추가 가능
        alert("저장되었습니다.");
        onClose(); // 저장 후 다이얼로그 닫기
    };



    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-gray-200 p-6 w-[600px] rounded shadow relative">
                <button onClick={onClose} className="absolute top-3 right-4 text-xl">×</button>

                <h2 className="text-lg font-bold mb-4">계획추가</h2>

                <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm">프로젝트명</label>
                        <input className="w-full border px-2 py-1 mt-1" defaultValue="춘식이 일본" />
                    </div>

                    <div>
                        <label className="block text-sm">유형</label>
                        <input className="w-full border px-2 py-1 mt-1" defaultValue="진행" />
                    </div>

                    <div>
                        <label className="block text-sm">상태</label>
                        <input className="w-full border px-2 py-1 mt-1" defaultValue="진행 전" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm">설명</label>
                        <textarea
                            className="..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm">담당자</label>
                        <input className="w-full border px-2 py-1 mt-1" defaultValue="시바도경" />
                    </div>

                    <div>
                        <label className="block text-sm">보고자</label>
                        <input className="w-full border px-2 py-1 mt-1" defaultValue="시바도경" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm">기한</label>
                        <input className="w-full border px-2 py-1 mt-1" placeholder="yyyy-mm-dd" type="date" />
                    </div>

                    {/* ✅ 저장 버튼 */}
                    <div className="col-span-2 mt-4 flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
