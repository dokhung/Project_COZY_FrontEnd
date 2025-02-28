'use client';

import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import KakaoLogo from '@/assets/icons/kakao.svg';
import Image from 'next/image';

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Auth: {
        login: (options: { success: (authObj: { access_token: string }) => void; fail: (err: Error) => void }) => void;
      };
    };
  }
}

const KakaoLogin: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Kakao) {
      const script: HTMLScriptElement = document.createElement('script');
      script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
      script.onload = () => {
        if (window.Kakao) {
          window.Kakao.init('1f3c65acdec613a915d1da6425185ea9'); // 카카오 앱 키
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleKakaoLogin = () => {
    if (typeof window !== 'undefined' && window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Auth.login({
        success: (authObj) => {
          console.log(authObj);
        },
        fail: (err) => {
          console.error(err);
        },
      });
    } else {
      console.error('Kakao SDK가 이니셜라이즈 되지 않음.');
    }
  };

  return (
    <div>
      <Button onClick={handleKakaoLogin} className='w-full bg-yellow-300 hover:bg-yellow-400' variant='outline'>
        <Image src={KakaoLogo} alt='카카오 로고' width={24} height={24} />
        카카오 로그인
      </Button>
    </div>
  );
};

export default KakaoLogin;
