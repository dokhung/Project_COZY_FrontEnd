import "./globals.css";
import localFont from "next/font/local";
import React from "react";
import ClientWrapper from "@/components/common/ClientWrapper";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { LOCALE, Locale } from "@/enum/locale";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const requestHeaders = await headers();
    const headerLocale = requestHeaders.get("x-cozy-locale");
    const initialLocale = Object.values(LOCALE).includes(headerLocale as Locale)
        ? (headerLocale as Locale)
        : LOCALE.EN;

    return (
        <html lang={initialLocale} data-theme="ocean" suppressHydrationWarning>
        <body className={pretendard.className}>
        <ClientWrapper initialLocale={initialLocale}>
            {children}
        </ClientWrapper>
        </body>
        </html>
    );
}
