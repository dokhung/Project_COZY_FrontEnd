"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Footer() {
    const { t } = useTranslation();
    const [hasHydrated, setHasHydrated] = useState(false);
    const year = hasHydrated ? String(new Date().getFullYear()) : "";
    const [openTerms, setOpenTerms] = useState(false);
    const [openPrivacy, setOpenPrivacy] = useState(false);
    const text = (key: string) => (hasHydrated ? t(key) : "");

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    return (
        <footer className="relative z-10 mt-0 select-none border-t border-white/10 bg-white/5">
            <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-8 md:px-6 md:pb-10">
                <div className="grid grid-cols-1 gap-6 text-white/80 md:grid-cols-3">
                    <div>
                        <h3 className="text-base font-semibold text-white">COZY</h3>
                        <p className="mt-2 text-sm text-white/60">
                            {text("footer.tagline")}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white/90">{text("footer.companyInfo")}</h4>
                        <ul className="mt-2 space-y-1 text-sm text-white/60">
                            <li>{text("footer.companyName")}: COZY</li>
                            <li>{text("footer.teamName")}: cozy</li>
                            <li>{text("footer.makers")}: {text("footer.makersValue")}</li>
                            <li>{text("footer.contact")}: ehhiop2642@gmail.com</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white/90">{text("footer.legal")}</h4>
                        <ul className="mt-2 space-y-1 text-sm text-white/60">
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setOpenTerms(true)}
                                    className="text-white/70 underline decoration-white/30 underline-offset-4 transition hover:text-white"
                                >
                                    {text("footer.terms")}
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setOpenPrivacy(true)}
                                    className="text-white/70 underline decoration-white/30 underline-offset-4 transition hover:text-white"
                                >
                                    {text("footer.privacy")}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-4 text-xs text-white/50 md:flex-row">
                    <span suppressHydrationWarning>
                        {year ? `© ${year} COZY. ${text("footer.rights")}` : `© COZY. ${text("footer.rights")}`}
                    </span>
                    <span>{text("footer.madeBy")}</span>
                </div>
            </div>
            <AlertDialog open={openTerms}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{text("footer.terms")}</AlertDialogTitle>
                        <AlertDialogDescription>{text("footer.termsBody")}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setOpenTerms(false)}>
                            {text("common.close")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={openPrivacy}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{text("footer.privacy")}</AlertDialogTitle>
                        <AlertDialogDescription>{text("footer.privacyBody")}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setOpenPrivacy(false)}>
                            {text("common.close")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </footer>
    );
}
