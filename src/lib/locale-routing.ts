import { LOCALE, Locale } from "@/enum/locale";

export const URL_LOCALES = ["ko", "en", "ja"] as const;

export type UrlLocale = (typeof URL_LOCALES)[number];

const urlToLocale: Record<UrlLocale, Locale> = {
    ko: LOCALE.KO,
    en: LOCALE.EN,
    ja: LOCALE.JA,
};

const localeToUrl: Record<Locale, UrlLocale> = {
    [LOCALE.KO]: "ko",
    [LOCALE.EN]: "en",
    [LOCALE.JA]: "ja",
};

export function isUrlLocale(value: string | undefined): value is UrlLocale {
    return Boolean(value && URL_LOCALES.includes(value as UrlLocale));
}

export function toLocale(value: string | undefined): Locale {
    return isUrlLocale(value) ? urlToLocale[value] : LOCALE.EN;
}

export function normalizeLocale(value: string | undefined): Locale {
    if (!value) return LOCALE.EN;
    if ((Object.values(LOCALE) as string[]).includes(value)) return value as Locale;
    return toLocale(value.toLowerCase().split("-")[0]);
}

export function toUrlLocale(locale: Locale): UrlLocale {
    return localeToUrl[locale];
}

export function getUrlLocale(pathname: string): UrlLocale | null {
    const segment = pathname.split("/")[1];
    return isUrlLocale(segment) ? segment : null;
}

export function stripUrlLocale(pathname: string): string {
    const locale = getUrlLocale(pathname);
    if (!locale) return pathname || "/";

    const stripped = pathname.slice(locale.length + 1);
    return stripped || "/";
}

export function localizePath(path: string, locale: Locale | UrlLocale): string {
    if (!path.startsWith("/") || path.startsWith("//")) return path;

    const urlLocale = isUrlLocale(locale) ? locale : toUrlLocale(locale);
    const [pathname, suffix = ""] = path.split(/(?=[?#])/u, 2);
    const barePath = stripUrlLocale(pathname);

    return `/${urlLocale}${barePath === "/" ? "" : barePath}${suffix}`;
}
