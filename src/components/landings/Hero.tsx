'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUserStore } from '@/store/userStore';
import { TeamList } from "@/components/team/TeamList";

export default function Hero() {
    const { isLoggedIn } = useUserStore();

    return (
        <section className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden py-20 md:py-40">
            <div className={"relative z-10 w-full max-w-3xl px-4 md:px-6"}>
                <div className={"mb-8 flex items-center justify-center gap-2"}>
                    <Image src="/logo/LogiImg.svg" alt={"COZY Logo"} width={80} height={80} className={"h-10 w-10 drop-shadow-[0_8px_20px_rgba(8,47,73,0.28)]"}/>
                    <span className={"text-3xl font-bold text-white/90"}>COZY</span>
                </div>
                {!isLoggedIn ? (
                    <>
                        <h1 className="mb-6 text-center text-4xl font-bold leading-tight text-white/95 drop-shadow-[0_2px_18px_rgba(8,47,73,0.35)] md:text-5xl">
                            A collaborative project management tool
                            <br />
                            <span className="text-white/80">for achieving your goals</span>
                        </h1>
                        <Link
                            href="/login"
                            className="theme-btn-primary text-md md:text-lg mx-auto flex h-12 w-full max-w-xs items-center justify-center rounded-xl
                         shadow-lg transition hover:brightness-110"
                        >
                            Get started
                        </Link>
                    </>
                ) : (
                    <div className={"theme-card rounded-2xl p-6"}>
                        <TeamList />
                    </div>

                )}
            </div>

        </section>
    );
}
