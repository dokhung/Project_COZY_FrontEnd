import './globals.css';
import localFont from 'next/font/local';
import React from "react";
import ClientWrapper from "@/components/common/ClientWrapper";

const pretendard = localFont({
    src: '../fonts/PretendardVariable.woff2',
    display: 'swap',
    weight: '45 920',
    variable: '--font-pretendard',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
        <body className={pretendard.className}>
        <ClientWrapper>
            {children}
        </ClientWrapper>
        </body>
        </html>
    );
}
