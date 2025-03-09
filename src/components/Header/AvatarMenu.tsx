'use client';

import { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export default function AvatarMenu() {
    const router = useRouter();
    const { isLoggedIn, user, logout } = useUserStore();
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full" />;
    }

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {isLoggedIn && user ? (
                    <Button variant='ghost' size='icon' className='rounded-full'>
                        <Avatar className='h-8 w-8'>
                            <AvatarFallback>{user?.nickname}</AvatarFallback>
                        </Avatar>
                    </Button>
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
                <DropdownMenuContent align='end' className='w-40'>
                    <DropdownMenuItem onClick={():void=>{
                        console.log(user)
                    }}>
                        <Link href='/profile'>내 정보</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href='/settings'>설정</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleLogout}>
                        로그아웃
                    </DropdownMenuItem>
                </DropdownMenuContent>
            )}
        </DropdownMenu>
    );
}
