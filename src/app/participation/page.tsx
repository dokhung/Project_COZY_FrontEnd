import NewProjectButton from "@/components/Participation/NewProjectButton";

export default function Participation() {
    return (
        <main className={"mt-16 h-[calc(100dvh-64px)] flex flex-col items-center justify-center text-center px-6"}>
            <h1 className={"text-2xl font-bold text-gray-800 mb-4"}>아직 참여한 프로젝트가 없습니다.</h1>
            <p className={"text-gray-600 mb-6"}>
                새로운 프로젝트를 시작하거나 기존 프로젝트에 참여해보세요.
            </p>
            <NewProjectButton/>
        </main>
    )
}