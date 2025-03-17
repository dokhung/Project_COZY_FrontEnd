'use client';

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface AvatarDropdownMenuProps {
    user: { nickname: string; profileImage?: string; statusMessage?: string };
    onLogout: () => void;
}

export default function AvatarDropdownMenu({ user, onLogout }: AvatarDropdownMenuProps) {
    const profileImageSrc = user?.profileImage
        ? (user.profileImage.startsWith('http') ? user.profileImage : `/uploads/${user.profileImage}`)
        : null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
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
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className="w-72 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
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
                    <span className="text-sm text-gray-500">{user?.statusMessage || "상태 메시지를 입력하세요"}</span>
                </div>

                <div className="border-t border-gray-200 my-3"/>

                {/* 🔹 메뉴 버튼 */}
                <div className="grid grid-cols-2 gap-3">
                    <DropdownMenuItem asChild>
                        <Link href='/myinfo' className="flex items-center justify-center p-3 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold">
                            내 정보
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href='/settings' className="flex items-center justify-center p-3 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold">
                            설정
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href='/participation' className="flex items-center justify-center p-3 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold">
                            나의 참여
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={onLogout}
                        className="flex items-center justify-center p-3 rounded-lg bg-gray-100 hover:bg-red-100 text-red-600 font-semibold"
                    >
                        로그아웃
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
