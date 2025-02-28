'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle } from '@/components/ui/alert';
import KakaoLogin from '@/components/login/KakaoLogin';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginComponent, { clientId } from '@/components/login/GoogleLogin'; // 경로 확인

const Login = () => {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          id,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );
      console.log('응답여부:', response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log('에러발생:', axiosError.response || axiosError.message);
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
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
            <div>
              <Label htmlFor='id' className='text-black'>
                아이디
              </Label>
              <Input id='id' type='text' placeholder='아이디를 입력하세요' value={id} onChange={(e) => setId(e.target.value)} />
            </div>
            <div>
              <Label htmlFor='password' className='text-black'>
                비밀번호
              </Label>
              <Input id='password' type='password' placeholder='비밀번호를 입력하세요' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && (
              <Alert variant='destructive'>
                <AlertTitle>오류</AlertTitle>
                {error}
              </Alert>
            )}
            <Button className='w-full' onClick={handleLogin}>
              로그인
            </Button>

            {/* 카카오로그인 버튼 추가 */}
            <KakaoLogin />

            {/* 구글로그인 버튼 추가 */}
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLoginComponent />
            </GoogleOAuthProvider>
          </div>

          <div className='mt-4 text-center'>
            <p className='text-black'>
              계정이 없으신가요?{' '}
              <a href='/signup' className='underline'>
                회원가입
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
