import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('accessToken')?.value; // ✅ 쿠키에서 토큰 가져오기
    const isLoginPage = req.nextUrl.pathname === '/login';
    const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard');

    // 🔹 로그인하지 않은 사용자가 `/dashboard` 접근 시 `/login`으로 리다이렉트
    if (!token && isDashboardPage) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // 🔹 로그인한 사용자가 `/login` 접근 시 `/dashboard`로 리다이렉트
    if (token && isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

// ✅ `/dashboard`와 `/login` 페이지에 대해서만 middleware 실행
export const config = {
    matcher: ['/dashboard', '/login'],
};
