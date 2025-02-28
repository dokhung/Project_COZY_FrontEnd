'use client';
import React from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Button } from '../ui/button';
import GoogleIcon from '@/assets/icons/google-icon-logo.svg';
import Image from 'next/image';

export const clientId = '23891132678-knh4a4gee29o8spbnkumqjnuog45pbgd.apps.googleusercontent.com';

const GoogleLoginComponent = () => {
  const login = useGoogleLogin({
    onSuccess: (response) => console.log('로그인 성공', response),
    onError: (error) => console.error('로그인 실패', error),
  });
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Button onClick={() => login()} className='w-full' variant='outline'>
        <Image src={GoogleIcon} alt='구글 아이콘' width={24} height={24} />
        구글 로그인
      </Button>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;
