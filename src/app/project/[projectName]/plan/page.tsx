'use client';

import { useState } from 'react';
import AddPlanDialog from "@/components/ProjectPlan/AddPlanDialog";


export default function PlanPage() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mb-4 flex items-center gap-2">
                <input type="text" placeholder="검색" className="border px-2 py-1 rounded" />
                <button className="border px-3 py-1 rounded bg-white">검색</button>
            </div>

            <table className="w-full border bg-white text-sm">
                <thead>
                <tr className="border-b text-center font-semibold">
                    <th className="p-2"><input type="checkbox" /></th>
                    <th className="p-2">상태</th>
                    <th className="p-2">내용</th>
                    <th className="p-2">작업자</th>
                    <th className="p-2">기한</th>
                </tr>
                </thead>
                <tbody>
                <tr className="text-center border-b">
                    <td><input type="checkbox" /></td>
                    <td>작업 전</td>
                    <td>춘식이 훌치기</td>
                    <td>시바도경</td>
                    <td>춘식이 먼저 일본 가기 전에</td>
                </tr>
                </tbody>
            </table>

            <div className="mt-4 flex justify-center">
                <button
                    className="px-6 py-2 border rounded bg-white"
                    onClick={() => setIsOpen(true)}
                >
                    추가하기
                </button>
            </div>
            <AddPlanDialog open={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}
