'use client';

import { useState } from 'react';
import { verifyPasswordRequest, updateUserInfoRequest } from '@/api/auth';
import { useUserStore } from '@/store/userStore';
import Image from 'next/image';

export default function MyInfo() {
    const { user, setUser } = useUserStore(); // Zustand에서 사용자 정보 가져오기
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState(user?.nickname || '');
    const [statusMessage, setStatusMessage] = useState(user?.statusMessage || '');

    // 🔹 비밀번호 확인 함수
    const handleVerifyPassword = async () => {
        try {
            const result = await verifyPasswordRequest(password);
            if (result.valid) {
                setIsVerified(true);
                setError('');
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    // 🔹 수정 모드 활성화
    const handleEdit = () => {
        setIsEditing(true);
    };

    // 🔹 수정 내용 저장 (서버에 요청 보내기)
    const handleSave = async () => {
        try {
            const updatedUser = await updateUserInfoRequest({ nickname, statusMessage });
            setUser(updatedUser); // Zustand에 새로운 정보 반영
            setIsEditing(false); // 수정 모드 종료
        } catch (error: any) {
            setError('정보 수정에 실패했습니다.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {!isVerified ? (
                <div className="bg-white shadow-md rounded-lg p-6 w-96 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">내 정보</h2>
                    <p className="text-gray-600 mb-4">정보를 보려면 비밀번호를 입력하세요.</p>

                    <input
                        type="password"
                        placeholder="비밀번호 입력"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <button
                        className="w-full bg-black text-white p-3 mt-4 rounded-md hover:bg-gray-800"
                        onClick={handleVerifyPassword}
                    >
                        확인
                    </button>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-8 w-[400px] text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">내 정보</h2>

                    {/* 🔹 프로필 사진 표시 */}
                    <div className="flex flex-col items-center mb-4">
                        {user?.profileImage ? (
                            <Image
                                src={user.profileImage}
                                alt="프로필 이미지"
                                width={80}
                                height={80}
                                className="rounded-full object-cover border border-gray-300 shadow-sm"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-300 text-xl font-bold text-white">
                                {user?.nickname?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {!isEditing ? (
                        <>
                            <p className="text-gray-700 text-lg mb-2">닉네임: <span className="font-semibold">{user?.nickname}</span></p>
                            <p className="text-gray-500 text-md mb-4">상태 메시지: {user?.statusMessage || "등록된 상태 메시지가 없습니다."}</p>

                            <button
                                className="w-full bg-blue-500 text-white p-3 mt-4 rounded-md hover:bg-blue-600"
                                onClick={handleEdit}
                            >
                                수정하기
                            </button>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="닉네임"
                            />
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={statusMessage}
                                onChange={(e) => setStatusMessage(e.target.value)}
                                placeholder="상태 메시지"
                            />

                            <button className="w-full bg-green-500 text-white p-3 mt-2 rounded-md hover:bg-green-600" onClick={handleSave}>
                                저장
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
