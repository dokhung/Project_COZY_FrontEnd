'use client';

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useLocaleStore } from "@/store/useLocalStore";
import { Locale, LOCALE } from "@/enum/locale";
import { getUserSettingsRequest, updateUserSettingsRequest } from "@/api/requests/settings";
import { changeLanguage } from "@/lib/changeLanguage";

type AppSettings = {
    notificationsEmail: boolean;
    notificationsPush: boolean;
    digestWeekly: boolean;
    profileVisible: boolean;
};

const DEFAULT_SETTINGS: AppSettings = {
    notificationsEmail: true,
    notificationsPush: false,
    digestWeekly: true,
    profileVisible: true,
};

const SETTINGS_KEY = "cozy-settings";

export default function SettingsClient() {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, logout } = useUserStore();
    const locale = useLocaleStore((state) => state.locale);

    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as Partial<AppSettings>;
                setSettings((prev) => ({ ...prev, ...parsed }));
            } catch {
                setSettings(DEFAULT_SETTINGS);
            }
        }

        (async () => {
            try {
                const remote = await getUserSettingsRequest();
                    if (remote) {
                        setSettings((prev) => {
                            const merged = {
                                ...prev,
                                notificationsEmail: remote.notificationsEmail ?? prev.notificationsEmail,
                                notificationsPush: remote.notificationsPush ?? prev.notificationsPush,
                                digestWeekly: remote.digestWeekly ?? prev.digestWeekly,
                                profileVisible: remote.profileVisible ?? prev.profileVisible,
                            } as AppSettings;
                            localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
                            return merged;
                        });
                }
            } catch {
                // keep local settings
            } finally {
                setLoaded(true);
            }
        })();
    }, []);

    const saveSettings = (next: AppSettings) => {
        setSettings(next);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
        updateUserSettingsRequest({
            notificationsEmail: next.notificationsEmail,
            notificationsPush: next.notificationsPush,
            digestWeekly: next.digestWeekly,
            profileVisible: next.profileVisible,
            locale,
        }).catch(() => {});
    };

    const languageLabel = useMemo(() => {
        return locale === LOCALE.KO
            ? t("locale.korean")
            : locale === LOCALE.EN
                ? t("locale.english")
                : t("locale.japanese");
    }, [locale, t]);

    const cycleLanguage = () => {
        const order: Locale[] = [LOCALE.EN, LOCALE.KO, LOCALE.JA];
        const currentIndex = order.indexOf(locale);
        const next = order[(currentIndex + 1) % order.length];
        const query = searchParams.toString();
        changeLanguage(next, pathname, query ? `?${query}` : "");
        updateUserSettingsRequest({
            notificationsEmail: settings.notificationsEmail,
            notificationsPush: settings.notificationsPush,
            digestWeekly: settings.digestWeekly,
            profileVisible: settings.profileVisible,
            locale: next,
        }).catch(() => {});
    };

    const onLogout = async () => {
        await logout();
        router.push("/login");
    };

    const updateToggle = (key: keyof AppSettings) => {
        const next = { ...settings, [key]: !settings[key] };
        saveSettings(next);
    };

    return (
        <main className="theme-page relative min-h-[calc(100vh-4rem)] w-full overflow-hidden px-4 py-8 md:py-12">
            <div className="theme-glow-1 pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full blur-3xl" />
            <div className="theme-glow-2 pointer-events-none absolute -bottom-24 right-8 h-52 w-52 rounded-full blur-3xl" />
            <div className="theme-stars pointer-events-none absolute inset-0" />

            <div className="relative z-10 mx-auto w-full max-w-5xl space-y-6">
                <header className="theme-card rounded-2xl px-6 py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">{t("settings.title")}</h1>
                            <p className="text-sm text-white/70">{t("settings.subtitle")}</p>
                        </div>
                        <div className="text-sm text-white/60">
                            {user?.nickname ? `${user.nickname} ${t("settings.signedInAs")}` : ""}
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="theme-card rounded-2xl p-5">
                        <h2 className="text-lg font-semibold text-white">{t("settings.appearanceTitle")}</h2>
                        <p className="mt-1 text-sm text-white/60">{t("settings.appearanceDesc")}</p>

                        <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between rounded-xl border border-white/15 bg-white/10 px-4 py-3">
                                <div>
                                    <div className="text-sm font-semibold text-white">{t("settings.language")}</div>
                                    <div className="text-xs text-white/60">{languageLabel}</div>
                                </div>
                                <button
                                    onClick={cycleLanguage}
                                    className="theme-btn-secondary rounded-lg px-4 py-2 text-xs font-semibold transition hover:brightness-110"
                                >
                                    {t("settings.change")}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="theme-card rounded-2xl p-5">
                        <h2 className="text-lg font-semibold text-white">{t("settings.notificationsTitle")}</h2>
                        <p className="mt-1 text-sm text-white/60">{t("settings.notificationsDesc")}</p>

                        <div className="mt-4 space-y-3">
                            <ToggleRow
                                label={t("settings.emailNoti")}
                                value={settings.notificationsEmail}
                                onClick={() => updateToggle("notificationsEmail")}
                                disabled={!loaded}
                            />
                            <ToggleRow
                                label={t("settings.pushNoti")}
                                value={settings.notificationsPush}
                                onClick={() => updateToggle("notificationsPush")}
                                disabled={!loaded}
                            />
                            <ToggleRow
                                label={t("settings.weeklyDigest")}
                                value={settings.digestWeekly}
                                onClick={() => updateToggle("digestWeekly")}
                                disabled={!loaded}
                            />
                        </div>
                    </div>

                    <div className="theme-card rounded-2xl p-5">
                        <h2 className="text-lg font-semibold text-white">{t("settings.privacyTitle")}</h2>
                        <p className="mt-1 text-sm text-white/60">{t("settings.privacyDesc")}</p>

                        <div className="mt-4 space-y-3">
                            <ToggleRow
                                label={t("settings.profileVisible")}
                                value={settings.profileVisible}
                                onClick={() => updateToggle("profileVisible")}
                                disabled={!loaded}
                            />
                        </div>
                    </div>

                    <div className="theme-card rounded-2xl p-5">
                        <h2 className="text-lg font-semibold text-white">{t("settings.accountTitle")}</h2>
                        <p className="mt-1 text-sm text-white/60">{t("settings.accountDesc")}</p>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <button
                                onClick={() => router.push("/myinfo")}
                                className="theme-btn-secondary rounded-lg px-4 py-2 text-sm font-semibold transition hover:brightness-110"
                            >
                                {t("settings.goMyInfo")}
                            </button>
                            <button
                                onClick={onLogout}
                                className="theme-btn-secondary rounded-lg px-4 py-2 text-sm font-semibold transition hover:brightness-110"
                            >
                                {t("settings.logout")}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

function ToggleRow({
    label,
    value,
    onClick,
    disabled,
}: {
    label: string;
    value: boolean;
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-left transition hover:bg-white/15 disabled:opacity-60"
        >
            <span className="text-sm font-semibold text-white">{label}</span>
            <span
                className={`inline-flex h-6 w-11 items-center rounded-full p-1 transition ${
                    value ? "bg-emerald-400/40" : "bg-white/15"
                }`}
            >
                <span
                    className={`h-4 w-4 rounded-full bg-white transition ${
                        value ? "translate-x-5" : "translate-x-0"
                    }`}
                />
            </span>
        </button>
    );
}
