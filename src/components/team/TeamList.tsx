"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { Team, useTeamStore } from "@/store/teamStore";
import { getMyTeamInfoRequest } from "@/api/requests/team";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// teamlist
export function TeamList() {
    const { t } = useTranslation();
    const { isLoggedIn, accessToken } = useUserStore();
    const { teams, setTeams, setCurrentTeamId } = useTeamStore();

    const fetchedRef = useRef(false);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoggedIn || !accessToken) return;
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        (async () => {
            try {
                setLoading(true);
                setErrMsg(null);

                const data = await getMyTeamInfoRequest();
                setTeams(
                    data.filter(t => t.id && t.id.trim() !== "")
                );
            } catch (e: unknown) {
                console.error("Failed to fetch team list:", e);
                setErrMsg(
                    typeof e === 'object' && e !== null && 'response' in e && (e as { response?: { status?: number } }).response?.status === 401
                        ? t('team.sessionExpired')
                        : t('team.listLoadFailed')
                );
                setTeams([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [isLoggedIn, accessToken, setTeams, t]);

    if (!isLoggedIn) return null;

    const listVariants = {
        hidden: { opacity: 0, y: 24, scale: 0.96, filter: "blur(8px)" },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 24, scale: 0.96, rotate: -1 },
        show: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { duration: 0.7, ease: "easeOut" } },
    };

    const particles = [
        { left: "8%", top: "12%", size: 6, duration: 5.6 },
        { left: "18%", top: "28%", size: 4, duration: 4.2 },
        { left: "32%", top: "18%", size: 5, duration: 6.3 },
        { left: "45%", top: "8%", size: 3, duration: 4.8 },
        { left: "58%", top: "22%", size: 6, duration: 5.1 },
        { left: "70%", top: "12%", size: 4, duration: 6.0 },
        { left: "82%", top: "30%", size: 5, duration: 4.6 },
        { left: "10%", top: "60%", size: 4, duration: 5.4 },
        { left: "26%", top: "72%", size: 6, duration: 6.6 },
        { left: "40%", top: "58%", size: 3, duration: 4.9 },
        { left: "62%", top: "64%", size: 5, duration: 6.1 },
        { left: "76%", top: "74%", size: 4, duration: 5.0 },
        { left: "90%", top: "58%", size: 6, duration: 6.8 },
    ];

    return (
        <div className="relative mx-auto w-full max-w-3xl px-4 mb-10 text-center">
            {/* ambient glow */}
            <motion.div
                className="theme-glow-1 pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full blur-3xl"
                animate={{
                    opacity: [0.25, 0.65, 0.25],
                    scale: [1, 1.12, 1],
                    rotate: [0, 6, 0],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="theme-glow-2 pointer-events-none absolute -bottom-28 right-0 h-56 w-56 rounded-full blur-3xl"
                animate={{ opacity: [0.2, 0.55, 0.2], y: [0, -18, 0], x: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="theme-glow-3 pointer-events-none absolute top-12 left-8 h-28 w-28 rounded-full blur-2xl"
                animate={{ opacity: [0.2, 0.45, 0.2], y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* particles */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                {particles.map((p, i) => {
                    const palette = [
                        "bg-[var(--theme-particle-1)] shadow-[0_0_18px_rgba(99,102,241,0.5)]",
                        "bg-[var(--theme-particle-2)] shadow-[0_0_18px_rgba(59,130,246,0.5)]",
                        "bg-[var(--theme-particle-3)] shadow-[0_0_18px_rgba(14,165,233,0.5)]",
                    ];
                    return (
                        <motion.span
                            key={i}
                            className={`absolute rounded-full ${palette[i % palette.length]}`}
                            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
                            animate={{
                                opacity: [0.2, 0.85, 0.2],
                                scale: [1, 1.7, 1],
                                y: [0, -14, 0],
                            }}
                            transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut" }}
                        />
                    );
                })}
            </div>
            {loading && <div className="text-slate-500">{t('team.listLoading')}</div>}
            {!loading && errMsg && (
                <div className="text-red-500 mb-4">{errMsg}</div>
            )}

            {/* 팀이 없을 때 */}
            {!loading && !errMsg && teams.length === 0 && (
                <motion.div
                    variants={listVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-2"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-2xl font-bold mb-4 text-white/80"
                        initial={{ letterSpacing: "0.06em" }}
                        animate={{ letterSpacing: "0em" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {t('team.emptyTitle')}
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-lg font-semibold text-white/90">
                        {t('team.emptySubtitle')}
                    </motion.p>
                    <motion.p variants={itemVariants} className="mt-1 text-sm text-white/60">
                        {t('team.emptyDesc')}
                    </motion.p>
                    <div className="h-4" />
                    <motion.div variants={itemVariants}>
                        <Link
                            href="/createteam"
                            className="theme-btn-primary text-md md:text-lg mx-auto flex h-10 w-full max-w-xs items-center justify-center rounded-lg font-medium text-white shadow-lg hover:brightness-110 md:h-14 md:w-64"
                        >
                            {t('team.emptyCta')}
                        </Link>
                    </motion.div>
                </motion.div>
            )}

            {!loading && !errMsg && teams.length > 0 && (
                <motion.div
                    variants={listVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-5"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="mb-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl"
                        style={{ textShadow: "0 8px 30px rgba(255,255,255,0.2)" }}
                    >
                        {t('team.listHeadline')}
                    </motion.h2>

                    <div className="space-y-5">
                        <motion.div
                            variants={itemVariants}
                            className="text-center"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <h3 className="text-xl font-bold mb-2 text-white">
                                {t('team.listTitle')}
                            </h3>
                        </motion.div>

                        {/* Team List */}
                        {teams.map((team: Team, index: number) => (
                            <motion.div
                                key={team.id}
                                variants={itemVariants}
                                whileHover={{
                                    y: -8,
                                    scale: 1.02,
                                    rotate: 0.3,
                                    boxShadow: "0 20px 50px var(--theme-shadow-strong)",
                                    backgroundColor: "var(--theme-card-hover-bg)",
                                }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 240, damping: 16 }}
                                onClick={() => setCurrentTeamId(team.id)}
                                className="relative flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/60 p-3 shadow-sm transition hover:bg-white/20 sm:p-4"
                            >
                                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/30" />
                                <motion.div
                                    className="pointer-events-none absolute -inset-2 rounded-2xl bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0"
                                    animate={{ opacity: [0, 0.6, 0] }}
                                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <motion.div
                                    className="pointer-events-none absolute -inset-6 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
                                    whileHover={{ opacity: 1, x: [ -40, 40 ] }}
                                    transition={{ duration: 0.9, ease: "easeInOut" }}
                                />
                                <Link
                                    href={`/team/${encodeURIComponent(team.teamName)}/dashboard`}
                                    className="flex-1 text-center"
                                >
                                    <div className="text-base font-semibold text-white sm:text-lg">
                                        {index + 1}. {team.teamName}
                                    </div>
                                    <div className="text-xs text-white/70 sm:text-sm">
                                        {team.description}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                        {/* ➕ Create Team */}
                        <motion.div variants={itemVariants}>
                            <Link
                                href="/createteam"
                                className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/60 p-3 text-white transition hover:bg-purple-300/40 hover:border-white sm:p-4"
                            >
                                <span className="text-xl font-bold sm:text-2xl">+</span>
                                <span className="text-base font-semibold sm:text-lg">
                    {t('team.listCreateTeam')}
                </span>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            )}

        </div>
    );
}
