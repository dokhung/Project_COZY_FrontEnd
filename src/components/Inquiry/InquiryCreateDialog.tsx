"use client";

import { useState } from "react";

interface Props {
    openType: "사용문의" | "1:1 문의" | null;
    username: string;
    onSubmit: (title: string, content: string) => Promise<void>;
    onClose: () => void;
}

export default function InquiryCreateDialog({
                                                openType,
                                                username,
                                                onSubmit,
                                                onClose,
                                            }: Props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    if (!openType) return null;

    const handleSubmit = async () => {
        await onSubmit(title, content);
        setTitle("");
        setContent("");
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 shadow-xl">
            <div className="bg-white p-8 shadow-xl w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">{openType} 작성</h2>
                <p className="text-sm mb-2 text-black font-bold">작성자: {username}</p>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목"
                    className="w-full border mb-4 p-4 text-lg"
                />

                <textarea
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용"
                    className="w-full border mb-4 p-4 text-lg resize-none"
                />

                <div className="flex justify-end gap-4">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold text-lg shadow-md"
                    >
                        등록
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 bg-red-500 hover:bg-red-700 text-white text-lg"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}
