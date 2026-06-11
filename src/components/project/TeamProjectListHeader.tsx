"use client";

import { useTranslation } from "react-i18next";

export default function TeamProjectListHeader() {
    const { t } = useTranslation();

    return (
        <div className="theme-card p-6 md:p-8">
            <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.3em] text-white/60">
                    {t("projectList.pageEyebrow")}
                </span>
                <h1 className="text-2xl font-semibold text-white md:text-3xl">
                    {t("projectList.pageTitle")}
                </h1>
                <p className="text-sm text-white/70 md:text-base">
                    {t("projectList.pageDescription")}
                </p>
            </div>
        </div>
    );
}
