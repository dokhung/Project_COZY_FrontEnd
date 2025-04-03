'use client';

import { ReactNode } from "react";
import Header from "@/components/Header/indext";
import {Footer} from "@/components/landings/Footer";

export default function ClientWrapper({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}
