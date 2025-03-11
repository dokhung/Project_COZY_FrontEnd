import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';

interface AvatarProfileProps {
    profileImage?: string;
    nickname: string;
    status?: string;
}

export default function AvatarProfile({ profileImage, nickname, status }: AvatarProfileProps) {
    return (
        <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-200">
            <Avatar className='h-12 w-12'>
                {profileImage ? (
                    <Image
                        src={profileImage}
                        alt="Profile Image"
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                    />
                ) : (
                    <AvatarFallback>{nickname.charAt(0)}</AvatarFallback>
                )}
            </Avatar>
            <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{nickname}</span>
                <span className="text-sm text-gray-500">{status || "상태 메시지를 입력하세요"}</span>
            </div>
        </div>
    );
}
