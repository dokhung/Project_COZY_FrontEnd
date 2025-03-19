'use client';

import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle } from '@/components/ui/alert';
import KakaoLogin from '@/components/login/KakaoLogin';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginComponent, { clientId } from '@/components/login/GoogleLogin';
import { useUserStore } from '@/store/userStore';
import { loginRequest } from '@/api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useUserStore();

  const { isLoggedIn } = useUserStore();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  },[isLoggedIn, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("🔍 로그인 요청 전송: ", { email, password });

      const { user, token } = (await loginRequest(email, password)) || { user: null, token: null };

      if (!token) {
        throw new Error("JWT 토큰이 반환되지 않았습니다.");
      }

      localStorage.setItem('accessToken', token);
      login(user, token);
      router.push('/dashboard');

    } catch (err) {
      console.error("❌ 로그인 실패: ", err);
      setError('로그인에 실패했습니다.');
    }
  };




  return (
      <div className='flex min-h-screen items-center justify-center bg-gray-100'>
        <Card className='w-full max-w-md p-6 shadow-lg bg-white rounded-lg'>
          <CardHeader>
            <CardTitle className='text-center text-gray-800 text-2xl font-bold'>로그인</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {/* 이메일 입력 */}
              <div>
                <Label htmlFor='email' className='text-gray-700'>이메일</Label>
                <Input
                    id='email'
                    type='email'
                    placeholder='이메일을 입력하세요'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* 비밀번호 입력 */}
              <div>
                <Label htmlFor='password' className='text-gray-700'>비밀번호</Label>
                <Input
                    id='password'
                    type='password'
                    placeholder='비밀번호를 입력하세요'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* 에러 메시지 */}
              {error && (
                  <Alert variant='destructive' className="border-red-500 bg-red-100 text-red-800 px-4 py-2 w-full">
                    <AlertTitle className="font-bold">오류</AlertTitle>
                    <p className="text-sm">{error}</p>
                  </Alert>
              )}

              {/* 로그인 버튼 */}
              <Button className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2' onClick={handleLogin}>
                로그인
              </Button>

              {/* 카카오 로그인 */}
              <KakaoLogin />

              {/* 구글 로그인 */}
              <GoogleOAuthProvider clientId={clientId}>
                <GoogleLoginComponent />
              </GoogleOAuthProvider>
            </div>

            {/* 회원가입 링크 */}
            <div className='mt-4 text-center'>
              <p className='text-gray-600'>
                계정이 없으신가요? <a href='/signup' className='underline text-blue-600'>회원가입</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
