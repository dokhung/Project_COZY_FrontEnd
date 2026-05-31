'use client';

import React, { useState } from "react";
import type { UpdateProjectDTO } from "@/types/api/project";
import { useTranslation } from "react-i18next";

type EditProps = {
    initial: {
        projectId: string;
        projectName: string;
        description: string;
        devInterest: string;
        gitHubUrl: string | null;
    };
    onCancel: () => void;
    onSave: (dto: UpdateProjectDTO) => Promise<void>;
};

const INTEREST_OPTIONS = [
    "Back-End","Front-End","AI","Game-Client","Full-Stack","Native-App",
];

export default function EditMode({ initial, onCancel, onSave }: EditProps) {
    const { t } = useTranslation();
    const [projectName, setProjectName]   = useState(initial.projectName);
    const [description, setDescription]   = useState(initial.description || "");
    const [devInterest, setDevInterest]   = useState(
        INTEREST_OPTIONS.includes(initial.devInterest) ? initial.devInterest : ""
    );
    const [gitHubUrl, setGitHubUrl]             = useState(initial.gitHubUrl || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectName.trim()) return alert(t('projectSettings.nameRequired'));
        if (!devInterest)        return alert(t('projectSettings.interestRequired'));
        await onSave({
            projectName,
            devInterest,
            description,
            gitHubUrl,
        });
    };

    return (
        <section className="theme-card rounded-3xl">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3 border-b border-white/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <h2 className="text-lg font-semibold text-white">{t('projectSettings.editTitle')}</h2>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <button type="button" onClick={onCancel}
                                className="theme-btn-secondary rounded-md px-4 py-2 text-sm font-medium transition hover:brightness-110 w-full sm:w-auto">
                            {t('common.cancel')}
                        </button>
                        <button type="submit"
                                className="theme-btn-primary rounded-md px-4 py-2 text-sm font-semibold transition hover:brightness-110 w-full sm:w-auto">
                            {t('common.save')}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                    <div className="theme-card rounded-2xl p-5">
                        <h3 className="mb-3 text-sm font-semibold text-white/80">{t('projectSettings.sections.basic')}</h3>
                        <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3 text-sm text-white/80">
                            <label className="self-center text-white/60">{t('projectSettings.fields.name')}</label>
                            <input value={projectName} onChange={e=>setProjectName(e.target.value)}
                                   className="w-full rounded-md border border-white/30 bg-white/90 px-3 py-2 text-slate-900 outline-none focus:border-white focus:ring-2 focus:ring-white/40"/>

                            <label className="self-center text-white/60">{t('projectSettings.fields.devInterest')}</label>
                            <select value={devInterest} onChange={e=>setDevInterest(e.target.value)}
                                    className="w-full rounded-md border border-white/30 bg-white/90 px-3 py-2 text-slate-900 outline-none focus:border-white focus:ring-2 focus:ring-white/40">
                                <option value="" disabled>{t('projectSettings.selectPlaceholder')}</option>
                                {INTEREST_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>

                            <label className="self-center text-white/60">{t('projectSettings.fields.gitUrl')}</label>
                            <input value={gitHubUrl} onChange={e=>setGitHubUrl(e.target.value)}
                                   placeholder="https://github.com/..."
                                   className="w-full rounded-md border border-white/30 bg-white/90 px-3 py-2 text-slate-900 outline-none focus:border-white focus:ring-2 focus:ring-white/40"/>
                        </div>
                    </div>

                    <div className="theme-card rounded-2xl p-5">
                        <h3 className="mb-3 text-sm font-semibold text-white/80">{t('projectSettings.sections.description')}</h3>
                        <textarea rows={8} value={description} onChange={e=>setDescription(e.target.value)}
                                  className="w-full rounded-md border border-white/30 bg-white/90 px-3 py-2 text-sm text-slate-900 outline-none focus:border-white focus:ring-2 focus:ring-white/40"/>
                    </div>
                </div>
            </form>
        </section>
    );
}
