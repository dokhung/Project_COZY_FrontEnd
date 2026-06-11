"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocaleStore } from "@/store/useLocalStore";

export default function LocaleSync() {
    const locale = useLocaleStore((s) => s.locale);
    const { i18n } = useTranslation();

    useEffect(() => {
        void i18n.changeLanguage(locale);
    }, [locale, i18n]);

    return null;
}
