'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from "axios";

import {
    getProjectDetailRequest,
    updateProjectRequest,
    deleteProjectRequest,
} from '@/api/requests/project';
import type { ProjectDetail, UpdateProjectDTO } from "@/types/api/project";

import ViewMode from '@/components/setting/ViewMode';
import EditMode from '@/components/setting/EditMode';
import {useProjectStore} from "@/store/projectStore";
import { useTranslation } from "react-i18next";

export default function ProjectSettings() {
    const { t } = useTranslation();
    const router = useRouter();

    const { projects, currentProjectId, setCurrentProjectId, hasHydrated } = useProjectStore();
    const params = useParams<{ projectName?: string }>();
    const projectId = currentProjectId;

    const [detail, setDetail] = useState<ProjectDetail | null>(null);
    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTeamName, setDeleteTeamName] = useState("");
    const [deletePassword, setDeletePassword] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [unauthorizedOpen, setUnauthorizedOpen] = useState(false);

    // store rehydrate
    useEffect(() => {
        useProjectStore.persist?.rehydrate?.();
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    // route name -> projectId fallback
    useEffect(() => {
        if (!hasHydrated || projectId) return;
        const nameFromRoute = params?.projectName ? decodeURIComponent(String(params.projectName)) : '';
        if (!nameFromRoute) return;
        const matched = projects.find((p) => p.name === nameFromRoute);
        if (matched?.id) setCurrentProjectId(matched.id);
    }, [hasHydrated, projectId, params, projects, setCurrentProjectId]);

    // 🔹 상세 조회
    useEffect(() => {
        if (!hasHydrated || !projectId) return;

        setLoading(true);
        getProjectDetailRequest(projectId)
            .then(setDetail)
            .catch(() => {
                alert(t('projectSettings.loadFailed'));
            })
            .finally(() => setLoading(false));
    }, [hasHydrated, projectId, t]);

    // 🔹 삭제
    const handleDelete = async () => {
        if (!detail) return;
        if (!deleteTeamName.trim() || !deletePassword.trim()) {
            alert(t('projectSettings.deleteRequired'));
            return;
        }
        if (detail.teamName && deleteTeamName.trim() !== detail.teamName) {
            alert(t('projectSettings.deleteNameMismatch'));
            return;
        }
        try {
            setDeleting(true);
            await deleteProjectRequest(detail.projectId, {
                teamName: deleteTeamName.trim(),
                password: deletePassword,
            });
            alert(t('common.deleteSuccess'));
            setDeleteOpen(false);
            setDeletePassword("");
            setDeleteTeamName("");
            router.push('/');
        } catch (error: unknown) {
            const status = axios.isAxiosError(error) ? error.response?.status : undefined;
            const code = axios.isAxiosError(error) ? (error.response?.data as { error?: { errorCode?: string } })?.error?.errorCode : undefined;
            if (status === 403 || code === 'AUTH-001') {
                setUnauthorizedOpen(true);
                return;
            }
            throw error;
        } finally {
            setDeleting(false);
        }
    };

    // 🔹 수정
    const handleSave = async (dto: UpdateProjectDTO) => {
        if (!detail) return;
        await updateProjectRequest(detail.projectId, dto);
        const updated = await getProjectDetailRequest(detail.projectId);
        setDetail(updated);
        setMode('view');
    };

    let content: ReactNode;

    if (!hasHydrated || !mounted) {
        content = <div className="theme-card rounded-2xl p-6 text-white/80"><span suppressHydrationWarning>{mounted ? t('common.loading') : ''}</span></div>;
    } else if (!projectId) {
        content = <div className="theme-card rounded-2xl p-6 text-white/80"><span suppressHydrationWarning>{mounted ? t('projectSettings.noProjectSelected') : ''}</span></div>;
    } else if (loading) {
        content = <div className="theme-card rounded-2xl p-6 text-white/80"><span suppressHydrationWarning>{mounted ? t('common.loading') : ''}</span></div>;
    } else if (!detail) {
        content = <div className="theme-card rounded-2xl p-6 text-white/80"><span suppressHydrationWarning>{mounted ? t('projectSettings.noDetail') : ''}</span></div>;
    } else {
        content = mode === 'view' ? (
            <ViewMode
                data={{
                    projectId: detail.projectId,
                    projectName: detail.projectName,
                    description: detail.description,
                    ownerName: detail.leaderName,
                    devInterest: detail.devInterest,
                    gitHubUrl: detail.gitHubUrl,
                }}
                onEdit={() => setMode('edit')}
                onDelete={() => setDeleteOpen(true)}
            />
        ) : (
            <EditMode
                initial={{
                    projectId: detail.projectId,
                    projectName: detail.projectName,
                    description: detail.description,
                    devInterest: detail.devInterest,
                    gitHubUrl: detail.gitHubUrl,
                }}
                onCancel={() => setMode('view')}
                onSave={handleSave}
            />
        );
    }

    return (
        <main className="theme-page relative min-h-[calc(100vh-4rem)] w-full overflow-hidden py-8 md:py-10">
            <div className="theme-glow-1 pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full blur-3xl" />
            <div className="theme-glow-2 pointer-events-none absolute -bottom-24 right-8 h-52 w-52 rounded-full blur-3xl" />
            <div className="theme-stars pointer-events-none absolute inset-0" />
            <div className="mx-auto max-w-5xl px-4">
                {content}
            </div>
            {deleteOpen && detail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="theme-card w-full max-w-md rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white">
                            {t('projectSettings.deleteTitle')}
                        </h2>
                        <p className="mt-2 text-sm text-white/70">
                            {t('projectSettings.deleteGuide', { name: detail.teamName ?? '' })}
                        </p>
                        <div className="mt-4 space-y-3">
                            <input
                                value={deleteTeamName}
                                onChange={(e) => setDeleteTeamName(e.target.value)}
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/40"
                                placeholder={t('projectSettings.deleteNamePlaceholder')}
                            />
                            <input
                                type="password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/40"
                                placeholder={t('projectSettings.deletePasswordPlaceholder')}
                            />
                        </div>
                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                onClick={() => setDeleteOpen(false)}
                                className="theme-btn-secondary rounded-xl px-4 py-2"
                                disabled={deleting}
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="theme-btn-primary rounded-xl px-4 py-2"
                                disabled={deleting}
                            >
                                {deleting ? t('common.deleting') : t('common.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {unauthorizedOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="theme-card w-full max-w-md rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white">
                            {t('projectSettings.deleteDeniedTitle')}
                        </h2>
                        <p className="mt-2 text-sm text-white/70">
                            {t('projectSettings.deleteDeniedBody')}
                        </p>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setUnauthorizedOpen(false)}
                                className="theme-btn-primary rounded-xl px-4 py-2"
                            >
                                {t('common.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
