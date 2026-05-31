import "./globals.css";
import localFont from "next/font/local";
import React from "react";
import ClientWrapper from "@/components/common/ClientWrapper";
import type { Metadata } from "next";

const pretendard = localFont({
    src: '../fonts/PretendardVariable.woff2',
    display: 'swap',
    weight: '50 920',
    variable: '--font-pretendard',
});

export const metadata: Metadata = {
    title: "COZY",
    icons: {
        icon: "/logo/LogiImg.svg",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" data-theme="ocean">
        <body className={pretendard.className}>
        <ClientWrapper>
            {children}
        </ClientWrapper>
        </body>
        </html>
    );
}
