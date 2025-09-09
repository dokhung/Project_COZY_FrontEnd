"use client";

import { useState } from "react";

type Inquiry = {
    id: number;
    type: string;
    status: string;
    title: string;
    content: string;
    createdAt: string;
};

interface Props {
    inquiry: Inquiry | null;
    username: string;
    onClose: () => void;
    onSave: (id: number, title: string, content: string) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

export default function InquiryDetailDialog({
                                                inquiry,
                                                username,
                                                onClose,
                                                onSave,
                                                onDelete,
                                            }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(inquiry?.title ?? "");
    const [editContent, setEditContent] = useState(inquiry?.content ?? "");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    if (!inquiry) return null;

    const handleSave = async () => {
        setSaving(true);
        await onSave(inquiry.id, editTitle, editContent);
        setIsEditing(false);
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        setDeleting(true);
        await onDelete(inquiry.id);
        setDeleting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-xl w-full max-w-3xl">
                {isEditing ? (
                    <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full border p-3 text-lg font-bold mb-2"
                    />
                ) : (
                    <h2 className="text-xl font-bold mb-2">{inquiry.title}</h2>
                )}

                <p className="text-sm text-gray-600 font-semibold mb-2">
                    작성자: {username}
                </p>

                <hr className="border-t border-black my-4" />

                {isEditing ? (
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full border p-4 text-base resize-none h-[400px]"
                    />
                ) : (
                    <div className="text-gray-800 whitespace-pre-wrap mb-4 h-[400px] overflow-y-auto">
                        {inquiry.content}
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="border px-6 py-3 rounded"
                                disabled={saving}
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSave}
                                className="border px-6 py-3 rounded bg-blue-600 text-white disabled:opacity-50"
                                disabled={saving}
                            >
                                {saving ? "저장 중..." : "저장"}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="border px-6 py-3 rounded bg-blue-600 text-white"
                            >
                                수정
                            </button>
                            <button
                                onClick={handleDelete}
                                className="border px-6 py-3 rounded bg-red-600 text-white disabled:opacity-50"
                                disabled={deleting}
                            >
                                {deleting ? "삭제 중..." : "삭제"}
                            </button>
                            <button
                                onClick={onClose}
                                className="border px-6 py-3 rounded bg-black text-white"
                            >
                                닫기
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
