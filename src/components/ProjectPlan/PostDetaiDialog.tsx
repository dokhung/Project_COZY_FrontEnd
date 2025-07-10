'use client';

import { useEffect, useState } from "react";
import {
    getPostDetailRequest,
    deletedPostRequest,
    updatePostRequest,
} from "@/api/requests/post";

export default function PostDetailDialog({
                                             postId,
                                             onClose,
                                             onDeleted,
                                             onUpdated,
                                         }: {
    postId: number;
    onClose: () => void;
    onDeleted?: () => void; // 삭제 후 콜백
    onUpdated?: () => void; // 수정 후 콜백
}) {
    const [post, setPost] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editStatus, setEditStatus] = useState("계획");
    const [editText, setEditText] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPostDetailRequest(postId);
                setPost(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow w-96">로딩 중...</div>
            </div>
        );
    }

    if (!post) return null;

    // 상태 색상 매핑
    const statusColors: Record<string, string> = {
        계획: "bg-gray-200 text-gray-700",
        진행중: "bg-yellow-200 text-yellow-800",
        완료: "bg-green-200 text-green-800",
    };

    const handleDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deletedPostRequest(postId);
            alert("삭제되었습니다.");
            onDeleted?.();
            onClose();
        } catch (e) {
            console.error(e);
            alert("삭제에 실패했습니다.");
        }
    };

    const startEdit = () => {
        setEditTitle(post.title);
        setEditStatus(post.status);
        setEditText(post.postText);
        setIsEditing(true);
    };

    const handleUpdate = async () => {
        try {
            await updatePostRequest(postId, {
                title: editTitle,
                status: editStatus,
                postText: editText,
            });
            alert("수정되었습니다.");
            onUpdated?.();
            setIsEditing(false);
            // 다시 불러오기
            const data = await getPostDetailRequest(postId);
            setPost(data);
        } catch (e) {
            console.error(e);
            alert("수정에 실패했습니다.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-[500px]">
                {isEditing ? (
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
                                <label className="block text-sm font-semibold mb-1">상태</label>
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    className="w-full border px-3 py-2 rounded text-sm"
                                >
                                    <option value="계획">계획</option>
                                    <option value="진행중">진행중</option>
                                    <option value="완료">완료</option>
                                </select>
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
                            <button
                                className="border px-3 py-1 text-sm hover:bg-gray-100"
                                onClick={() => setIsEditing(false)}
                            >
                                취소
                            </button>
                            <button
                                className="border px-3 py-1 text-sm text-blue-600 hover:bg-blue-100"
                                onClick={handleUpdate}
                            >
                                저장
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                        <p className="text-gray-500 mb-1">작성자: {post.nickname}</p>
                        <div
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                                statusColors[post.status] || "bg-gray-200 text-gray-700"
                            }`}
                        >
                            {post.status}
                        </div>
                        <div className="mb-4 whitespace-pre-wrap">{post.postText}</div>
                        <div className="text-xs text-gray-400">
                            {new Date(post.createdAt).toLocaleString()}
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="border px-3 py-1 text-sm hover:bg-gray-100"
                                onClick={onClose}
                            >
                                닫기
                            </button>
                            <button
                                className="border px-3 py-1 text-sm text-blue-600 hover:bg-blue-100"
                                onClick={startEdit}
                            >
                                수정
                            </button>
                            <button
                                className="border px-3 py-1 text-sm text-red-600 hover:bg-red-100"
                                onClick={handleDelete}
                            >
                                삭제
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
