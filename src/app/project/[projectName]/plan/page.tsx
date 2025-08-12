'use client';

import { useEffect, useState } from 'react';
import { getPlanListRequest } from "@/api/requests/plan";
import PlanDetailDialog from "@/components/plan/PlanDetilDialog";
import PlanCreateDialog from "@/components/plan/PlanCreateDialog";

export default function PlanPage() {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCheckbox, setSelectedCheckbox] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    // 계획 목록 조회
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await getPlanListRequest();
                setPlans(data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlans();
    }, []);

    // 개별 체크박스 토글
    const handleCheckboxChange = (id: number) => {
        setSelectedCheckbox((selectedCheckbox) =>
            selectedCheckbox.includes(id)
                ? selectedCheckbox.filter((selectedId) => selectedId !== id)
                : [...selectedCheckbox, id]
        );
    };

    // 전체 선택 토글
    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedCheckbox([]);
        } else {
            const allIds = plans.map((plan: any) => plan.id);
            setSelectedCheckbox(allIds);
        }
        setSelectAll(!selectAll);
    };

    // 검색 필터링
    const filteredPlans = plans.filter((plan: any) =>
        plan.title.includes(search) || plan.nickname.includes(search)
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mb-4 flex items-center gap-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="제목 또는 작성자 검색"
                    className="border px-2 py-2 rounded text-base"
                />
                <button
                    className="border px-4 py-2 rounded bg-white text-base"
                    onClick={() => setSearch('')}
                >
                    초기화
                </button>
            </div>

            <table className="w-full border bg-white text-lg">
                <thead>
                <tr className="border-b text-center font-semibold">
                    <th className="p-4">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                        />
                    </th>
                    <th className="p-4">상태</th>
                    <th className="p-4">제목</th>
                    <th className="p-4">작성자</th>
                    <th className="p-4">작성일</th>
                </tr>
                </thead>
                <tbody>
                {isLoading ? (
                    <tr>
                        <td colSpan={5} className="text-center py-6 text-base">
                            로딩 중...
                        </td>
                    </tr>
                ) : plans.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="text-center py-6 text-base">
                            현재 등록된 계획이 없습니다.
                        </td>
                    </tr>
                ) : filteredPlans.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="text-center py-6 text-base">
                            검색 결과가 없습니다.
                        </td>
                    </tr>
                ) : (
                    filteredPlans.map((plan: any) => (
                        <tr
                            key={plan.id}
                            className="text-center border-b hover:bg-gray-100 cursor-pointer"
                            onClick={() => setSelectedPlanId(plan.id)}
                        >
                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    checked={selectedCheckbox.includes(plan.id)}
                                    onChange={() => handleCheckboxChange(plan.id)}
                                />
                            </td>
                            <td className="p-4">
                    <span
                        className={`inline-block px-5 py-2 rounded-full text-xs font-semibold
                            ${
                            plan.status === "시작 전"
                                ? "bg-gray-200 text-gray-700"
                                : plan.status === "진행 중"
                                    ? "bg-blue-200 text-blue-800"
                                    : plan.status === "검토 중"
                                        ? "bg-purple-200 text-purple-800"
                                        : plan.status === "승인 중"
                                            ? "bg-yellow-200 text-yellow-800"
                                            : plan.status === "머지 신청"
                                                ? "bg-pink-200 text-pink-800"
                                                : plan.status === "머지 완료"
                                                    ? "bg-green-200 text-green-800"
                                                    : "bg-gray-200 text-gray-700"
                        }
                        `}
                    >
                        {plan.status}
                    </span>
                            </td>
                            <td className="p-4">{plan.title}</td>
                            <td className="p-4">{plan.nickname}</td>
                            <td className="p-4">{new Date(plan.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))
                )}
                </tbody>

            </table>

            <div className="mt-6 flex justify-center gap-2">
                <button
                    className="px-6 py-2 border rounded bg-white text-lg"
                    onClick={() => setIsOpen(true)}
                >
                    추가하기
                </button>
            </div>

            {isOpen && (
                <PlanCreateDialog
                    projectId={projectId}
                    onClose={() => setIsOpen(false)}
                    onSuccess={async () => {
                        setIsLoading(true);
                        const data = await getPlanListRequest();
                        setPlans(data);
                        setIsLoading(false);
                    }}
                />
            )}

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
