'use client';

import { useEffect, useState } from "react";
import {
    deleteCommunityRequest,
    getCommunityDetailRequest,
    updateCommunityRequest
} from "@/api/requests/community";

interface Props {
    communityId: number;
    onClose: () => void;
    onDeleted?: () => void;
    onUpdated?: () => void;
}

export default function CommunityDetailDialog({
                                                  communityId,
                                                  onClose,
                                                  onDeleted,
                                                  onUpdated,
                                              }: Props) {
    const [community, setCommunity] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editText, setEditText] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getCommunityDetailRequest(communityId);
                setCommunity(data);
                setEditTitle(data.title);
                setEditText(data.communityText);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [communityId]);

    // 삭제
    const handleDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        await deleteCommunityRequest(communityId);
        alert("삭제되었습니다.");
        onDeleted?.();
        onClose?.();
    };

    // 수정 시작
    const startEdit = () => {
        setIsEditing(true);
    };

    // 수정 저장
    const handleUpdate = async () => {
        await updateCommunityRequest(communityId, {
            title: editTitle,
            communityText: editText,
            // nickname: community.nickname,
            // createdAt: community.createdAt,
        });

        alert("수정되었습니다.");
        setIsEditing(false);
        onUpdated?.();

        const updatedData = await getCommunityDetailRequest(communityId);
        setCommunity(updatedData);
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow w-96">로딩 중...</div>
            </div>
        );
    }

    if (!community) return null;

    const renderViewMode = () => (
        <>
            <h2 className="text-xl font-bold mb-2">{community.title}</h2>
            <p className="text-gray-500 mb-1">작성자: {community.nickname}</p>
            <div className="mb-4 whitespace-pre-wrap">{community.communityText}</div>
            <div className="text-xs text-gray-400">
                {new Date(community.createdAt).toLocaleString()}
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button className="border px-3 py-1 text-sm hover:bg-gray-100" onClick={onClose}>
                    닫기
                </button>
                <button className="border px-3 py-1 text-sm text-blue-600 hover:bg-blue-100" onClick={startEdit}>
                    수정
                </button>
                <button className="border px-3 py-1 text-sm text-red-600 hover:bg-red-100" onClick={handleDelete}>
                    삭제
                </button>
            </div>
        </>
    );

    const renderEditMode = () => (
        <>
            <h2 className="text-xl font-bold mb-2">게시글 수정</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">제목</label>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full border px-3 py-2 rounded text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">내용</label>
                    <textarea
                        rows={6}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full border px-3 py-2 rounded text-sm resize-none"
                    />
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button className="border px-3 py-1 text-sm hover:bg-gray-100" onClick={() => setIsEditing(false)}>
                    취소
                </button>
                <button className="border px-3 py-1 text-sm text-blue-600 hover:bg-blue-100" onClick={handleUpdate}>
                    저장
                </button>
            </div>
        </>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-[500px]">
                {isEditing ? renderEditMode() : renderViewMode()}
            </div>
        </div>
    );
}
