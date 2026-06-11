"use client";

import React from "react";
import i18n from "@/i18n";
import { Locale } from "@/enum/locale";

export default function I18nProvider({
    children,
    initialLocale,
}: {
    children: React.ReactNode;
    initialLocale: Locale;
}) {
    if (i18n.language !== initialLocale) {
        void i18n.changeLanguage(initialLocale);
    }

    return <>{children}</>;
}
