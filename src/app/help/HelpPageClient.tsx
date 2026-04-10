"use client";

import nextDynamic from "next/dynamic";

const HelpClient = nextDynamic(() => import("./HelpClient"), { ssr: false });

export default function HelpPageClient() {
    return <HelpClient />;
}
