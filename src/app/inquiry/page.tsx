"use client";

import { useEffect, useState } from "react";
import { createInquiryRequest, getInquiriesRequest } from "@/api/requests/inquiry";
import { useUserStore } from "@/store/userStore";

export default function InquiryPage() {
    const user = useUserStore((s) => s.user);
    const username = user?.nickname || "";

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [viewType, setViewType] = useState<"전체" | "사용문의" | "1:1 문의">("전체");
    const [openType, setOpenType] = useState<"사용문의" | "1:1 문의" | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

    // 날짜 포맷 함수
    function formatDateTime(dateString: string) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

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

    const handleSubmit = async () => {
        try {
            await createInquiryRequest(openType!, title, content);
            fetchData();
            setOpenType(null);
            setTitle("");
            setContent("");
        } catch (e) {
            console.error(e);
            alert("문의 등록에 실패했습니다.");
        }
    };

    const filteredData =
        viewType === "전체"
            ? data
            : data.filter((inquiry) => inquiry.type === viewType);

    return (
        <div className="p-8">
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

            {openType && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{openType} 작성</h2>
                        <p className="text-sm mb-2 text-gray-500">작성자: {username}</p>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목"
                            className="w-full border mb-2 p-2"
                        />
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="내용"
                            className="w-full border mb-2 p-2"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setOpenType(null)}
                                className="border px-4 py-2 rounded"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                등록
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedInquiry && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{selectedInquiry.title}</h2>
                        <p className="text-sm text-gray-600 mb-2">작성자: {username}</p>
                        <div className="text-gray-800 whitespace-pre-wrap mb-4">
                            {selectedInquiry.content}
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="border px-4 py-2 rounded"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                            <td className="text-center p-2">{formatDateTime(inquiry.createdAt)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
