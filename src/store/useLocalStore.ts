"use client";

import { create } from "zustand";
import { LOCALE, Locale } from "@/enum/locale";
import Cookies from "js-cookie";

interface LocaleState {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
    // Keep the server render and the client's first render identical.
    locale: LOCALE.EN,
    setLocale: (locale: Locale) => {
        Cookies.set("i18next", locale, { expires: 365 });
        set({ locale });
    },
}));
