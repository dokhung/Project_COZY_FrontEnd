import TabsHeader from "@/components/project/TabsHeader";
import React from "react";

export default function ProjectLayout({
                                          children,
                                          params,
                                      }: {
    children: React.ReactNode;
    params: { projectName: string };
}) {
    return (
        <div className="flex min-h-screen">
            {/*TODO: 왼쪽 메뉴바*/}
            <TabsHeader projectName={params.projectName} />

            {/* TODO : 오른쪽 메뉴바 */}
            <main className="flex-1 bg-gray-100 p-8">
                {children}
            </main>
        </div>
    );
}
