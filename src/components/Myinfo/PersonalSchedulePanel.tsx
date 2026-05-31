"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    createPersonalSchedule,
    deletePersonalSchedule,
    getPersonalSchedules,
    updatePersonalSchedule,
} from "@/api/requests/personal";
import type { PersonalSchedule } from "@/types/api/personal";

type EditState = {
    scheduleId: string;
    title: string;
    description?: string;
    location?: string;
    startAt: string;
    endAt: string;
    allDay: boolean;
    recurrenceType?: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";
    recurrenceInterval?: number;
    recurrenceUntil?: string | null;
    recurrenceCount?: number | null;
};

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

export default function PersonalSchedulePanel() {
    const { t } = useTranslation();
    const [schedules, setSchedules] = useState<PersonalSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"list" | "calendar">("list");
    const [monthCursor, setMonthCursor] = useState(() => new Date());

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [startAt, setStartAt] = useState("");
    const [endAt, setEndAt] = useState("");
    const [allDay, setAllDay] = useState(false);
    const [recurrenceType, setRecurrenceType] = useState<
        "NONE" | "DAILY" | "WEEKLY" | "MONTHLY"
    >("NONE");
    const [recurrenceInterval, setRecurrenceInterval] = useState(1);
    const [recurrenceEndType, setRecurrenceEndType] = useState<"none" | "until" | "count">("none");
    const [recurrenceUntil, setRecurrenceUntil] = useState("");
    const [recurrenceCount, setRecurrenceCount] = useState(1);
    const [editing, setEditing] = useState<EditState | null>(null);

    const refresh = async () => {
        setLoading(true);
        try {
            const data = await getPersonalSchedules();
            setSchedules(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleCreate = async () => {
        if (!title.trim() || !startAt || !endAt) return;
        const startDate = new Date(startAt);
        const endDate = new Date(endAt);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate < startDate) {
            alert(t("myinfo.personal.schedule.invalidTime"));
            return;
        }
        if (recurrenceEndType === "until" && recurrenceUntil) {
            const untilDate = new Date(recurrenceUntil);
            const startOnly = new Date(startDate.toISOString().slice(0, 10));
            if (untilDate < startOnly) {
                alert(t("myinfo.personal.schedule.invalidUntil"));
                return;
            }
        }
        if (recurrenceEndType === "count" && recurrenceCount < 1) {
            alert(t("myinfo.personal.schedule.invalidCount"));
            return;
        }
        const created = await createPersonalSchedule({
            title,
            description,
            location,
            startAt,
            endAt,
            allDay,
            recurrenceType,
            recurrenceInterval,
            recurrenceUntil: recurrenceEndType === "until" ? recurrenceUntil : null,
            recurrenceCount: recurrenceEndType === "count" ? recurrenceCount : null,
        });
        setSchedules((prev) => [...prev, created].sort((a, b) => a.startAt.localeCompare(b.startAt)));
        setTitle("");
        setDescription("");
        setLocation("");
        setStartAt("");
        setEndAt("");
        setAllDay(false);
        setRecurrenceType("NONE");
        setRecurrenceInterval(1);
        setRecurrenceEndType("none");
        setRecurrenceUntil("");
        setRecurrenceCount(1);
    };

    const startEdit = (schedule: PersonalSchedule) => {
        setEditing({
            scheduleId: schedule.scheduleId,
            title: schedule.title,
            description: schedule.description ?? "",
            location: schedule.location ?? "",
            startAt: schedule.startAt.slice(0, 16),
            endAt: schedule.endAt.slice(0, 16),
            allDay: schedule.allDay,
            recurrenceType: schedule.recurrenceType ?? "NONE",
            recurrenceInterval: schedule.recurrenceInterval ?? 1,
            recurrenceUntil: schedule.recurrenceUntil ?? null,
            recurrenceCount: schedule.recurrenceCount ?? null,
        });
    };

    const handleUpdate = async () => {
        if (!editing) return;
        const startDate = new Date(editing.startAt);
        const endDate = new Date(editing.endAt);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate < startDate) {
            alert(t("myinfo.personal.schedule.invalidTime"));
            return;
        }
        if (editing.recurrenceUntil) {
            const untilDate = new Date(editing.recurrenceUntil);
            const startOnly = new Date(startDate.toISOString().slice(0, 10));
            if (untilDate < startOnly) {
                alert(t("myinfo.personal.schedule.invalidUntil"));
                return;
            }
        }
        if (editing.recurrenceCount != null && editing.recurrenceCount < 1) {
            alert(t("myinfo.personal.schedule.invalidCount"));
            return;
        }
        const updated = await updatePersonalSchedule(editing.scheduleId, {
            title: editing.title,
            description: editing.description,
            location: editing.location,
            startAt: editing.startAt,
            endAt: editing.endAt,
            allDay: editing.allDay,
            recurrenceType: editing.recurrenceType,
            recurrenceInterval: editing.recurrenceInterval,
            recurrenceUntil: editing.recurrenceUntil,
            recurrenceCount: editing.recurrenceCount,
        });
        setSchedules((prev) =>
            prev.map((s) => (s.scheduleId === updated.scheduleId ? updated : s))
        );
        setEditing(null);
    };

    const handleDelete = async (scheduleId: string) => {
        await deletePersonalSchedule(scheduleId);
        setSchedules((prev) => prev.filter((s) => s.scheduleId !== scheduleId));
    };

    const monthDays = useMemo(() => {
        const start = startOfMonth(monthCursor);
        const end = endOfMonth(monthCursor);
        const days: Date[] = [];
        const startWeekDay = (start.getDay() + 6) % 7;
        for (let i = 0; i < startWeekDay; i++) {
            days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() - (startWeekDay - i)));
        }
        for (let d = 1; d <= end.getDate(); d++) {
            days.push(new Date(start.getFullYear(), start.getMonth(), d));
        }
        while (days.length % 7 !== 0) {
            const last = days[days.length - 1];
            days.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
        }
        return days;
    }, [monthCursor]);

    const expandOccurrencesInRange = (
        schedule: PersonalSchedule,
        rangeStart: Date,
        rangeEnd: Date
    ) => {
        const type = schedule.recurrenceType ?? "NONE";
        if (type === "NONE") {
            const start = new Date(schedule.startAt);
            if (start >= rangeStart && start <= rangeEnd) {
                return [{ schedule, start }];
            }
            return [];
        }
        const interval = schedule.recurrenceInterval ?? 1;
        const until = schedule.recurrenceUntil ? new Date(schedule.recurrenceUntil) : null;
        const maxCount = schedule.recurrenceCount ?? null;

        const occurrences: { schedule: PersonalSchedule; start: Date }[] = [];
        let current = new Date(schedule.startAt);
        let count = 0;

        const addStep = () => {
            if (type === "DAILY") current.setDate(current.getDate() + interval);
            if (type === "WEEKLY") current.setDate(current.getDate() + 7 * interval);
            if (type === "MONTHLY") current.setMonth(current.getMonth() + interval);
        };

        while (current <= rangeEnd) {
            if (current >= rangeStart) {
                occurrences.push({ schedule, start: new Date(current) });
            }
            count += 1;
            if (maxCount && count >= maxCount) break;
            addStep();
            if (until && current > until) break;
        }
        return occurrences;
    };

    const calendarOccurrences = useMemo(() => {
        const rangeStart = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
        const rangeEnd = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0, 23, 59, 59);
        return schedules.flatMap((s) => expandOccurrencesInRange(s, rangeStart, rangeEnd));
    }, [schedules, monthCursor]);

    const scheduleByDate = useMemo(() => {
        const map = new Map<string, PersonalSchedule[]>();
        calendarOccurrences.forEach(({ schedule, start }) => {
            const key = start.toISOString().slice(0, 10);
            const list = map.get(key) ?? [];
            list.push(schedule);
            map.set(key, list);
        });
        return map;
    }, [calendarOccurrences]);

    const upcoming = useMemo(() => {
        const now = new Date();
        const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        return schedules
            .flatMap((s) => expandOccurrencesInRange(s, now, in24h))
            .sort((a, b) => a.start.getTime() - b.start.getTime())
            .slice(0, 5);
    }, [schedules]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!("Notification" in window)) return;
        const now = new Date();
        upcoming.forEach(({ schedule, start }) => {
            const delay = start.getTime() - now.getTime();
            if (delay <= 0 || delay > 24 * 60 * 60 * 1000) return;
            setTimeout(() => {
                if (Notification.permission === "granted") {
                    new Notification(t("myinfo.personal.schedule.notifyTitle"), {
                        body: `${schedule.title} · ${start.toLocaleString()}`,
                    });
                }
            }, delay);
        });
    }, [upcoming, t]);

    const requestNotificationPermission = async () => {
        if (typeof window === "undefined" || !("Notification" in window)) return;
        await Notification.requestPermission();
    };

    const weekdayLabels = useMemo(() => {
        const labels = t("calendar.weekdays", { returnObjects: true }) as string[];
        if (!Array.isArray(labels) || labels.length < 7) {
            return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        }
        return labels;
    }, [t]);

    return (
        <div className="space-y-6">
            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white/80">
                        {t("myinfo.personal.schedule.newTitle")}
                    </h4>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setView("list")}
                            className={[
                                "rounded-lg px-3 py-1 text-xs",
                                view === "list" ? "theme-btn-primary" : "theme-btn-secondary",
                            ].join(" ")}
                        >
                            {t("myinfo.personal.schedule.viewList")}
                        </button>
                        <button
                            onClick={() => setView("calendar")}
                            className={[
                                "rounded-lg px-3 py-1 text-xs",
                                view === "calendar" ? "theme-btn-primary" : "theme-btn-secondary",
                            ].join(" ")}
                        >
                            {t("myinfo.personal.schedule.viewCalendar")}
                        </button>
                    </div>
                </div>

                <input
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40"
                    placeholder={t("myinfo.personal.schedule.titlePlaceholder")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div className="grid gap-3 md:grid-cols-2">
                    <input
                        type="datetime-local"
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                        value={startAt}
                        onChange={(e) => setStartAt(e.target.value)}
                    />
                    <input
                        type="datetime-local"
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                        value={endAt}
                        onChange={(e) => setEndAt(e.target.value)}
                    />
                </div>
                <input
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40"
                    placeholder={t("myinfo.personal.schedule.locationPlaceholder")}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <textarea
                    className="min-h-[100px] w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40"
                    placeholder={t("myinfo.personal.schedule.descriptionPlaceholder")}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <label className="flex items-center gap-2 text-sm text-white/70">
                    <input
                        type="checkbox"
                        checked={allDay}
                        onChange={(e) => setAllDay(e.target.checked)}
                    />
                    {t("myinfo.personal.schedule.allDay")}
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                    <select
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                        value={recurrenceType}
                        onChange={(e) =>
                            setRecurrenceType(
                                e.target.value as "NONE" | "DAILY" | "WEEKLY" | "MONTHLY"
                            )
                        }
                    >
                        <option value="NONE">{t("myinfo.personal.schedule.repeatNone")}</option>
                        <option value="DAILY">{t("myinfo.personal.schedule.repeatDaily")}</option>
                        <option value="WEEKLY">{t("myinfo.personal.schedule.repeatWeekly")}</option>
                        <option value="MONTHLY">{t("myinfo.personal.schedule.repeatMonthly")}</option>
                    </select>
                    <input
                        type="number"
                        min={1}
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                        value={recurrenceInterval}
                        onChange={(e) => setRecurrenceInterval(Number(e.target.value))}
                        placeholder={t("myinfo.personal.schedule.repeatInterval")}
                    />
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                    <select
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                        value={recurrenceEndType}
                        onChange={(e) =>
                            setRecurrenceEndType(e.target.value as "none" | "until" | "count")
                        }
                    >
                        <option value="none">{t("myinfo.personal.schedule.repeatEndNone")}</option>
                        <option value="until">{t("myinfo.personal.schedule.repeatEndUntil")}</option>
                        <option value="count">{t("myinfo.personal.schedule.repeatEndCount")}</option>
                    </select>
                    <input
                        type="date"
                        disabled={recurrenceEndType !== "until"}
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white disabled:opacity-40"
                        value={recurrenceUntil}
                        onChange={(e) => setRecurrenceUntil(e.target.value)}
                    />
                    <input
                        type="number"
                        min={1}
                        disabled={recurrenceEndType !== "count"}
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white disabled:opacity-40"
                        value={recurrenceCount}
                        onChange={(e) => setRecurrenceCount(Number(e.target.value))}
                    />
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={requestNotificationPermission}
                        className="theme-btn-secondary rounded-lg px-3 py-2 text-xs"
                    >
                        {t("myinfo.personal.schedule.enableNotify")}
                    </button>
                    <div className="flex justify-end">
                        <button
                            onClick={handleCreate}
                            className="theme-btn-primary rounded-lg px-4 py-2 text-sm"
                        >
                            {t("myinfo.personal.schedule.create")}
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-sm text-white/60">{t("myinfo.personal.loading")}</div>
            ) : (
                <>
                    {upcoming.length > 0 && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <h5 className="mb-3 text-sm font-semibold text-white/80">
                                {t("myinfo.personal.schedule.upcoming")}
                            </h5>
                            <div className="grid gap-2 text-sm text-white/70">
                                {upcoming.map(({ schedule, start }) => (
                                    <div key={`${schedule.scheduleId}-${start.toISOString()}`}>
                                        {schedule.title} · {start.toLocaleString()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {view === "calendar" ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <button
                                    onClick={() =>
                                        setMonthCursor(
                                            new Date(
                                                monthCursor.getFullYear(),
                                                monthCursor.getMonth() - 1,
                                                1
                                            )
                                        )
                                    }
                                    className="theme-btn-secondary rounded-lg px-3 py-1 text-xs"
                                >
                                    {t("calendar.prevMonth")}
                                </button>
                                <div className="text-sm text-white/80">
                                    {t("calendar.monthLabel", {
                                        year: monthCursor.getFullYear(),
                                        month: monthCursor.getMonth() + 1,
                                    })}
                                </div>
                                <button
                                    onClick={() =>
                                        setMonthCursor(
                                            new Date(
                                                monthCursor.getFullYear(),
                                                monthCursor.getMonth() + 1,
                                                1
                                            )
                                        )
                                    }
                                    className="theme-btn-secondary rounded-lg px-3 py-1 text-xs"
                                >
                                    {t("calendar.nextMonth")}
                                </button>
                            </div>
                            <div className="grid grid-cols-7 gap-2 text-center text-xs text-white/70">
                                {weekdayLabels.map((label: string, idx: number) => (
                                    <div key={idx} className="py-1 font-semibold">
                                        {label}
                                    </div>
                                ))}
                                {monthDays.map((day) => {
                                    const key = day.toISOString().slice(0, 10);
                                    const list = scheduleByDate.get(key) ?? [];
                                    const inMonth = day.getMonth() === monthCursor.getMonth();
                                    return (
                                        <div
                                            key={key}
                                            className={[
                                                "min-h-[70px] rounded-lg border border-white/10 p-1 text-left",
                                                inMonth
                                                    ? "bg-black/20"
                                                    : "bg-black/10 text-white/30",
                                            ].join(" ")}
                                        >
                                            <div className="text-xs font-semibold">
                                                {day.getDate()}
                                            </div>
                                            {list.slice(0, 2).map((item) => (
                                                <div
                                                    key={item.scheduleId}
                                                    className="mt-1 truncate rounded bg-white/10 px-1 py-0.5 text-[10px]"
                                                >
                                                    {item.title}
                                                </div>
                                            ))}
                                            {list.length > 2 && (
                                                <div className="mt-1 text-[10px] text-white/60">
                                                    +{list.length - 2}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : schedules.length === 0 ? (
                        <div className="text-sm text-white/60">
                            {t("myinfo.personal.schedule.empty")}
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {schedules.map((schedule) => {
                                const isEditing = editing?.scheduleId === schedule.scheduleId;
                                return (
                                    <div
                                        key={schedule.scheduleId}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                                    >
                                        {isEditing ? (
                                            <div className="space-y-2">
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
                                                <div className="grid gap-2 md:grid-cols-2">
                                                    <input
                                                        type="datetime-local"
                                                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                                                        value={editing.startAt}
                                                        onChange={(e) =>
                                                            setEditing({
                                                                ...editing,
                                                                startAt: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <input
                                                        type="datetime-local"
                                                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                                                        value={editing.endAt}
                                                        onChange={(e) =>
                                                            setEditing({
                                                                ...editing,
                                                                endAt: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <input
                                                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                                                    value={editing.location ?? ""}
                                                    onChange={(e) =>
                                                        setEditing({
                                                            ...editing,
                                                            location: e.target.value,
                                                        })
                                                    }
                                                />
                                                <textarea
                                                    className="min-h-[80px] w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                                                    value={editing.description ?? ""}
                                                    onChange={(e) =>
                                                        setEditing({
                                                            ...editing,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                />
                                                <label className="flex items-center gap-2 text-xs text-white/70">
                                                    <input
                                                        type="checkbox"
                                                        checked={editing.allDay}
                                                        onChange={(e) =>
                                                            setEditing({
                                                                ...editing,
                                                                allDay: e.target.checked,
                                                            })
                                                        }
                                                    />
                                                    {t("myinfo.personal.schedule.allDay")}
                                                </label>
                                                <div className="grid gap-2 md:grid-cols-2">
                                                    <select
                                                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white"
                                                        value={editing.recurrenceType ?? "NONE"}
                                                        onChange={(e) =>
                                                            setEditing({
                                                                ...editing,
                                                                recurrenceType: e.target.value as
                                                                    | "NONE"
                                                                    | "DAILY"
                                                                    | "WEEKLY"
                                                                    | "MONTHLY",
                                                            })
                                                        }
                                                    >
                                                        <option value="NONE">
                                                            {t("myinfo.personal.schedule.repeatNone")}
                                                        </option>
                                                        <option value="DAILY">
                                                            {t("myinfo.personal.schedule.repeatDaily")}
                                                        </option>
                                                        <option value="WEEKLY">
                                                            {t("myinfo.personal.schedule.repeatWeekly")}
                                                        </option>
                                                        <option value="MONTHLY">
                                                            {t("myinfo.personal.schedule.repeatMonthly")}
                                                        </option>
                                                    </select>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white"
                                                        value={editing.recurrenceInterval ?? 1}
                                                        onChange={(e) =>
                                                            setEditing({
                                                                ...editing,
                                                                recurrenceInterval: Number(
                                                                    e.target.value
                                                                ),
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="grid gap-2 md:grid-cols-2">
                                                    <input
                                                        type="date"
                                                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white"
                                                        value={editing.recurrenceUntil ?? ""}
                                                        onChange={(e) =>
                                                            setEditing({
                                                                ...editing,
                                                                recurrenceUntil:
                                                                    e.target.value || null,
                                                            })
                                                        }
                                                    />
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white"
                                                        value={editing.recurrenceCount ?? ""}
                                                        onChange={(e) =>
                                                            setEditing({
                                                                ...editing,
                                                                recurrenceCount: e.target.value
                                                                    ? Number(e.target.value)
                                                                    : null,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditing(null)}
                                                        className="theme-btn-secondary rounded-lg px-3 py-2 text-xs"
                                                    >
                                                        {t("common.cancel")}
                                                    </button>
                                                    <button
                                                        onClick={handleUpdate}
                                                        className="theme-btn-primary rounded-lg px-3 py-2 text-xs"
                                                    >
                                                        {t("common.save")}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="text-base font-semibold text-white">
                                                        {schedule.title}
                                                    </h5>
                                                    <span className="text-xs text-white/60">
                                                        {schedule.allDay
                                                            ? t("myinfo.personal.schedule.allDay")
                                                            : ""}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-white/70">
                                                    {schedule.startAt.replace("T", " ").slice(0, 16)}{" "}
                                                    ~ {schedule.endAt.replace("T", " ").slice(0, 16)}
                                                </p>
                                                {schedule.location && (
                                                    <p className="text-xs text-white/60">
                                                        {schedule.location}
                                                    </p>
                                                )}
                                                {schedule.description && (
                                                    <p className="text-sm text-white/70">
                                                        {schedule.description}
                                                    </p>
                                                )}
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => startEdit(schedule)}
                                                        className="theme-btn-secondary rounded-lg px-3 py-2 text-xs"
                                                    >
                                                        {t("common.edit")}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(schedule.scheduleId)
                                                        }
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
                </>
            )}
        </div>
    );
}
