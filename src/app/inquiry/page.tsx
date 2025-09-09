"use client";

import { useEffect, useState } from "react";
import {
    createInquiryRequest,
    deleteInquiryRequest,
    getInquiriesRequest,
    updateInquiryRequest,
} from "@/api/requests/inquiry";
import { useUserStore } from "@/store/userStore";
import InquiryCreateDialog from "@/components/Inquiry/InquiryCreateDialog";
import InquiryDetailDialog from "@/components/Inquiry/InquiryDetailDialog";

type Inquiry = {
    id: number;
    type: "사용문의" | "1:1 문의" | string;
    status: string;
    title: string;
    content: string;
    createdAt: string;
};

export default function InquiryPage() {
    const user = useUserStore((s) => s.user);
    const username = user?.nickname || "";

    const [data, setData] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    const [viewType, setViewType] = useState<"전체" | "사용문의" | "1:1 문의">("전체");
    const [openType, setOpenType] = useState<"사용문의" | "1:1 문의" | null>(null);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    const fetchData = async () => {
        try {
            const res = await getInquiriesRequest();
            setData(res);
        } catch (e) {
            console.error(e);
            alert("문의 데이터를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (title: string, content: string) => {
        if (!openType) return;
        await createInquiryRequest(openType, title, content);
        await fetchData();
        setOpenType(null);
    };

    const handleSave = async (id: number, title: string, content: string) => {
        await updateInquiryRequest(id, { title, content });
        await fetchData();
    };

    const handleDelete = async (id: number) => {
        await deleteInquiryRequest(id);
        await fetchData();
        setSelectedInquiry(null);
    };

    const filteredData =
        viewType === "전체" ? data : data.filter((inquiry) => inquiry.type === viewType);

    return (
        <div className="p-8">
            {/* 탭 */}
            <div className="flex justify-between mb-6">
                <div className="flex gap-2">
                    {["전체", "사용문의", "1:1 문의"].map((type) => (
                        <button
                            key={type}
                            className={`border px-4 py-2 rounded-full text-sm ${
                                viewType === type ? "bg-gray-200" : ""
                            }`}
                            onClick={() => setViewType(type as any)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* 작성 버튼 */}
            <div className="flex gap-2 mb-4">
                <button
                    className="border px-4 py-2 rounded"
                    onClick={() => setOpenType("사용문의")}
                >
                    사용문의 작성
                </button>
                <button
                    className="border px-4 py-2 rounded"
                    onClick={() => setOpenType("1:1 문의")}
                >
                    1:1 문의 작성
                </button>
            </div>

            {/* 작성 모달 */}
            <InquiryCreateDialog
                openType={openType}
                username={username}
                onSubmit={handleCreate}
                onClose={() => setOpenType(null)}
            />

            {/* 상세 모달 */}
            <InquiryDetailDialog
                inquiry={selectedInquiry}
                username={username}
                onClose={() => setSelectedInquiry(null)}
                onSave={handleSave}
                onDelete={handleDelete}
            />

            {/* 목록 */}
            {loading ? (
                <div>로딩 중...</div>
            ) : (
                <table className="w-full text-sm mt-4">
                    <thead>
                    <tr className="border-b">
                        <th className="text-center p-2">종류</th>
                        <th className="text-center p-2">상태</th>
                        <th className="text-center p-2">제목</th>
                        <th className="text-center p-2">작성자</th>
                        <th className="text-center p-2">등록일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((inquiry) => (
                        <tr key={inquiry.id} className="border-b">
                            <td className="text-center p-2">{inquiry.type}</td>
                            <td className="text-center p-2">{inquiry.status}</td>
                            <td
                                className="text-center p-2 text-blue-600 hover:underline cursor-pointer"
                                onClick={() => setSelectedInquiry(inquiry)}
                            >
                                {inquiry.title}
                            </td>
                            <td className="text-center p-2">{username}</td>
                            <td className="text-center p-2">
                                {new Date(inquiry.createdAt).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
