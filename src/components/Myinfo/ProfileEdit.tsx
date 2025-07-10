'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {updateUserInfoRequest} from "@/api/requests/info";

export default function ProfileEdit({ user, setUser, updateProfileImage, onCancel, onSave }: any) {
    const [nickname, setNickname] = useState(user?.nickname || '');
    const [statusMessage, setStatusMessage] = useState(user?.statusMessage || '');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(user?.profileImage || null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file)); // ✅ 미리보기 적용
            setSelectedFileName(file.name);
        } else {
            setSelectedFileName(null);
        }
    };

    const handleSave = async () => {
        try {
            if (nickname === user.nickname && statusMessage === user.statusMessage && !profileImage) {
                setErrorMessage("변경할 내용이 없습니다.");
                return;
            }

            const formData = new FormData();
            formData.append('userUpdateDTO', JSON.stringify({ nickname, statusMessage }));
            if (profileImage) {
                formData.append('profileImage', profileImage);
            }

            const updatedUser = await updateUserInfoRequest(formData);

            setUser((prevUser: any) => ({
                ...prevUser,
                nickname: updatedUser.nickname,
                statusMessage: updatedUser.statusMessage,
                profileImage: updatedUser.profileImage,
            }));

            updateProfileImage(updatedUser.profileImage);
            onSave();
        } catch (error) {
            setErrorMessage("정보 수정 실패");
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-96 text-center">
            <h2 className="text-xl font-bold mb-4">내 정보 수정</h2>

            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

            {/* 🔹 이미지 미리보기 */}
            <div className="flex flex-col items-center mb-4">
                {previewImage ? (
                    <Image src={previewImage} alt="프로필 이미지 미리보기" width={100} height={100} className="rounded-full object-cover border border-gray-300 shadow-md" />
                ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                        선택된 이미지 없음
                    </div>
                )}
            </div>

            {/* 🔹 파일 선택 버튼 */}
            <div className="mb-4">
                <label className="cursor-pointer flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700 transition">
                    파일 선택
                    <input type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" />
                </label>
                <p className={`mt-2 text-sm ${selectedFileName ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                    {selectedFileName || "선택된 파일 없음"}
                </p>
            </div>

            {/* 닉네임 입력 */}
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md mb-2" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임" />

            {/* 상태 메시지 입력 */}
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md mb-4" value={statusMessage} onChange={(e) => setStatusMessage(e.target.value)} placeholder="상태 메시지" />

            {/* 버튼 영역 */}
            <div className="flex justify-between">
                <button className="w-1/2 bg-green-500 text-white p-2 rounded-md mr-2 hover:bg-green-600 transition" onClick={handleSave}>
                    저장
                </button>
                <button className="w-1/2 bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500 transition" onClick={onCancel}>
                    취소
                </button>
            </div>
        </div>
    );
}
