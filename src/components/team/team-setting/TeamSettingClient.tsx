'use client';

import { useEffect, useState } from "react";
import { useTeamStore } from "@/store/teamStore";
import {
    deleteTeamRequest,
    getTeamDetailInfoRequest,
    updateTeamRequest,
} from "@/api/requests/team";
import ViewPanel from "@/components/team/team-setting/ViewPanel";
import EditPanel from "@/components/team/team-setting/EditPanel";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { getCurrentUserRequest } from "@/api/requests/info";
import type { CurrentUserInfo } from "@/types/api/user";

export type TeamForm = {
    description: string;
    owner: string; // 표시용
    teamName: string; // 표시용
};


type TeamDetailResponse = {
    teamId: string;
    teamName: string;
    description: string;
    leaderName: string;
    leaderId?: string;
    subLeaderId?: string | null;
};

export const TeamSettingClient = () => {
    const { t } = useTranslation();
    const currentTeamId = useTeamStore((s) => s.currentTeamId);

    const [form, setForm] = useState<TeamForm | null>(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTeamName, setDeleteTeamName] = useState("");
    const [deletePassword, setDeletePassword] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [unauthorizedOpen, setUnauthorizedOpen] = useState(false);
    const [unauthorizedMessage, setUnauthorizedMessage] = useState<{ title: string; body: string } | null>(null);
    const [currentUser, setCurrentUser] = useState<CurrentUserInfo | null>(null);

    useEffect(() => {
        if (!currentTeamId) {
            setForm(null);
            setLoading(false);
            return;
        }

        const fetchTeam = async () => {
            try {
                setLoading(true);

                const [detail, me] = await Promise.all([
                    getTeamDetailInfoRequest(currentTeamId),
                    getCurrentUserRequest(),
                ]);

                setForm({
                    teamName: (detail as TeamDetailResponse).teamName,
                    description: (detail as TeamDetailResponse).description,
                    owner: (detail as TeamDetailResponse).leaderName,
                });
                setCurrentUser(me ?? null);
                setTeamMeta(detail as TeamDetailResponse);
            } catch (e) {
                console.error(e);
                alert(t('team.settingsLoadFailed'));
                setForm(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, [currentTeamId, t]);

    const [teamMeta, setTeamMeta] = useState<TeamDetailResponse | null>(null);

    const openDenied = (type: 'edit' | 'delete') => {
        setUnauthorizedMessage({
            title: t('team.settingsEditDeniedTitle'),
            body: type === 'edit'
                ? t('team.settingsEditDeniedBody')
                : t('team.settingsDeleteDeniedBody'),
        });
        setUnauthorizedOpen(true);
    };

    const isLeader = currentUser?.userId && teamMeta?.leaderId
        ? currentUser.userId === teamMeta.leaderId
        : false;
    const isSubLeader = currentUser?.userId && teamMeta?.subLeaderId
        ? currentUser.userId === teamMeta.subLeaderId
        : false;
    const canEdit = isLeader || isSubLeader;
    const canDelete = isLeader || isSubLeader;

    /* 수정 */
    const handleUpdate = async (next: TeamForm) => {
        await updateTeamRequest({
            teamId: currentTeamId,
            description: next.description,
        });

        setForm(next);
        setEditing(false);
        alert(t('team.settingsUpdated'));
    };

    /* 삭제 */
    const handleDelete = async () => {
        if (!form || !currentTeamId) return;
        if (!canDelete) {
            openDenied('delete');
            return;
        }
        if (!deleteTeamName.trim() || !deletePassword.trim()) {
            alert(t('team.settingsDeleteRequired'));
            return;
        }
        if (deleteTeamName.trim() !== form.teamName) {
            alert(t('team.settingsDeleteNameMismatch'));
            return;
        }
        try {
            setDeleting(true);
            await deleteTeamRequest(currentTeamId, {
                teamName: deleteTeamName.trim(),
                password: deletePassword,
            });
            alert(t('team.settingsDeleted'));
            setDeleteOpen(false);
            setDeletePassword("");
            setDeleteTeamName("");
            // TODO: 팀 목록 페이지로 이동
        } catch (error: unknown) {
            const status = axios.isAxiosError(error) ? error.response?.status : undefined;
            const code = axios.isAxiosError(error) ? (error.response?.data as { error?: { errorCode?: string } })?.error?.errorCode : undefined;
            if (status === 403 || code === 'AUTH-001') {
                openDenied('delete');
                return;
            }
            throw error;
        } finally {
            setDeleting(false);
        }
    };

    if (loading || !form) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center">
                <p className="text-white/70">{t('team.settingsLoading')}</p>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] px-4 py-8 md:py-10">
            <div className="theme-card mx-auto w-full max-w-5xl rounded-2xl p-6">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                        {t('team.settingsTitle')}
                    </h1>

                    <button
                        onClick={() => {
                            if (!isLeader) {
                                openDenied('edit');
                                return;
                            }
                            setEditing((e) => !e);
                        }}
                        className="theme-btn-primary rounded-xl px-5 py-2 text-white transition hover:brightness-110 w-full sm:w-auto"
                    >
                        {editing ? t('common.cancel') : t('common.edit')}
                    </button>
                </div>

                <div className="my-4 h-px w-full bg-white/20" />

                {!editing ? (
                    <ViewPanel
                        data={form}
                        onEdit={() => {
                            if (!canEdit) {
                                openDenied('edit');
                                return;
                            }
                            setEditing(true);
                        }}
                        onDelete={() => {
                            if (!canDelete) {
                                openDenied('delete');
                                return;
                            }
                            setDeleteOpen(true);
                        }}
                    />
                ) : (
                    <EditPanel
                        initial={form}
                        onCancel={() => setEditing(false)}
                        onSubmit={handleUpdate}
                        onDelete={() => {
                            if (!canDelete) {
                                openDenied('delete');
                                return;
                            }
                            setDeleteOpen(true);
                        }}
                    />
                )}
            </div>
            {deleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="theme-card w-full max-w-md rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white">
                            {t('team.settingsDeleteTitle')}
                        </h2>
                        <p className="mt-2 text-sm text-white/70">
                            {t('team.settingsDeleteGuide', { name: form.teamName })}
                        </p>
                        <div className="mt-4 space-y-3">
                            <input
                                value={deleteTeamName}
                                onChange={(e) => setDeleteTeamName(e.target.value)}
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/40"
                                placeholder={t('team.settingsDeleteNamePlaceholder')}
                            />
                            <input
                                type="password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/40"
                                placeholder={t('team.settingsDeletePasswordPlaceholder')}
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
                                {deleting ? t('common.deleting') : t('team.settingsDelete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {unauthorizedOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="theme-card w-full max-w-md rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white">
                            {unauthorizedMessage?.title ?? t('team.settingsDeleteDeniedTitle')}
                        </h2>
                        <p className="mt-2 text-sm text-white/70">
                            {unauthorizedMessage?.body ?? t('team.settingsDeleteDeniedBody')}
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
};
