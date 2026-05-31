"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    createPersonalPost,
    deletePersonalPost,
    getPersonalPosts,
    updatePersonalPost,
} from "@/api/requests/personal";
import type { PersonalPost } from "@/types/api/personal";

type EditState = {
    postId: string;
    title: string;
    content: string;
};

export default function PersonalPostPanel() {
    const { t } = useTranslation();
    const [posts, setPosts] = useState<PersonalPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editing, setEditing] = useState<EditState | null>(null);

    const refresh = async () => {
        setLoading(true);
        try {
            const data = await getPersonalPosts();
            setPosts(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleCreate = async () => {
        if (!title.trim() && !content.trim()) return;
        const created = await createPersonalPost({ title, content });
        setPosts((prev) => [created, ...prev]);
        setTitle("");
        setContent("");
    };

    const startEdit = (post: PersonalPost) => {
        setEditing({ postId: post.postId, title: post.title, content: post.content });
    };

    const handleUpdate = async () => {
        if (!editing) return;
        const updated = await updatePersonalPost(editing.postId, {
            title: editing.title,
            content: editing.content,
        });
        setPosts((prev) =>
            prev.map((p) => (p.postId === updated.postId ? updated : p))
        );
        setEditing(null);
    };

    const handleDelete = async (postId: string) => {
        await deletePersonalPost(postId);
        setPosts((prev) => prev.filter((p) => p.postId !== postId));
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="text-sm font-semibold text-white/80">
                    {t("myinfo.personal.post.newTitle")}
                </h4>
                <input
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40"
                    placeholder={t("myinfo.personal.post.titlePlaceholder")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="min-h-[120px] w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40"
                    placeholder={t("myinfo.personal.post.contentPlaceholder")}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex justify-end">
                    <button
                        onClick={handleCreate}
                        className="theme-btn-primary rounded-lg px-4 py-2 text-sm"
                    >
                        {t("myinfo.personal.post.create")}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-sm text-white/60">{t("myinfo.personal.loading")}</div>
            ) : posts.length === 0 ? (
                <div className="text-sm text-white/60">{t("myinfo.personal.post.empty")}</div>
            ) : (
                <div className="grid gap-3">
                    {posts.map((post) => {
                        const isEditing = editing?.postId === post.postId;
                        return (
                            <div
                                key={post.postId}
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
                                            {post.title}
                                        </h5>
                                        <p className="whitespace-pre-line text-sm text-white/70">
                                            {post.content}
                                        </p>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(post)}
                                                className="theme-btn-secondary rounded-lg px-3 py-2 text-xs"
                                            >
                                                {t("common.edit")}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.postId)}
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
