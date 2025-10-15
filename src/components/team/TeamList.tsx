import {useUserStore} from "@/store/userStore";
import {easeInOut, motion} from "motion/react";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import Link from "next/link";
import {useTeamStore} from "@/store/teamStore";

export function TeamList() {
    const { isLoggedIn } = useUserStore();
    const { teams, addTeam } = useTeamStore();

    const router = useRouter();

    const MotionLink = motion.create(Link);
    const childVariants = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { ease: easeInOut } },
    };

    useEffect(() => {
        if (!isLoggedIn) return;
    }, []);
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto w-full max-w-3xl px-4 mb-10 text-center"
        >
            {teams.length === 0 ? (
                <div>
                    <p className={"text-lg font-semibold text-slate-800"}>You are not in any teams yet</p>
                    <p className={"mt-1 text-sm text-slate-500"}>Create a team or join an existing one to get started.</p>
                    <div><br></br></div>
                    <MotionLink href="/createteam"
                                variants={childVariants}
                                className={"text-md md:text-2lg mx-auto flex h-10 w-60 items-center justify-center rounded-lg bg-blue-400 font-medium text-white shadow-lg hover:bg-blue-700 md:h-14 md:w-64"}
                    >
                        Get started
                    </MotionLink>
                </div>
            ) : (
                <div className={"space-y-5"}>
                    <div className={"text-center"}>
                        <h2>Team List</h2>
                    </div>
                    <br />
                    <ul>

                    </ul>
                </div>
            )}
        </motion.div>
    );
}