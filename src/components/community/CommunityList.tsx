'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PlanCreateDialog from '@/components/plan/PlanCreateDialog';
import { getPlanListRequest } from '@/api/requests/plan';

interface PlanItem {
    id: number;
    title: string;
    nickname: string;
    createdAt: string;
}

export default function PlanList() {
    const [plans, setPlans] = useState<PlanItem[]>([]);
    const [search, setSearch] = useState('');
    const [showDialog, setShowDialog] = useState(false);

    const getPlanListData = async () => {
        const data = await getPlanListRequest();
        if (data) setPlans(data);
    };

    useEffect(() => {
        getPlanListData();
    }, []);

    const formatDate = (dateString: string) => {
        return dateString?.split('T')[0] ?? '';
    };
    const projectId = 0;

    // 검색 필터 (간단히 제목/작성자 포함)
    const filtered = plans.filter(
        (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.nickname.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto mt-10 px-4 relative">
            <div className="flex justify-between items-center mb-4">
                <div className="font-semibold">
                    계획&nbsp;&nbsp;{plans.length}
                </div>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="검색"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-60 h-10"
                    />
                    <Button className="h-10 w-20">검색</Button>
                    <Button
                        className="h-10 w-24 bg-blue-600 text-white"
                        onClick={() => setShowDialog(true)}
                    >
                        계획 작성
                    </Button>
                </div>
            </div>

            {/* 테이블 */}
            <table className="w-full border-t border-b text-center text-sm">
                <thead className="bg-white border-b">
                <tr className="text-gray-600">
                    <th className="py-2">No</th>
                    <th className="py-2 text-left pl-6">Title</th>
                    <th className="py-2">UserName</th>
                    <th className="py-2">CreateDay</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map((plan, index) => (
                    <tr key={plan.id} className="hover:bg-gray-50 border-b">
                        <td className="py-2">{index + 1}</td>
                        <td className="py-2 text-left pl-6">
                            <Link
                                href={`/plan/${plan.id}`}
                                className="hover:underline text-black"
                            >
                                {plan.title}
                            </Link>
                        </td>
                        <td className="py-2">{plan.nickname}</td>
                        <td className="py-2">{formatDate(plan.createdAt)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showDialog && (
                <PlanCreateDialog
                    projectId={projectId} // ← 여기에 실제 프로젝트 ID 넣어주세요.
                    onClose={() => setShowDialog(false)}
                    onSuccess={() => {
                        setShowDialog(false);
                        getPlanListData();
                    }}
                />
            )}
        </div>
    );
}
