"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import HelpTabs from "@/components/help/HelpTabs";
import HelpTable from "@/components/help/HelpTable";
import HelpDetailDialog from "@/components/help/HelpDetailDialog";
import { deleteHelpRequest, getHelpRequest, updateHelpRequest } from "@/api/requests/help";
import { getAdminUsersRequest, updateAdminUserBlockRequest } from "@/api/requests/admin";

export default function AdminPageClient() {
    const { t } = useTranslation();
    const user = useUserStore((s) => s.user);
    const isLoggedIn = !!user;
    const isOperator = user?.role === "OPERATOR";
    const username = user?.nickname || "";

    const [data, setData] = useState<HelpItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [viewType, setViewType] = useState<"all" | "usage" | "personal">("all");
    const [selectedHelp, setSelectedHelp] = useState<HelpItem | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [bulkWorking, setBulkWorking] = useState(false);
    const [bulkAnswer, setBulkAnswer] = useState("");
    const bulkTemplates = [
        "admin.templateChecked",
        "admin.templateInProgress",
        "admin.templateResolved",
    ];

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [userActionIds, setUserActionIds] = useState<string[]>([]);

    const filteredData = useMemo(() => {
        if (viewType === "all") return data;
        return data.filter((item) => item.type === viewType);
    }, [data, viewType]);

    const loadHelps = async () => {
        setLoading(true);
        try {
            const res = await getHelpRequest();
            setData(Array.isArray(res) ? res : []);
            setSelectedIds([]);
        } catch {
            setData([]);
            setSelectedIds([]);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        setUsersLoading(true);
        try {
            const res = await getAdminUsersRequest();
            setUsers(Array.isArray(res) ? res : []);
        } catch {
            setUsers([]);
        } finally {
            setUsersLoading(false);
        }
    };

    useEffect(() => {
        if (!isOperator) return;
        loadHelps();
        loadUsers();
    }, [isOperator]);

    const handleSave = async (id: number, title: string, content: string) => {
        try {
            await updateHelpRequest(id, { title, content });
            setData((prev) =>
                prev.map((h) => (h.id === id ? { ...h, title, content } : h))
            );
            setSelectedHelp((prev) =>
                prev ? { ...prev, title, content } : prev
            );
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                alert(t("help.adminOnly"));
                return;
            }
            alert(t("common.errorOccurred"));
        }
    };

    const handleAnswer = async (id: number, answer: string) => {
        try {
            await updateHelpRequest(id, { answer, status: "DONE" });
            setData((prev) =>
                prev.map((h) =>
                    h.id === id ? { ...h, answer, status: "DONE" } : h
                )
            );
            setSelectedHelp((prev) =>
                prev ? { ...prev, answer, status: "DONE" } : prev
            );
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                alert(t("help.adminOnly"));
                return;
            }
            alert(t("common.errorOccurred"));
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteHelpRequest(id);
            setData((prev) => prev.filter((h) => h.id !== id));
            setSelectedHelp(null);
            setSelectedIds((prev) => prev.filter((item) => item !== id));
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                alert(t("help.adminOnly"));
                return;
            }
            alert(t("common.errorOccurred"));
        }
    };

    const isWaitStatus = (status: string) =>
        status === "WAIT" || status === "처리대기" || status === "PENDING";

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const toggleAll = (checked: boolean) => {
        if (!checked) {
            setSelectedIds([]);
            return;
        }
        setSelectedIds(filteredData.map((item) => item.id));
    };

    const bulkCompleteSelected = async () => {
        if (selectedIds.length === 0) {
            alert(t("admin.bulkEmpty"));
            return;
        }
        if (!confirm(t("admin.bulkConfirm"))) return;

        const targetIds = selectedIds.filter((id) => {
            const item = data.find((h) => h.id === id);
            return item && isWaitStatus(item.status);
        });
        if (targetIds.length === 0) {
            alert(t("admin.bulkNothing"));
            return;
        }

        setBulkWorking(true);
        try {
            const resolvedAnswer = bulkAnswer.trim().replaceAll("{operator}", username || "");
            const payload =
                resolvedAnswer.length > 0
                    ? { status: "DONE", answer: resolvedAnswer }
                    : { status: "DONE" };
            await Promise.all(targetIds.map((id) => updateHelpRequest(id, payload)));
            setData((prev) =>
                prev.map((h) =>
                    targetIds.includes(h.id)
                        ? { ...h, status: "DONE", answer: payload.answer ?? h.answer }
                        : h
                )
            );
        } catch {
            alert(t("common.errorOccurred"));
        } finally {
            setBulkWorking(false);
        }
    };

    const bulkCompleteAllWait = async () => {
        const waitIds = data.filter((h) => isWaitStatus(h.status)).map((h) => h.id);
        if (waitIds.length === 0) {
            alert(t("admin.bulkNothing"));
            return;
        }
        if (!confirm(t("admin.bulkConfirmAll"))) return;

        setBulkWorking(true);
        try {
            const resolvedAnswer = bulkAnswer.trim().replaceAll("{operator}", username || "");
            const payload =
                resolvedAnswer.length > 0
                    ? { status: "DONE", answer: resolvedAnswer }
                    : { status: "DONE" };
            await Promise.all(waitIds.map((id) => updateHelpRequest(id, payload)));
            setData((prev) =>
                prev.map((h) =>
                    waitIds.includes(h.id)
                        ? { ...h, status: "DONE", answer: payload.answer ?? h.answer }
                        : h
                )
            );
            setSelectedIds((prev) => prev.filter((id) => !waitIds.includes(id)));
        } catch {
            alert(t("common.errorOccurred"));
        } finally {
            setBulkWorking(false);
        }
    };

    const handleBlockToggle = async (target: AdminUser, nextBlocked: boolean) => {
        if (!confirm(t(nextBlocked ? "admin.userBlockConfirm" : "admin.userUnblockConfirm"))) {
            return;
        }
        setUserActionIds((prev) => [...prev, target.userId]);
        try {
            const updated = await updateAdminUserBlockRequest(target.userId, nextBlocked);
            setUsers((prev) => prev.map((u) => (u.userId === updated.userId ? updated : u)));
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                alert(t("help.adminOnly"));
                return;
            }
            alert(t("common.errorOccurred"));
        } finally {
            setUserActionIds((prev) => prev.filter((id) => id !== target.userId));
        }
    };

    return (
        <div className="theme-page relative min-h-screen px-4 pb-16 pt-28 md:px-8">
            <div className="theme-glow-1 pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full blur-3xl" />
            <div className="theme-glow-2 pointer-events-none absolute -bottom-24 right-6 h-48 w-48 rounded-full blur-2xl" />
            <div className="theme-stars pointer-events-none absolute inset-0" />

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8">
                <div className="theme-card rounded-3xl p-6 text-white shadow-lg md:p-8">
                    <p className="text-sm font-semibold text-white/70">{t("admin.badge")}</p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                        {t("admin.title")}
                    </h1>
                    <p className="mt-3 max-w-2xl text-base text-white/70 md:text-lg">
                        {t("admin.subtitle")}
                    </p>
                </div>

                {!isLoggedIn && (
                    <div className="theme-card rounded-2xl p-6 text-white">
                        <h2 className="text-lg font-semibold">{t("admin.loginRequiredTitle")}</h2>
                        <p className="mt-2 text-sm text-white/70">{t("admin.loginRequiredBody")}</p>
                        <Button asChild className="theme-btn-primary mt-4">
                            <Link href="/login">{t("admin.loginCta")}</Link>
                        </Button>
                    </div>
                )}

                {isLoggedIn && !isOperator && (
                    <div className="theme-card rounded-2xl p-6 text-white">
                        <h2 className="text-lg font-semibold">{t("admin.noAccessTitle")}</h2>
                        <p className="mt-2 text-sm text-white/70">{t("admin.noAccessBody")}</p>
                        <Button asChild className="theme-btn-secondary mt-4">
                            <Link href="/">{t("admin.backHome")}</Link>
                        </Button>
                    </div>
                )}

                {isLoggedIn && isOperator && (
                    <>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="theme-card rounded-2xl p-6 text-white">
                                <h3 className="text-lg font-semibold">{t("admin.helpTitle")}</h3>
                                <p className="mt-2 text-sm text-white/70">{t("admin.helpBody")}</p>
                                <Button asChild className="theme-btn-primary mt-4">
                                    <Link href="/help">{t("admin.helpCta")}</Link>
                                </Button>
                            </div>
                            <div className="theme-card rounded-2xl p-6 text-white">
                                <h3 className="text-lg font-semibold">{t("admin.guideTitle")}</h3>
                                <p className="mt-2 text-sm text-white/70">{t("admin.guideBody")}</p>
                                <Button asChild className="theme-btn-secondary mt-4">
                                    <Link href="/feature">{t("admin.guideCta")}</Link>
                                </Button>
                            </div>
                        </div>

                        <section className="theme-card rounded-3xl p-6 text-white md:p-8">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">{t("admin.queueTitle")}</h2>
                                    <p className="mt-1 text-sm text-white/70">{t("admin.queueSubtitle")}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        className="theme-btn-secondary"
                                        onClick={bulkCompleteSelected}
                                        disabled={bulkWorking || loading}
                                    >
                                        {t("admin.bulkComplete")}
                                    </Button>
                                    <Button
                                        className="theme-btn-secondary"
                                        onClick={bulkCompleteAllWait}
                                        disabled={bulkWorking || loading}
                                    >
                                        {t("admin.bulkCompleteAll")}
                                    </Button>
                                    <Button
                                        className="theme-btn-secondary"
                                        onClick={loadHelps}
                                        disabled={loading}
                                    >
                                        {t("admin.refresh")}
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-col gap-4">
                                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                                    <textarea
                                        value={bulkAnswer}
                                        onChange={(e) => setBulkAnswer(e.target.value)}
                                        placeholder={t("admin.bulkAnswerPlaceholder")}
                                        className="min-h-[96px] w-full rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white placeholder:text-white/60"
                                    />
                                    <div className="flex flex-col gap-2">
                                        <select
                                            className="theme-btn-secondary rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
                                            onChange={(e) => {
                                                const key = e.target.value;
                                                if (!key) return;
                                                const template = t(key);
                                                setBulkAnswer(template);
                                                e.currentTarget.selectedIndex = 0;
                                            }}
                                        >
                                            <option value="">{t("admin.bulkTemplateSelect")}</option>
                                            {bulkTemplates.map((key) => (
                                                <option key={key} value={key}>
                                                    {t(key)}
                                                </option>
                                            ))}
                                        </select>
                                        <Button
                                            className="theme-btn-secondary"
                                            onClick={() => setBulkAnswer("")}
                                            disabled={bulkWorking || bulkAnswer.length === 0}
                                        >
                                            {t("admin.bulkAnswerClear")}
                                        </Button>
                                    </div>
                                </div>
                                <HelpTabs value={viewType} onChange={setViewType} />
                                <HelpTable
                                    data={filteredData}
                                    loading={loading}
                                    username={username}
                                    onSelect={(help) => setSelectedHelp(help)}
                                    selectable
                                    selectedIds={selectedIds}
                                    onToggleSelect={toggleSelect}
                                    onToggleAll={toggleAll}
                                    preferWriter
                                />
                                <div className="text-xs text-white/60">
                                    {t("admin.bulkSelected", { count: selectedIds.length })}
                                </div>
                            </div>
                        </section>

                        <section className="theme-card rounded-3xl p-6 text-white md:p-8">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">{t("admin.userTitle")}</h2>
                                    <p className="mt-1 text-sm text-white/70">{t("admin.userSubtitle")}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        className="theme-btn-secondary"
                                        onClick={loadUsers}
                                        disabled={usersLoading}
                                    >
                                        {t("admin.refresh")}
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-5">
                                {usersLoading ? (
                                    <div className="theme-card rounded-2xl py-12 text-center text-sm text-white/70">
                                        {t("admin.userLoading")}
                                    </div>
                                ) : users.length === 0 ? (
                                    <div className="theme-card rounded-2xl py-12 text-center text-sm text-white/70">
                                        {t("admin.userEmpty")}
                                    </div>
                                ) : (
                                    <div className="theme-card overflow-hidden rounded-3xl">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-[720px] w-full text-sm text-white/80">
                                                <thead className="border-b border-white/20 bg-white/10 text-white/70">
                                                    <tr>
                                                        <th className="p-3 text-center">{t("admin.userName")}</th>
                                                        <th className="p-3 text-center">{t("admin.userEmail")}</th>
                                                        <th className="p-3 text-center">{t("admin.userRole")}</th>
                                                        <th className="p-3 text-center">{t("admin.userStatus")}</th>
                                                        <th className="p-3 text-center">{t("admin.userLastLogin")}</th>
                                                        <th className="p-3 text-center">{t("admin.userAction")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.map((u) => {
                                                        const isBusy = userActionIds.includes(u.userId);
                                                        const isOperatorUser = u.role === "OPERATOR";
                                                        const isSelf = u.userId === user?.id;
                                                        return (
                                                            <tr key={u.userId} className="border-b border-white/10">
                                                                <td className="p-3 text-center">{u.nickname}</td>
                                                                <td className="p-3 text-center">{u.email}</td>
                                                                <td className="p-3 text-center">{u.role}</td>
                                                                <td className="p-3 text-center">
                                                                    {u.blocked ? t("admin.userBlocked") : t("admin.userActive")}
                                                                </td>
                                                                <td className="p-3 text-center">
                                                                    {u.lastLoginAt ? new Date(u.lastLoginAt).toISOString().slice(0, 19).replace("T", " ") : "-"}
                                                                </td>
                                                                <td className="p-3 text-center">
                                                                    <Button
                                                                        className={u.blocked ? "theme-btn-secondary" : "theme-btn-primary"}
                                                                        onClick={() => handleBlockToggle(u, !u.blocked)}
                                                                        disabled={isBusy || isOperatorUser || isSelf}
                                                                    >
                                                                        {u.blocked ? t("admin.userUnblock") : t("admin.userBlock")}
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        <HelpDetailDialog
                            help={selectedHelp}
                            username={username}
                            isAdmin
                            onClose={() => setSelectedHelp(null)}
                            onSave={handleSave}
                            onAnswer={handleAnswer}
                            onDelete={handleDelete}
                            preferWriter
                        />
                    </>
                )}
            </div>
        </div>
    );
}

type HelpItem = {
    id: number;
    type: "usage" | "personal" | string;
    status: string;
    title: string;
    content: string;
    createdAt: string;
    writer?: string;
    answer?: string | null;
    answeredAt?: string | null;
};

type AdminUser = {
    userId: string;
    email: string;
    nickname: string;
    role: "USER" | "OPERATOR" | string;
    blocked: boolean;
    lastLoginAt: string | null;
};
