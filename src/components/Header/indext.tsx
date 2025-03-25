'use client';

import Link from 'next/link';
import AvatarMenu from './AvatarMenu';
import Logo from '../../logo/LogiImg.svg';
import Image from 'next/image';
import ProjectCreateButton from "@/components/CreateProject/ProjectCreateButton";

export default function Header() {
    return (
        <header className='fixed top-0 z-10 w-full border-b border-b-gray-200 bg-white h-16'>
            <div className='container flex h-full items-center justify-between px-4 md:px-6'>

                {/* 왼쪽 - 로고 및 메뉴 */}
                <div className='flex items-center space-x-4'>
                    <Link href='/' className='flex items-center space-x-2'>
                        <span className='text-blue-500'>
                            <Image src={Logo} alt="Collaboproject Logo" width={40} height={40} />
                        </span>
                        <span className='font-bold text-blue-500'>COZY</span>
                    </Link>
                    <nav className='hidden md:flex md:items-center md:gap-1'>
                        <Link href='/feature' className='rounded-lg px-3 py-1 text-sm font-semibold hover:bg-gray-200'>기능</Link>
                        <Link href='/solution' className='rounded-lg px-3 py-1 text-sm font-semibold hover:bg-gray-200'>솔루션</Link>
                        <Link href='/community' className='rounded-lg px-3 py-1 text-sm font-semibold hover:bg-gray-200'>커뮤니티</Link>
                        <Link href='/inquiry' className='rounded-lg px-3 py-1 text-sm font-semibold hover:bg-gray-200'>문의</Link>
                    </nav>
                </div>

                {/* ✅ 가운데 - ProjectAction 버튼 */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <ProjectCreateButton />
                </div>

                {/* 오른쪽 - 유저 정보 */}
                <AvatarMenu />
            </div>
        </header>
    );
}
