import TabsHeader from "@/components/project/TabsHeader";

export default function ProjectLayout({
                                          children,
                                          params,
                                      }: {
    children: React.ReactNode;
    params: { projectName: string };
}) {
    return (
        <div>
            {/* Header는 최상단에서 이미 존재 */}
            <TabsHeader projectName={params.projectName} />
            <div className="pt-[64px] sm:pt-[72px] px-4 sm:px-10 bg-blue-50 min-h-screen">
                {children}
            </div>
        </div>
    );
}
