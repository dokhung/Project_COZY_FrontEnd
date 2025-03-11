'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { registerRequest } from '@/api/auth';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('signUpDTO', JSON.stringify({ email, password, confirmPassword, nickname }));
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      await registerRequest(formData);

      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      router.push('/login');
    } catch (error : any) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
      <div className='flex min-h-screen items-center justify-center bg-gray-200'>
        <Card className='w-full max-w-md p-6'>
          <CardHeader>
            <CardTitle className='text-center text-black'>회원가입</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='email' className='text-black'>이메일</Label>
                <Input id='email' type='email' placeholder='이메일을 입력하세요' value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor='nickname' className='text-black'>닉네임</Label>
                <Input id='nickname' type='text' placeholder='닉네임을 입력하세요' value={nickname} onChange={(e) => setNickname(e.target.value)} />
              </div>
              <div>
                <Label htmlFor='password' className='text-black'>비밀번호</Label>
                <Input id='password' type='password' placeholder='비밀번호를 입력하세요' value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                <Label htmlFor='confirmPassword' className='text-black'>비밀번호 확인</Label>
                <Input id='confirmPassword' type='password' placeholder='비밀번호를 다시 입력하세요' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div>
                <Label htmlFor='profileImage' className='text-black'>프로필 이미지</Label>
                <Input id='profileImage' type='file' onChange={handleFileChange} />
              </div>

              {error && (
                  <Alert variant='destructive' className="border-red-500 bg-red-100 text-red-800 px-4 py-2 w-full">
                    <AlertTitle className="font-bold">오류</AlertTitle>
                    <p className="text-sm">{error}</p>
                  </Alert>
              )}

              <Button className='w-full' onClick={handleSignup}>회원가입</Button>
            </div>

            <div className='mt-4 text-center'>
              <p className='text-black'>
                이미 계정이 있으신가요? <a href='/login' className='underline'>로그인</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
