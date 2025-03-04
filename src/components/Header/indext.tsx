import Link from 'next/link';
import AvatarMenu from './AvatarMenu';
import Logo from '../../logo/LogiImg.svg';
import Image from "next/image";

export default async function Header() {
  const isLoggedIn = await checkAuth(); // 서버에서 로그인 여부 체크하는 함수 (쿠키 기반 인증 등)

  return (
      <header className='fixed top-0 z-10 flex w-full items-center justify-center border-b border-b-gray-200 bg-white'>
        <div className='container flex h-16 items-center justify-between px-4 md:px-6'>
          <div className='flex items-center space-x-4'>
            <Link href='/' className='flex items-center space-x-2'>
              <span className='text-blue-500'>
                <Image src={Logo} alt={"Collaboproject Logo"} width={40} height={40}/>
              </span>
              <span className='font-bold text-blue-500'>Collabo</span>
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

          {/* 아바타 드롭다운은 클라이언트 컴포넌트로 분리 */}
          <AvatarMenu isLoggedIn={isLoggedIn} />
        </div>
      </header>
  );
}

// 서버에서 로그인 여부 체크 (쿠키나 세션 기반 처리 예시)
async function checkAuth(): Promise<boolean> {
  return false;
}
