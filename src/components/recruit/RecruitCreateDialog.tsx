'use client';

import { useState } from 'react';
import { useUserStore } from "@/store/userStore";
import {createRecruitRequest} from "@/api/requests/recruit";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export default function RecruitCreateDialog({ onClose, onSuccess }: Props) {
    const { user } = useUserStore();
    const [title, setTitle] = useState('');
    const [recruitText, setRecruitText] = useState('');
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleSubmit = async () => {
        try {
            await createRecruitRequest({
                title,
                nickName: user?.nickname ?? '',
                recruitText,
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
                <h2 className="text-lg font-semibold mb-1">Create Recruit</h2>
                <hr className="mb-6 border-t" />
                <div className="space-y-5">
                    <div className="flex items-center gap-4">
                        <label className="w-20 text-sm font-semibold">Name</label>
                        <div className="bg-gray-100 text-sm px-4 py-2 rounded w-80 border border-gray-300">
                            {user?.nickname}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="w-20 text-sm font-semibold">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-80 px-3 py-2 rounded text-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    {/* 내용 */}
                    <div>
                        <label className="block mb-1 text-sm font-semibold">내용</label>
                        <textarea
                            rows={10}
                            value={recruitText}
                            onChange={(e) => setRecruitText(e.target.value)}
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
