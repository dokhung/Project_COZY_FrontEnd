"use client";

import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    MoveUp,
    MessageCircle,
    Navigation,
    Send,
    Users,
} from "lucide-react";
import type { KeyboardEvent } from "react";
import type { TFunction } from "i18next";
import type { ChatMessage, WorldHelperData } from "./types";

type WorldHeaderProps = {
    helpers: WorldHelperData[];
    t: TFunction;
};

export function WorldHeader({ helpers, t }: WorldHeaderProps) {
    return (
        <section className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 md:p-6">
            <div className="max-w-xl rounded-2xl border border-cyan-100/15 bg-slate-950/55 px-5 py-4 shadow-2xl backdrop-blur-xl">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">COZY PLAZA · ONLINE</p>
                <h1 className="text-xl font-black md:text-2xl">{t("communityWorld.title")}</h1>
                <p className="mt-1 text-sm text-white/65">{t("communityWorld.subtitle")}</p>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-cyan-100/80">
                    <Navigation className="h-4 w-4" />
                    {t("communityWorld.controls")}
                </div>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-slate-950/55 p-4 shadow-2xl backdrop-blur-xl md:block">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold">
                    <Users className="h-4 w-4 text-cyan-300" />
                    {t("communityWorld.nearby")} · {helpers.length}
                </div>
                <div className="space-y-2">
                    {helpers.map((helper) => (
                        <div key={helper.name} className="flex items-center gap-2 text-xs text-white/75">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: helper.color }} />
                            <span>{helper.name}</span>
                            <span className="text-[10px] text-white/40">{helper.role}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

type MovementControlsProps = {
    onMove: (code: "KeyW" | "KeyA" | "KeyS" | "KeyD", key: "w" | "a" | "s" | "d") => void;
    onJump: () => void;
};

export function MovementControls({ onMove, onJump }: MovementControlsProps) {
    const controls = [
        { code: "KeyW", key: "w", label: "W / 앞으로 이동", icon: ChevronUp, position: "col-start-2" },
        { code: "KeyA", key: "a", label: "A / 왼쪽으로 이동", icon: ChevronLeft },
        { code: "KeyS", key: "s", label: "S / 아래로 이동", icon: ChevronDown },
        { code: "KeyD", key: "d", label: "D / 오른쪽으로 이동", icon: ChevronRight },
    ] as const;

    return (
        <div className="absolute bottom-5 left-5 grid grid-cols-3 gap-1 rounded-2xl border border-white/15 bg-slate-950/60 p-2 shadow-2xl backdrop-blur-xl md:bottom-6 md:left-6">
            {controls.slice(0, 1).map(({ code, key, label, icon: Icon, position }) => (
                <button
                    key={code}
                    type="button"
                    aria-label={label}
                    onClick={() => onMove(code, key)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white transition hover:bg-cyan-300/25 active:scale-95 ${position ?? ""}`}
                >
                    <Icon className="h-5 w-5" />
                </button>
            ))}
            <button
                type="button"
                aria-label="Space / 점프"
                onClick={onJump}
                className="col-start-3 row-start-1 flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/15 text-cyan-100 transition hover:bg-cyan-300/30 active:scale-95"
            >
                <MoveUp className="h-5 w-5" />
            </button>
            {controls.slice(1).map(({ code, key, label, icon: Icon }) => (
                <button
                    key={code}
                    type="button"
                    aria-label={label}
                    onClick={() => onMove(code, key)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white transition hover:bg-cyan-300/25 active:scale-95"
                >
                    <Icon className="h-5 w-5" />
                </button>
            ))}
        </div>
    );
}

type ChatHistoryProps = {
    messages: ChatMessage[];
    t: TFunction;
};

export function ChatHistory({ messages, t }: ChatHistoryProps) {
    return (
        <section className="absolute bottom-24 right-4 w-[min(360px,calc(100%-2rem))] overflow-hidden rounded-2xl border border-white/15 bg-slate-950/70 shadow-2xl backdrop-blur-xl md:bottom-6 md:right-6">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-sm font-bold">
                <MessageCircle className="h-4 w-4 text-cyan-300" />
                {t("communityWorld.chat")}
            </div>
            <div className="flex h-36 flex-col justify-end gap-2 overflow-y-auto p-4">
                {messages.length === 0 && <p className="text-xs text-white/45">{t("communityWorld.empty")}</p>}
                {messages.map((message) => (
                    <div key={message.id} className={`text-xs ${message.own ? "text-right" : ""}`}>
                        <span className="mb-0.5 block font-bold text-cyan-300">{message.author}</span>
                        <span className={`inline-block rounded-xl px-3 py-2 ${message.own ? "bg-cyan-500/25 text-cyan-50" : "bg-white/10 text-white/80"}`}>
                            {message.text}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}

type ChatInputProps = {
    draft: string;
    onDraftChange: (value: string) => void;
    onSend: () => void;
    t: TFunction;
};

export function ChatInput({ draft, onDraftChange, onSend, t }: ChatInputProps) {
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !event.nativeEvent.isComposing) {
            event.preventDefault();
            onSend();
        }
    };

    return (
        <div className="absolute bottom-5 left-1/2 flex w-[min(440px,calc(100%-8rem))] -translate-x-1/2 gap-2 rounded-2xl border border-white/15 bg-slate-950/70 p-3 shadow-2xl backdrop-blur-xl md:bottom-6 md:w-[min(440px,calc(100%-50rem))]">
            <input
                value={draft}
                onChange={(event) => onDraftChange(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("communityWorld.placeholder")}
                maxLength={120}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/60"
            />
            <button
                type="button"
                onClick={onSend}
                aria-label={t("communityWorld.send")}
                className="rounded-xl bg-cyan-500 px-3 text-slate-950 transition hover:bg-cyan-300"
            >
                <Send className="h-4 w-4" />
            </button>
        </div>
    );
}
