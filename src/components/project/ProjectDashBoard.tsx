'use client';

import { useEffect, useState } from 'react';
import { getPlanListRequest } from "@/api/requests/plan";
import PlanDetailDialog from "@/components/plan/PlanDetilDialog";

const columns = ['시작 전', '진행 중', '검토 중', '승인 중', '머지 신청', '머지 완료'];

export default function ProjectDashBoard() {
    const [plans, setPlans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await getPlanListRequest();
                setPlans(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlans();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <h1 className="mb-8 text-3xl font-extrabold text-blue-900">프로젝트 대시보드</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {columns.map((status) => {
                    const statusPlans = plans.filter((plan) => plan.status === status);
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
                                ) : statusPlans.length === 0 ? (
                                    <div className="text-center text-gray-400 text-sm">계획 없음</div>
                                ) : (
                                    statusPlans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className="border border-gray-200 rounded-lg p-3 shadow-sm bg-white cursor-pointer"
                                            onClick={() => setSelectedPlanId(plan.id)}
                                        >
                                            <div className="text-sm font-semibold text-gray-800 truncate">{plan.title}</div>
                                            <div className="text-xs text-gray-500">{plan.nickname}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedPlanId && (
                <PlanDetailDialog
                    planId={selectedPlanId}
                    onClose={() => setSelectedPlanId(null)}
                    onDeleted={async () => {
                        setIsLoading(true);
                        const data = await getPlanListRequest();
                        setPlans(data);
                        setIsLoading(false);
                        setSelectedPlanId(null);
                    }}
                    onUpdated={async () => {
                        setIsLoading(true);
                        const data = await getPlanListRequest();
                        setPlans(data);
                        setIsLoading(false);
                    }}
                />
            )}
        </div>
    );
}
