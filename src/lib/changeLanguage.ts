import { Locale } from "@/enum/locale";
import Cookies from "js-cookie";
import { localizePath } from "@/lib/locale-routing";

export function changeLanguage(lang: Locale, pathname: string, search = "") {
    Cookies.set("i18next", lang, { expires: 365 });
    const target = localizePath(`${pathname}${search}`, lang);
    window.location.replace(target);
}
