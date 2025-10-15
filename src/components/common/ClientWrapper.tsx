'use client';

import Header from "@/components/Header/indext";
import React from "react";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="pt-[64px]">{children}</main>
        </>
    );
}
