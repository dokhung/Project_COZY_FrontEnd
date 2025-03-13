'use client';

import { useEffect, useState } from 'react';
import { verifyPasswordRequest, updateUserInfoRequest, getCurrentUserRequest } from '@/api/auth';
import { useUserStore } from '@/store/userStore';
import Image from 'next/image';

export default function MyInfo() {
    const { user, setUser, updateProfileImage } = useUserStore();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState(user?.nickname || '');
    const [statusMessage, setStatusMessage] = useState(user?.statusMessage || '');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(user?.profileImage || null);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const currentUser = await getCurrentUserRequest();
                setUser(currentUser);
                setNickname(currentUser.nickname);
                setStatusMessage(currentUser.statusMessage);
                setPreviewImage(currentUser.profileImage);
            } catch (error) {
                console.error('유저 정보를 불러오는 중 오류 발생:', error);
            }
        }
        fetchUserData();
    }, []);

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

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('userUpdateDTO', JSON.stringify({ nickname, statusMessage }));
            if (profileImage) {
                formData.append('profileImage', profileImage);
            }

            const updatedUser = await updateUserInfoRequest(formData);
            setUser(updatedUser);
            updateProfileImage(updatedUser.profileImage);
            setPreviewImage(updatedUser.profileImage);
            setIsEditing(false);
        } catch (error: any) {
            setError('정보 수정에 실패했습니다.');
        }
    };

    // ✅ 프로필 이미지 URL이 undefined일 경우 기본 이미지 설정
    const profileImageSrc = previewImage && previewImage !== "undefined"
        ? (previewImage.startsWith('http') ? previewImage : `/uploads/${previewImage}`)
        : "/default-profile.png";

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            {!isVerified ? (
                <div className="bg-white shadow-md rounded-lg p-6 w-96 text-center">
                    <h2 className="text-xl font-bold mb-4">내 정보</h2>
                    <p className="text-gray-500 mb-4">정보를 보려면 비밀번호를 입력하세요.</p>
                    <input type="password" placeholder="비밀번호 입력" className="w-full p-2 border border-gray-300 rounded-md"
                           value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button className="w-full bg-black text-white p-2 mt-4 rounded-md" onClick={handleVerifyPassword}>
                        확인
                    </button>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-6 w-96 text-center">
                    <h2 className="text-xl font-bold mb-4">내 정보</h2>
                    <div className="flex flex-col items-center mb-4">
                        <Image src={profileImageSrc} alt="프로필 이미지" width={100} height={100} className="rounded-full object-cover" />
                    </div>
                    <p className="text-gray-700 mb-2">닉네임: {user?.nickname}</p>
                    <p className="text-gray-500 mb-4">상태 메시지: {user?.statusMessage || "등록된 상태 메시지가 없습니다."}</p>
                    <button className="w-full bg-blue-500 text-white p-2 mt-4 rounded-md" onClick={handleEdit}>
                        수정하기
                    </button>
                </div>
            )}
        </div>
    );
}
