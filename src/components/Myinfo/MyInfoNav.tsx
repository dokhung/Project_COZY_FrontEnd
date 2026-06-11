"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { localizePath, stripUrlLocale } from "@/lib/locale-routing";
import { useLocaleStore } from "@/store/useLocalStore";

type NavItem = {
    href: string;
    label: string;
};

export default function MyInfoNav() {
    const pathname = usePathname();
    const routePathname = stripUrlLocale(pathname);
    const locale = useLocaleStore((state) => state.locale);
    const { t } = useTranslation();

    const items: NavItem[] = [
        { href: "/myinfo", label: t("myinfo.nav.profile") },
        { href: "/myinfo/memo", label: t("myinfo.nav.memo") },
        { href: "/myinfo/schedule", label: t("myinfo.nav.schedule") },
        { href: "/myinfo/board", label: t("myinfo.nav.board") },
        { href: "/myinfo/request", label: t("myinfo.nav.requests") },
    ];

    return (
        <nav className="theme-card sticky top-[72px] z-20 flex flex-wrap items-center gap-2 rounded-2xl p-4 text-sm text-white/80 backdrop-blur">
            {items.map((item) => {
                const active =
                    item.href === "/myinfo"
                        ? routePathname === "/myinfo"
                        : routePathname.startsWith(item.href);
                return (
                    <Link
                        key={item.href}
                        href={localizePath(item.href, locale)}
                        className={[
                            "rounded-xl px-3 py-2 transition",
                            active
                                ? "theme-btn-primary"
                                : "theme-btn-secondary text-white/70",
                        ].join(" ")}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
