'use client';

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type AvatarMenuProps = {
    isLoggedIn: boolean;
};

export default function AvatarMenu({ isLoggedIn }: AvatarMenuProps) {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='rounded-full'>
                    <Avatar className='h-8 w-8'>
                        <AvatarFallback>test</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
                {isLoggedIn ? (
                    <>
                        <DropdownMenuItem className='hover:bg-gray-200'>
                            <Link href='/profile' prefetch={false}>
                                내 정보
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className='hover:bg-gray-200'>
                            <Link href='/settings' prefetch={false}>
                                설정
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className='hover:bg-gray-200'>
                            <Link href='/logout' prefetch={false}>
                                로그아웃
                            </Link>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <DropdownMenuItem
                        className='hover:bg-gray-200'
                        onSelect={() => {
                            router.push('/login');
                        }}
                    >
                        로그인
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
