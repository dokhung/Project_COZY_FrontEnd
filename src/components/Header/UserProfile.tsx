'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface UserProfileProps {
    user: { nickname: string; profileImage?: string };
}

export default function UserProfile({ user }: UserProfileProps) {
    const profileImageSrc = user?.profileImage
        ? (user.profileImage.startsWith('http') ? user.profileImage : `/uploads/${user.profileImage}`)
        : null;

    return (
        <div className="flex items-center space-x-3 cursor-pointer">
            <Button variant='ghost' size='icon' className='rounded-full'>
                <Avatar className='h-8 w-8'>
                    {profileImageSrc ? (
                        <Image src={profileImageSrc} alt="프로필 이미지" width={32} height={32} className="rounded-full object-cover" />
                    ) : (
                        <AvatarFallback className="bg-gray-300 text-lg font-bold text-white">
                            {user?.nickname?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    )}
                </Avatar>
            </Button>
            <span className="text-gray-800 font-medium text-sm md:text-base">
                {user?.nickname} 님 로그인 중
            </span>
        </div>
    );
}
