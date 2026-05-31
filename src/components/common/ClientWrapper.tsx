'use client';
import React from "react";
import LocaleSync from "@/components/common/LocaleSync";
import I18nProvider from "@/components/common/I18nProvider";
import AuthRefreshBridge from "@/components/common/AuthRefreshBridge";
import Header from "@/components/Header/indext";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    return (
        <I18nProvider>
            <LocaleSync />
            <AuthRefreshBridge />
            <Header />
            <div className="min-h-dvh pt-[64px]">
                {children}
            </div>
        </I18nProvider>
    );
}
