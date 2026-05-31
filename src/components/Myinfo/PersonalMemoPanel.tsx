"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    createPersonalMemo,
    deletePersonalMemo,
    getPersonalMemos,
    updatePersonalMemo,
} from "@/api/requests/personal";
import type { PersonalMemo } from "@/types/api/personal";

type EditState = {
    memoId: string;
    title: string;
    content: string;
    tags: string[];
};

export default function PersonalMemoPanel() {
    const { t } = useTranslation();
    const [memos, setMemos] = useState<PersonalMemo[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState<EditState | null>(null);

    const parseTags = (input: string) => {
        return Array.from(
            new Set(
                input
                    .split(/[#,]/g)
                    .map((t) => t.trim())
                    .filter((t) => t.length > 0)
            )
        );
    };

    const refresh = async () => {
        setLoading(true);
        try {
            const data = await getPersonalMemos();
            setMemos(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleCreate = async () => {
        if (!title.trim() && !content.trim()) return;
        const created = await createPersonalMemo({
            title,
            content,
            tags: parseTags(tagsInput),
        });
        setMemos((prev) => [created, ...prev]);
        setTitle("");
        setContent("");
        setTagsInput("");
    };

    const startEdit = (memo: PersonalMemo) => {
        setEditing({
            memoId: memo.memoId,
            title: memo.title,
            content: memo.content,
            tags: memo.tags ?? [],
        });
    };

    const handleUpdate = async () => {
        if (!editing) return;
        const updated = await updatePersonalMemo(editing.memoId, {
            title: editing.title,
            content: editing.content,
            tags: editing.tags,
        });
        setMemos((prev) =>
            prev.map((m) => (m.memoId === updated.memoId ? updated : m))
        );
        setEditing(null);
    };

    const handleDelete = async (memoId: string) => {
        await deletePersonalMemo(memoId);
        setMemos((prev) => prev.filter((m) => m.memoId !== memoId));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
                <input
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 md:max-w-sm"
                    placeholder={t("myinfo.personal.memo.searchPlaceholder")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <span className="text-xs text-white/50">
                    {t("myinfo.personal.memo.searchHint")}
                </span>
            </div>
            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="text-sm font-semibold text-white/80">
                    {t("myinfo.personal.memo.newTitle")}
                </h4>
                <input
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40"
                    placeholder={t("myinfo.personal.memo.titlePlaceholder")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="min-h-[120px] w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40"
                    placeholder={t("myinfo.personal.memo.contentPlaceholder")}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <input
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40"
                    placeholder={t("myinfo.personal.memo.tagsPlaceholder")}
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                />
                <div className="flex justify-end">
                    <button
                        onClick={handleCreate}
                        className="theme-btn-primary rounded-lg px-4 py-2 text-sm"
                    >
                        {t("myinfo.personal.memo.create")}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-sm text-white/60">{t("myinfo.personal.loading")}</div>
            ) : memos.length === 0 ? (
                <div className="text-sm text-white/60">{t("myinfo.personal.memo.empty")}</div>
            ) : (
                <div className="grid gap-3">
                    {memos
                        .filter((memo) => {
                            if (!search.trim()) return true;
                            const q = search.toLowerCase();
                            return (
                                memo.title.toLowerCase().includes(q) ||
                                memo.content.toLowerCase().includes(q) ||
                                (memo.tags ?? []).some((tag) =>
                                    tag.toLowerCase().includes(q)
                                )
                            );
                        })
                        .map((memo) => {
                        const isEditing = editing?.memoId === memo.memoId;
                        return (
                            <div
                                key={memo.memoId}
                                className="rounded-2xl border border-white/10 bg-white/5 p-4"
                            >
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <input
                                            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                                            value={editing.title}
                                            onChange={(e) =>
                                                setEditing({
                                                    ...editing,
                                                    title: e.target.value,
                                                })
                                            }
                                        />
                                        <textarea
                                            className="min-h-[100px] w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                                            value={editing.content}
                                            onChange={(e) =>
                                                setEditing({
                                                    ...editing,
                                                    content: e.target.value,
                                                })
                                            }
                                        />
                                        <input
                                            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                                            value={editing.tags.join(", ")}
                                            onChange={(e) =>
                                                setEditing({
                                                    ...editing,
                                                    tags: parseTags(e.target.value),
                                                })
                                            }
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setEditing(null)}
                                                className="theme-btn-secondary rounded-lg px-3 py-2 text-sm"
                                            >
                                                {t("common.cancel")}
                                            </button>
                                            <button
                                                onClick={handleUpdate}
                                                className="theme-btn-primary rounded-lg px-3 py-2 text-sm"
                                            >
                                                {t("common.save")}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <h5 className="text-base font-semibold text-white">
                                            {memo.title}
                                        </h5>
                                        {memo.tags && memo.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {memo.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/70"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <p className="whitespace-pre-line text-sm text-white/70">
                                            {memo.content}
                                        </p>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(memo)}
                                                className="theme-btn-secondary rounded-lg px-3 py-2 text-xs"
                                            >
                                                {t("common.edit")}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(memo.memoId)}
                                                className="rounded-lg bg-red-500/20 px-3 py-2 text-xs text-red-100"
                                            >
                                                {t("common.delete")}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
