'use client';
import React from "react";
import LocaleSync from "@/components/common/LocaleSync";
import I18nProvider from "@/components/common/I18nProvider";
import AuthRefreshBridge from "@/components/common/AuthRefreshBridge";
import Header from "@/components/Header/indext";
import { Locale } from "@/enum/locale";
import { useLocaleStore } from "@/store/useLocalStore";

export default function ClientWrapper({
    children,
    initialLocale,
}: {
    children: React.ReactNode;
    initialLocale: Locale;
}) {
    if (useLocaleStore.getState().locale !== initialLocale) {
        useLocaleStore.setState({ locale: initialLocale });
    }

    return (
        <I18nProvider initialLocale={initialLocale}>
            <LocaleSync />
            <AuthRefreshBridge />
            <Header />
            <div className="min-h-dvh pt-[64px]">
                {children}
            </div>
        </I18nProvider>
    );
}
