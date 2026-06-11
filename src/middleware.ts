import { NextRequest, NextResponse } from "next/server";
import {
    getUrlLocale,
    isUrlLocale,
    stripUrlLocale,
    toLocale,
    toUrlLocale,
    UrlLocale,
} from "@/lib/locale-routing";
import { LOCALE, Locale } from "@/enum/locale";

function preferredLocale(request: NextRequest): UrlLocale {
    const cookieLocale = request.cookies.get("i18next")?.value as Locale | undefined;
    if (cookieLocale && Object.values(LOCALE).includes(cookieLocale)) {
        return toUrlLocale(cookieLocale);
    }

    const accepted = request.headers.get("accept-language")?.toLowerCase() ?? "";
    const detected = accepted
        .split(",")
        .map((entry) => entry.trim().split(";")[0].split("-")[0])
        .find(isUrlLocale);

    return detected ?? "en";
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const urlLocale = getUrlLocale(pathname);

    if (!urlLocale) {
        const redirectUrl = request.nextUrl.clone();
        const locale = preferredLocale(request);
        redirectUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
        return NextResponse.redirect(redirectUrl);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-cozy-locale", toLocale(urlLocale));

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = stripUrlLocale(pathname);

    const response = NextResponse.rewrite(rewriteUrl, {
        request: { headers: requestHeaders },
    });
    response.cookies.set("i18next", toLocale(urlLocale), {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
    });
    return response;
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|logo|fonts|.*\\..*).*)",
    ],
};
