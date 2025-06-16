// ClientWrapper.tsx
'use client';



import Header from "@/components/Header/indext";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="pt-[64px]">{children}</main> {/* 헤더 공간 확보 */}
        </>
    );
}
