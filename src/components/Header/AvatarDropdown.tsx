import Link from 'next/link';
import { DropdownMenuItem, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Avatar } from "@/components/ui/avatar";

interface AvatarDropdownProps {
    profileImage?: string;
    nickname: string;
    status?: string;
    handleLogout: () => void;
}

export default function AvatarDropdown({ profileImage, nickname, status, handleLogout }: AvatarDropdownProps) {
    return (
        <DropdownMenuContent
            align="end"
            className="w-72 border border-gray-300 bg-white rounded-lg p-4 shadow-none"
            style={{ borderWidth: '1px' }} // ✅ 테두리 중복 방지
        >
            {/* 🔹 프로필 정보 */}
            <div className="flex flex-col items-center pb-4">
                <Avatar className="h-20 w-20">
                    {profileImage ? (
                        <Image
                            src={profileImage}
                            alt="프로필 이미지"
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300 text-xl font-bold text-white">
                            {nickname.charAt(0).toUpperCase()}
                        </span>
                    )}
                </Avatar>
                <div className="mt-2 text-center">
                    <span className="font-semibold text-lg text-gray-900">{nickname}</span>
                    <p className="text-sm text-gray-500">{status || "상태 메시지를 입력하세요"}</p>
                </div>
            </div>

            {/* 🔹 구분선 (테두리 겹침 방지) */}
            <hr className="border-t border-gray-300 my-3 w-full" />

            {/* 🔹 버튼들 */}
            <div className="grid grid-cols-2 gap-2">
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
                    onSelect={handleLogout}
                    className="flex items-center justify-center p-3 rounded-lg bg-gray-100 hover:bg-red-100 text-red-600 font-semibold"
                >
                    로그아웃
                </DropdownMenuItem>
            </div>
        </DropdownMenuContent>
    );
}
