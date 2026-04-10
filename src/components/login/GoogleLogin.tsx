'use client';
import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Button } from '../ui/button';
import GoogleIcon from '@/assets/icons/google-icon-logo.svg';
import Image from 'next/image';
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tr = (key: string) => (mounted ? t(key) : "");

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
            {tr('auth.googleLoginDisabled')}
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{tr('auth.googleLoginComingTitle')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {tr('auth.googleLoginComingDesc')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{tr('common.close')}</AlertDialogCancel>
                <AlertDialogAction onClick={() => setOpen(false)}>{tr('common.ok')}</AlertDialogAction>
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
          {tr('auth.googleLogin')}
        </Button>
      </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;
