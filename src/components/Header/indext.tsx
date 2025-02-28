import Link from 'next/link';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Header() {
  return (
    <header className='fixed top-0 z-10 flex w-full items-center justify-center border-b border-b-gray-200 bg-white'>
      <div className='container flex h-16 items-center justify-between px-4 md:px-6'>
        <div className='flex items-center space-x-4'>
          <Link href='/' className='flex items-center space-x-2'>
            <span className='text-blue-500'>로고</span>
            <span className='font-bold text-blue-500'>프로젝트명</span>
          </Link>
          <nav className='hidden md:flex md:items-center md:gap-1'>
            <Link href='/feature' className='rounded-lg px-3 py-1 text-sm font-semibold hover:bg-gray-200'>
              기능
            </Link>
            <Link href='/solution' className='rounded-lg px-3 py-1 text-sm font-semibold hover:bg-gray-200'>
              솔루션
            </Link>
            <Link href='/community' className='rounded-lg px-3 py-1 text-sm font-semibold hover:bg-gray-200'>
              커뮤니티
            </Link>
            <Link href='/inquiry' className='rounded-lg px-3 py-1 text-sm font-semibold hover:bg-gray-200'>
              문의
            </Link>
          </nav>
        </div>
        <div className='flex items-center space-x-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='rounded-full'>
                <Avatar className='h-8 w-8'>
                  <AvatarFallback>test</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem className='hover:bg-gray-200'>
                <Link href='#' prefetch={false}>
                  내 정보
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='hover:bg-gray-200'>
                <Link href='#' prefetch={false}>
                  설정
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='hover:bg-gray-200'>
                <Link href='#' prefetch={false}>
                  로그아웃
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
