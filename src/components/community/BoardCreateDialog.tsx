'use client';

import { useState } from 'react';
import { createPostRequest } from "@/api/requests/post";
import { useUserStore } from "@/store/userStore";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export default function BoardCreateDialog({ onClose, onSuccess }: Props) {
    const { user } = useUserStore();
    const [title, setTitle] = useState('');
    const [date] = useState(new Date().toISOString().split('T')[0]);
    const [postText, setPostText] = useState('');
    const [status, setStatus] = useState('계획');
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleSubmit = async () => {
        try {
            await createPostRequest({
                nickName: user?.nickname ?? '',
                title,
                status,
                createdAt: new Date().toISOString(),
                postText,
            });
            onSuccess();
            handleClose();
        } catch (e : any) {
            alert('게시글 등록 실패');
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 ${
                isClosing ? 'opacity-0' : 'opacity-100'
            }`}
        >
            <div
                className={`bg-white w-[600px] px-8 py-6 shadow-xl rounded-md transform transition-all duration-300 ${
                    isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
            >
                <h2 className="text-lg font-semibold mb-1">게시글 작성</h2>
                <hr className="mb-6 border-t" />
                <div className="space-y-5">
                    {/* 이름 */}
                    <div className="flex items-center gap-4">
                        <label className="w-20 text-sm font-semibold">이름</label>
                        <div className="bg-gray-100 text-sm px-4 py-2 rounded w-80 border border-gray-300">
                            {user?.nickname ?? ''}
                        </div>
                    </div>
                    {/* 제목 */}
                    <div className="flex items-center gap-4">
                        <label className="w-20 text-sm font-semibold">제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-80 px-3 py-2 rounded text-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    {/* 날짜 */}
                    <div className="flex items-center gap-4">
                        <label className="w-20 text-sm font-semibold">날짜</label>
                        <div className="bg-gray-100 text-sm px-4 py-2 rounded w-80 border border-gray-300">
                            {date}
                        </div>
                    </div>
                    {/* 상태 */}
                    <div className="flex items-center gap-4">
                        <label className="w-20 text-sm font-semibold">상태</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-80 px-3 py-2 rounded text-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="계획">계획</option>
                            <option value="진행중">진행중</option>
                            <option value="완료">완료</option>
                        </select>
                    </div>
                    {/* 내용 */}
                    <div>
                        <label className="block mb-1 text-sm font-semibold">내용</label>
                        <textarea
                            rows={10}
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            className="w-full resize-none p-3 rounded text-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white text-sm px-5 py-2 rounded hover:bg-blue-600"
                    >
                        등록
                    </button>
                    <button
                        onClick={handleClose}
                        className="bg-gray-300 text-sm px-5 py-2 rounded hover:bg-gray-400"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}
