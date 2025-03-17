'use client';

import { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import Image from 'next/image';

export default function AvatarMenu() {
    const router = useRouter();
    const { isLoggedIn, user, logout } = useUserStore();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        router.push('/login');
    };

    // ✅ 기본 프로필 이미지 처리
    const profileImageSrc = user?.profileImage
        ? (user.profileImage.startsWith('http') ? user.profileImage : `/uploads/${user.profileImage}`)
        : null;

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                {isLoggedIn && user ? (
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
                        {/* ✅ "님 로그인 중" 스타일 추가 */}
                        <span className="text-gray-800 font-medium text-sm md:text-base">
                            {user?.nickname} 님 로그인 중
                        </span>
                    </div>
                ) : (
                    <Button
                        variant='outline'
                        className='px-4 py-2 rounded-md'
                        onClick={() => router.push('/login')}
                    >
                        로그인 해주세요
                    </Button>
                )}
            </DropdownMenuTrigger>

            {isLoggedIn && user && (
                <DropdownMenuContent
                    align='end'
                    className="w-72 p-4 bg-white rounded-xl shadow-lg border border-gray-200"
                    onPointerDownOutside={() => setIsOpen(false)}
                >
                    {/* 🔹 프로필 정보 */}
                    <div className="flex flex-col items-center">
                        <Avatar className="h-16 w-16 mb-2">
                            {profileImageSrc ? (
                                <Image src={profileImageSrc} alt="프로필 이미지" width={64} height={64} className="rounded-full object-cover" />
                            ) : (
                                <AvatarFallback className="bg-gray-300 text-lg font-bold text-white">
                                    {user?.nickname?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <span className="font-semibold text-lg text-gray-900">{user?.nickname}</span>
                        <span className="text-sm text-gray-500">
                            {user?.statusMessage || "상태 메시지를 입력하세요"}
                        </span>
                    </div>

                    {/* 🔹 구분선 */}
                    <div className="border-t border-gray-200 my-3"/>

                    {/* 🔹 버튼 영역 (2x2 그리드) */}
                    <div className="grid grid-cols-2 gap-3">
                        <DropdownMenuItem asChild>
                            <Link href='/myinfo'
                                  className="flex items-center justify-center p-3 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold">
                                내 정보
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href='/settings'
                                  className="flex items-center justify-center p-3 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold">
                                설정
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href='/participation'
                                  className="flex items-center justify-center p-3 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold">
                                나의 참여
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={handleLogout}
                            className="flex items-center justify-center p-3 rounded-lg bg-gray-100 hover:bg-red-100 text-red-600 font-semibold"
                        >
                            로그아웃
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            )}
        </DropdownMenu>
    );
}
