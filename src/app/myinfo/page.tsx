'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import VerifyPassword from "@/components/Myinfo/VerifyPassword";
import ProfileEdit from "@/components/Myinfo/ProfileEdit";
import ProfileView from "@/components/Myinfo/ProfileView";

export default function MyInfo() {
    const { user, setUser, updateProfileImage } = useUserStore();
    const [isVerified, setIsVerified] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            {!isVerified ? (
                <>
                    <h2 className="text-2xl font-bold mb-4">🔑 보안 확인</h2>
                    <p className="text-gray-600 mb-6">개인 정보를 보호하기 위해 비밀번호를 입력해주세요.</p>
                    <VerifyPassword onVerify={() => setIsVerified(true)} />
                </>
            ) : isEditing ? (
                <ProfileEdit
                    user={user}
                    setUser={setUser}
                    updateProfileImage={updateProfileImage}
                    onCancel={() => setIsEditing(false)}
                    onSave={() => setIsEditing(false)}
                />
            ) : (
                <ProfileView user={user} onEdit={() => setIsEditing(true)} />
            )}
        </div>
    );
}
