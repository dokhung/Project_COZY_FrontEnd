'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle } from '@/components/ui/alert';
import KakaoLogin from '@/components/login/KakaoLogin';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginComponent, { clientId } from '@/components/login/GoogleLogin';
import { loginRequest } from '@/api/auth';
import { useUserStore } from '@/store/userStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useUserStore();

  const handleLogin = async () => {
    try {
      // ✅ 기존 로그인 정보 제거 후 재로그인
      localStorage.removeItem('accessToken');

      const response = await loginRequest(email, password);
      const { token, user } = response.data;

      console.log('🔹 로그인 성공! 받은 데이터:', user);

      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      login(user, token);
      router.push('/');
    } catch (error : any) {
      console.error('❌ 로그인 실패:', error);
      setError('로그인 실패: ' + (error.response?.data || '서버 오류'));
    }
  };




  return (
      <div className='flex min-h-screen items-center justify-center bg-gray-200'>
        <Card className='w-full max-w-md p-6'>
          <CardHeader>
            <CardTitle className='text-center text-black'>로그인</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {/* 이메일 입력 */}
              <div>
                <Label htmlFor='email' className='text-black'>이메일</Label>
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
                <Label htmlFor='password' className='text-black'>비밀번호</Label>
                <Input
                    id='password'
                    type='password'
                    placeholder='비밀번호를 입력하세요'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* 에러 메시지 표시 */}
              {error && (
                  <Alert
                      variant='destructive'
                      className="border-red-500 bg-red-100 text-red-800 px-4 py-2 w-full"
                  >
                    <AlertTitle className="font-bold">오류</AlertTitle>
                    <p className="text-sm">{error}</p>
                  </Alert>
              )}

              {/* 로그인 버튼 */}
              <Button className='w-full' onClick={handleLogin}>로그인</Button>

              {/* 카카오 로그인 */}
              <KakaoLogin />

              {/* 구글 로그인 */}
              <GoogleOAuthProvider clientId={clientId}>
                <GoogleLoginComponent />
              </GoogleOAuthProvider>
            </div>

            {/* 회원가입 링크 */}
            <div className='mt-4 text-center'>
              <p className='text-black'>
                계정이 없으신가요? <a href='/signup' className='underline'>회원가입</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
