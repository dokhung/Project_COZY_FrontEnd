'use client';
import React, { useState } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Button } from '../ui/button';
import GoogleIcon from '@/assets/icons/google-icon-logo.svg';
import Image from 'next/image';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const clientId =
    '23891132678-knh4a4gee29o8spbnkumqjnuog45pbgd.apps.googleusercontent.com';

type Props = {
  enabled?: boolean; // 기본 false로 두고, 나중에 true로 켜기
};

const GoogleLoginComponent: React.FC<Props> = ({ enabled = false }) => {
  const [open, setOpen] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (response) => console.log('로그인 성공', response),
    onError: (error) => console.error('로그인 실패', error),
  });

  // 비활성화 상태: 모달만 띄움
  if (!enabled) {
    return (
        <>
          <Button onClick={() => setOpen(true)} className="w-full" variant="outline">
            <Image src={GoogleIcon} alt="구글 아이콘" width={24} height={24} />
            구글 로그인 (미구현)
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>아직 준비 중입니다</AlertDialogTitle>
                <AlertDialogDescription>
                  구글 로그인 기능은 현재 개발 중입니다. 이메일/비밀번호 로그인을 먼저 이용해 주세요.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>닫기</AlertDialogCancel>
                <AlertDialogAction onClick={() => setOpen(false)}>확인</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
    );
  }

  // 활성화 상태: 기존 로직 그대로
  return (
      <GoogleOAuthProvider clientId={clientId}>
        <Button onClick={() => login()} className="w-full" variant="outline">
          <Image src={GoogleIcon} alt="구글 아이콘" width={24} height={24} />
          구글 로그인
        </Button>
      </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;
