"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    createHelpRequest,
    deleteHelpRequest,
    getHelpRequest,
    updateHelpRequest,
} from "@/api/requests/help";
import { useUserStore } from "@/store/userStore";

import HelpTabs from "@/components/help/HelpTabs";
import HelpCreateButtons from "@/components/help/HelpCreateButtons";
import HelpTable from "@/components/help/HelpTable";
import HelpCreateDialog from "@/components/help/HelpCreateDialog";
import HelpDetailDialog from "@/components/help/HelpDetailDialog";
import { useTranslation } from "react-i18next";
import { ADMIN_EMAIL } from "@/constants/admin";

type Help = {
    id: number;
    type: "usage" | "personal" | string;
    status: string;
    title: string;
    content: string;
    createdAt: string;
    answer?: string | null;
    answeredAt?: string | null;
};

export default function HelpClient() {
    const { t } = useTranslation();

    const user = useUserStore((s) => s.user);
    const username = user?.nickname || "";
    const isLoggedIn = !!user;
    const isAdmin = user?.role === "OPERATOR" || user?.email === ADMIN_EMAIL;
    const [data, setData] = useState<Help[]>([]);
    const [loading, setLoading] = useState(true);

    const [viewType, setViewType] = useState<"all" | "usage" | "personal">("all");
    const [openType, setOpenType] = useState<"usage" | "personal" | null>(null);

    const [selectedHelp, setSelectedHelp] = useState<Help | null>(null);

    const helpListRequest = async () => {
        setLoading(true);
        try {
            const res = await getHelpRequest();
            setData(Array.isArray(res) ? res : []);
        } catch (error) {
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        helpListRequest();
    }, []);

    const handleCreate = async (title: string, content: string) => {
        if (!openType) return;
        await createHelpRequest(openType, title, content);
        await helpListRequest();
        setOpenType(null);
    };

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
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                alert(t("help.adminOnly"));
                return;
            }
            alert(t("common.errorOccurred"));
        }
    };

    const filteredData =
        viewType === "all"
            ? data
            : data.filter((h) => h.type === viewType);

    return (
        <main className="theme-page relative min-h-[calc(100vh-4rem)] w-full overflow-hidden py-8 md:py-12">
            <div className="theme-glow-1 pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full blur-3xl" />
            <div className="theme-glow-2 pointer-events-none absolute -bottom-24 right-8 h-52 w-52 rounded-full blur-3xl" />
            <div className="theme-stars pointer-events-none absolute inset-0" />
            <div className="relative z-10 mx-auto max-w-5xl space-y-6 px-4 md:px-6">
                <div className="theme-card rounded-2xl px-6 py-4">
                    <HelpTabs value={viewType} onChange={setViewType} />
                </div>

                <HelpCreateButtons
                    onOpen={(type) => {
                        if (!isLoggedIn) {
                            alert(t('common.loginRequired'));
                            return;
                        }
                        setOpenType(type);
                    }}
                />

                <HelpTable
                    data={filteredData}
                    loading={loading}
                    username={username}
                    onSelect={setSelectedHelp}
                />

                <HelpCreateDialog
                    openType={openType}
                    username={username}
                    onSubmit={handleCreate}
                    onClose={() => setOpenType(null)}
                />

                <HelpDetailDialog
                    help={selectedHelp}
                    username={username}
                    isAdmin={isAdmin}
                    onClose={() => setSelectedHelp(null)}
                    onSave={handleSave}
                    onAnswer={handleAnswer}
                    onDelete={handleDelete}
                />
            </div>
        </main>
    );
}
