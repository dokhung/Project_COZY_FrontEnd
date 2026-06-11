"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { LogOut, MessageCircle, Plus, Send, Users, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
    createChatRoom,
    getChatCandidates,
    getChatRooms,
    getRoomMessages,
    leaveChatRoom,
    sendChatMessage,
} from "@/api/requests/chat";
import { useUserStore } from "@/store/userStore";
import type {
    ChatCandidate,
    ChatMessage,
    ChatRoomSummary,
    ChatRoomType,
} from "@/types/api/chat";

type Props = { type: ChatRoomType; roomName: string };

export default function ChatRoom({ type, roomName }: Props) {
    const { t, i18n } = useTranslation();
    const user = useUserStore((state) => state.user);
    const [rooms, setRooms] = useState<ChatRoomSummary[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [direct, setDirect] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const [candidates, setCandidates] = useState<ChatCandidate[]>([]);
    const [memberIds, setMemberIds] = useState<string[]>([]);
    const [busy, setBusy] = useState(false);
    const messageListRef = useRef<HTMLDivElement>(null);

    const selectedRoom = rooms.find((room) => room.roomId === selectedRoomId);

    const loadRooms = useCallback(async () => {
        try {
            const next = await getChatRooms(type, roomName);
            setRooms(next);
            setSelectedRoomId((current) =>
                next.some((room) => room.roomId === current)
                    ? current
                    : next[0]?.roomId ?? ""
            );
        } catch {
            setError(t("chat.roomLoadFailed"));
        }
    }, [roomName, t, type]);

    const loadMessages = useCallback(async (silent = false) => {
        if (!selectedRoomId) {
            setMessages([]);
            return;
        }
        try {
            const next = await getRoomMessages(selectedRoomId);
            setMessages(next);
            if (!silent) setError("");
        } catch {
            if (!silent) setError(t("chat.loadFailed"));
        }
    }, [selectedRoomId, t]);

    useEffect(() => {
        void loadRooms();
        const timer = window.setInterval(() => void loadRooms(), 5000);
        return () => window.clearInterval(timer);
    }, [loadRooms]);

    useEffect(() => {
        void loadMessages();
        if (!selectedRoomId) return;
        const timer = window.setInterval(() => void loadMessages(true), 2000);
        return () => window.clearInterval(timer);
    }, [loadMessages, selectedRoomId]);

    useEffect(() => {
        const list = messageListRef.current;
        if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
    }, [messages]);

    const openCreate = async () => {
        setShowCreate(true);
        setDirect(false);
        setNewRoomName("");
        setMemberIds([]);
        try {
            setCandidates(await getChatCandidates(type, roomName));
        } catch {
            setError(t("chat.candidateLoadFailed"));
        }
    };

    const submitRoom = async (event: FormEvent) => {
        event.preventDefault();
        if (direct && memberIds.length !== 1) return;
        if (!direct && !newRoomName.trim()) return;
        setBusy(true);
        try {
            const created = await createChatRoom(type, roomName, {
                name: newRoomName.trim(),
                direct,
                memberIds,
            });
            await loadRooms();
            setSelectedRoomId(created.roomId);
            setShowCreate(false);
        } catch {
            setError(t("chat.createFailed"));
        } finally {
            setBusy(false);
        }
    };

    const leave = async () => {
        if (!selectedRoomId || !window.confirm(t("chat.leaveConfirm"))) return;
        setBusy(true);
        try {
            await leaveChatRoom(selectedRoomId);
            setSelectedRoomId("");
            setMessages([]);
            setError("");
            await loadRooms();
        } catch {
            setError(t("chat.leaveFailed"));
        } finally {
            setBusy(false);
        }
    };

    const submitMessage = async (event: FormEvent) => {
        event.preventDefault();
        const trimmed = content.trim();
        if (!trimmed || !selectedRoomId || busy) return;
        setBusy(true);
        try {
            const sent = await sendChatMessage(selectedRoomId, trimmed);
            setMessages((current) => [...current, sent]);
            setContent("");
        } catch {
            setError(t("chat.sendFailed"));
        } finally {
            setBusy(false);
        }
    };

    const selectableCandidates = candidates.filter((candidate) => candidate.userId !== user?.id);

    return (
        <section className="relative mx-auto grid h-[calc(100dvh-9rem)] min-h-0 w-full max-w-6xl grid-cols-1 overflow-hidden rounded-2xl border border-white/20 bg-slate-950/35 text-white shadow-2xl backdrop-blur-xl md:grid-cols-[280px_1fr]">
            <aside className="flex min-h-0 flex-col border-b border-white/15 bg-slate-950/25 md:border-b-0 md:border-r">
                <div className="flex items-center justify-between p-4">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-white/45">{t("chat.rooms")}</p>
                        <h1 className="font-semibold">{roomName}</h1>
                    </div>
                    <button onClick={openCreate} className="rounded-lg bg-cyan-500 p-2 hover:bg-cyan-400" aria-label={t("chat.createRoom")}>
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
                <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3">
                    {rooms.length === 0 && <p className="px-3 py-8 text-center text-sm text-white/45">{t("chat.noRooms")}</p>}
                    {rooms.map((room) => (
                        <button
                            key={room.roomId}
                            onClick={() => setSelectedRoomId(room.roomId)}
                            className={`w-full rounded-xl px-3 py-3 text-left transition ${room.roomId === selectedRoomId ? "bg-white/20" : "hover:bg-white/10"}`}
                        >
                            <div className="flex items-center gap-2">
                                {room.direct ? <MessageCircle className="h-4 w-4 text-cyan-300" /> : <Users className="h-4 w-4 text-cyan-300" />}
                                <span className="truncate text-sm font-semibold">{room.name}</span>
                            </div>
                            <p className="mt-1 truncate text-xs text-white/45">{room.lastMessage || t("chat.noMessages")}</p>
                        </button>
                    ))}
                </div>
            </aside>

            <div className="flex min-h-0 flex-col">
                {selectedRoom ? (
                    <>
                        <header className="flex shrink-0 items-center justify-between border-b border-white/15 px-5 py-3">
                            <div>
                                <h2 className="font-semibold">{selectedRoom.name}</h2>
                                <p className="text-xs text-white/45">{t("chat.memberCount", { count: selectedRoom.memberCount })}</p>
                            </div>
                            <button disabled={busy} onClick={leave} className="rounded-lg p-2 text-white/55 hover:bg-rose-500/20 hover:text-rose-200 disabled:opacity-40" aria-label={t("chat.leave")}>
                                <LogOut className="h-5 w-5" />
                            </button>
                        </header>
                        <div ref={messageListRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5 md:px-6">
                            {messages.length === 0 && <p className="py-16 text-center text-sm text-white/45">{t("chat.emptyDescription")}</p>}
                            {messages.map((message) => {
                                const mine = message.senderId === user?.id;
                                return (
                                    <article key={message.messageId} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                                        <div className="max-w-[82%] md:max-w-[70%]">
                                            <div className={`mb-1 flex flex-wrap gap-x-2 px-1 ${mine ? "justify-end" : ""}`}>
                                                <b className="text-xs text-white/75">{message.senderNickname}{mine ? ` (${t("chat.me")})` : ""}</b>
                                                <span className="text-[11px] text-white/45">{message.currentScheduleTitle ? t("chat.currentSchedule", { title: message.currentScheduleTitle }) : t("chat.noCurrentSchedule")}</span>
                                            </div>
                                            <div className={`rounded-2xl px-4 py-2.5 text-sm ${mine ? "rounded-br-md bg-cyan-500" : "rounded-bl-md border border-white/15 bg-white/10"}`}>
                                                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                                            </div>
                                            <time className={`mt-1 block px-1 text-[11px] text-white/35 ${mine ? "text-right" : ""}`}>
                                                {new Intl.DateTimeFormat(i18n.language, { hour: "2-digit", minute: "2-digit" }).format(new Date(message.createdAt))}
                                            </time>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                        <form onSubmit={submitMessage} className="shrink-0 border-t border-white/15 p-3 md:p-4">
                            {error && <p className="mb-2 text-sm text-rose-300">{error}</p>}
                            <div className="flex gap-2">
                                <textarea value={content} onChange={(e) => setContent(e.target.value)} maxLength={1000} rows={1} placeholder={t("chat.placeholder")} className="min-h-11 flex-1 resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm outline-none" />
                                <button disabled={!content.trim() || busy} className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500 disabled:opacity-40"><Send className="h-5 w-5" /></button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-1 items-center justify-center p-8 text-center text-white/50">{t("chat.selectRoom")}</div>
                )}
            </div>

            {showCreate && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/70 p-4">
                    <form onSubmit={submitRoom} className="theme-card w-full max-w-md rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">{t("chat.createRoom")}</h2>
                            <button type="button" onClick={() => setShowCreate(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => { setDirect(false); setMemberIds([]); }} className={`rounded-lg p-2 ${!direct ? "bg-cyan-500" : "bg-white/10"}`}>{t("chat.groupRoom")}</button>
                            <button type="button" onClick={() => { setDirect(true); setMemberIds([]); }} className={`rounded-lg p-2 ${direct ? "bg-cyan-500" : "bg-white/10"}`}>{t("chat.directRoom")}</button>
                        </div>
                        {!direct && <input value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} maxLength={100} placeholder={t("chat.roomName")} className="mt-4 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none" />}
                        <p className="mt-4 text-sm text-white/60">{direct ? t("chat.selectOneMember") : t("chat.selectMembers")}</p>
                        <div className="mt-2 max-h-52 space-y-1 overflow-y-auto">
                            {selectableCandidates.map((candidate) => {
                                const checked = memberIds.includes(candidate.userId);
                                return (
                                    <label key={candidate.userId} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10">
                                        <input type={direct ? "radio" : "checkbox"} checked={checked} onChange={() => setMemberIds(direct ? [candidate.userId] : checked ? memberIds.filter((id) => id !== candidate.userId) : [...memberIds, candidate.userId])} />
                                        <span>{candidate.nickname}</span>
                                    </label>
                                );
                            })}
                        </div>
                        <button disabled={busy || (direct ? memberIds.length !== 1 : !newRoomName.trim())} className="mt-5 w-full rounded-xl bg-cyan-500 py-3 font-semibold disabled:opacity-40">{t("chat.create")}</button>
                    </form>
                </div>
            )}
        </section>
    );
}
