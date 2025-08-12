'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {getPlanDetailRequest} from "@/api/requests/plan";

interface Props {
    planId: number;
    onClose: () => void;
    onDeleted?: () => void;
    onUpdated?: () => void;
}


export default function PlanDetailDialog({ planId, onClose }: Props) {
    const [loading, setLoading] = useState(true);
    const [plan, setPlan] = useState<{
        id: number;
        title: string;
        nickname: string;
        createdAt: string;
        planText: string;
    } | null>(null);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const data = await getPlanDetailRequest(planId);
                setPlan(data);
                console.log("res:", JSON.stringify(data, null, 2));
                console.log("plan :: " + plan);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlan();
    }, [planId]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow">로딩 중...</div>
            </div>
        );
    }

    if (!plan) {
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
                <h2 className="text-2xl font-bold text-center mb-4">{plan.title}</h2>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <div>작성자 : {plan.nickname}</div>
                    <div>{plan.createdAt.split('T')[0]}</div>
                </div>
                <div className="text-center whitespace-pre-wrap text-gray-800">{plan.planText}</div>

                <div className="mt-6 text-right">
                    <Button onClick={onClose}>닫기</Button>
                </div>
            </div>
        </div>
    );
}
