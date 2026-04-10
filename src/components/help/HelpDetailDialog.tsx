"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Help = {
    id: number;
    type: string;
    status: string;
    title: string;
    content: string;
    createdAt: string;
    writer?: string;
    answer?: string | null;
    answeredAt?: string | null;
};

interface Props {
    help: Help | null;
    username: string;
    isAdmin: boolean;
    onClose: () => void;
    onSave: (id: number, title: string, content: string) => Promise<void>;
    onAnswer: (id: number, answer: string) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    preferWriter?: boolean;
}

export default function HelpDetailDialog({
                                             help,
                                             username,
                                             isAdmin,
                                             onClose,
                                         onSave,
                                         onAnswer,
                                         onDelete,
                                         preferWriter = false,
                                         }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [saving, setSaving] = useState(false);
    const [isAnswering, setIsAnswering] = useState(false);
    const [answerText, setAnswerText] = useState("");
    const [answerSaving, setAnswerSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (!help) return;
        setAnswerText(help.answer ?? "");
        setIsAnswering(false);
    }, [help]);

    if (!help) return null;

    const contentText = help.content?.trim();
    const displayContent = contentText ? help.content : t("help.noContent");

    const handleSave = async () => {
        setSaving(true);
        await onSave(help.id, editTitle, editContent);
        setIsEditing(false);
        setSaving(false);
    };

    const handleAnswerSave = async () => {
        const trimmed = answerText.trim();
        if (!trimmed) {
            alert(t("help.replyRequired"));
            return;
        }
        setAnswerSaving(true);
        await onAnswer(help.id, trimmed);
        setIsAnswering(false);
        setAnswerSaving(false);
        alert(t("help.replySaved"));
    };

    const handleDelete = async () => {
        if (!confirm(t("common.confirmDelete"))) return;

        setDeleting(true);
        await onDelete(help.id);
        setDeleting(false);
        alert(t("help.deleteSuccess"));
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
            <div className="theme-card w-full max-w-3xl rounded-3xl p-4 text-white sm:p-6">
                {isEditing ? (
                    <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder={help.title}
                        className="
                        w-full rounded-md border border-white/30 bg-white/90 p-3 text-base font-bold text-slate-900 mb-2 sm:text-lg
                        placeholder:text-slate-400
                                    "
                    />
                ) : (
                    <h2 className="text-xl font-bold mb-2">{help.title}</h2>
                )}

                <p className="text-sm text-white/70 font-semibold mb-2">
                    {t("help.author")}: {preferWriter ? help.writer ?? username : username}
                </p>

                <hr className="border-t border-white/20 my-4" />

                {isEditing ? (
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder={help.content}
                        className="
                        w-full rounded-md border border-white/30 bg-white/90 p-3 text-base text-slate-900 resize-none h-64 sm:h-[400px] sm:p-4
                        placeholder:text-slate-400
                                    "
                    />

                ) : (
                    <div className="text-white/90 whitespace-pre-wrap mb-4 h-64 overflow-y-auto sm:h-[400px]">
                        {displayContent}
                    </div>
                )}

                <div className="mt-4 rounded-xl border border-white/15 bg-white/5 p-4">
                    <div className="mb-2 text-sm font-semibold text-white">
                        {t("help.replyTitle")}
                    </div>
                    {isAdmin && isAnswering ? (
                        <textarea
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            placeholder={t("help.replyPlaceholder")}
                            className="w-full rounded-md border border-white/30 bg-white/90 p-3 text-base text-slate-900 placeholder:text-slate-400 h-36 resize-none"
                        />
                    ) : help.answer ? (
                        <div className="whitespace-pre-wrap text-white/90">
                            {help.answer}
                        </div>
                    ) : (
                        <div className="text-sm text-white/60">
                            {t("help.replyPending")}
                        </div>
                    )}
                </div>

                {!isAdmin && (
                    <div className="text-sm text-white/60">
                        {t("help.adminOnlyHint")}
                    </div>
                )}
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="theme-btn-secondary rounded-md px-6 py-3 transition hover:brightness-110 w-full sm:w-auto"
                                disabled={saving}
                            >
                                {t("common.cancel")}
                            </button>
                            <button
                                onClick={handleSave}
                                className="theme-btn-primary rounded-md px-6 py-3 transition hover:brightness-110 disabled:opacity-50 w-full sm:w-auto"
                                disabled={saving}
                            >
                                {saving ? t("common.saving") : t("common.save")}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={
                                    isAdmin
                                        ? () => setIsAnswering((prev) => !prev)
                                        : undefined
                                }
                                disabled={!isAdmin}
                                title={!isAdmin ? t("help.adminOnlyHint") : undefined}
                                className={[
                                    "theme-btn-secondary rounded-md px-6 py-3 transition w-full sm:w-auto",
                                    isAdmin
                                        ? "hover:brightness-110"
                                        : "opacity-60 cursor-not-allowed",
                                ].join(" ")}
                            >
                                {isAnswering
                                    ? t("common.cancel")
                                    : help.answer
                                        ? t("help.replyEdit")
                                        : t("help.replySubmit")}
                            </button>
                            {isAnswering && (
                                <button
                                    onClick={isAdmin ? handleAnswerSave : undefined}
                                    title={!isAdmin ? t("help.adminOnlyHint") : undefined}
                                    className={[
                                        "theme-btn-primary rounded-md px-6 py-3 transition w-full sm:w-auto",
                                        isAdmin
                                            ? "hover:brightness-110 disabled:opacity-50"
                                            : "opacity-60 cursor-not-allowed",
                                    ].join(" ")}
                                    disabled={!isAdmin || answerSaving}
                                >
                                    {answerSaving ? t("common.saving") : t("common.save")}
                                </button>
                            )}
                            <button
                                onClick={
                                    isAdmin
                                        ? () => {
                                              setEditTitle(help.title);
                                              setEditContent(help.content);
                                              setIsEditing(true);
                                          }
                                        : undefined
                                }
                                disabled={!isAdmin}
                                title={!isAdmin ? t("help.adminOnlyHint") : undefined}
                                className={[
                                    "theme-btn-secondary rounded-md px-6 py-3 transition w-full sm:w-auto",
                                    isAdmin
                                        ? "hover:brightness-110"
                                        : "opacity-60 cursor-not-allowed",
                                ].join(" ")}
                            >
                                {t("common.edit")}
                            </button>

                            <button
                                onClick={isAdmin ? handleDelete : undefined}
                                className={[
                                    "theme-btn-secondary rounded-md px-6 py-3 transition w-full sm:w-auto",
                                    isAdmin
                                        ? "hover:brightness-110 disabled:opacity-50"
                                        : "opacity-60 cursor-not-allowed",
                                ].join(" ")}
                                disabled={!isAdmin || deleting}
                                title={!isAdmin ? t("help.adminOnlyHint") : undefined}
                            >
                                {deleting ? t("common.deleting") : t("common.delete")}
                            </button>
                            <button
                                onClick={onClose}
                                className="theme-btn-secondary rounded-md px-6 py-3 transition hover:brightness-110 w-full sm:w-auto"
                            >
                                {t("common.close")}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
