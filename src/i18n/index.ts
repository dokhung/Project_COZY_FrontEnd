"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "./locales/ko.json";
import en from "./locales/en.json";
import ja from "./locales/ja.json";

void i18n
    .use(initReactI18next)
    .init({
        resources: {
            ko: { translation: ko },
            en: { translation: en },
            ja: { translation: ja },
        },
        // LocaleSync applies the saved browser locale after hydration.
        lng: "en-US",
        fallbackLng: "en",
        interpolation: { escapeValue: false },
    });

export default i18n;
