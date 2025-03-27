import { notFound } from "next/navigation";

interface ProjectPageProps {
    params: {
        projectName: string;
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { projectName } = params;

    // 👉 여기서 서버로 프로젝트 정보 fetch 가능 (선택사항)
    // const project = await fetch(`/api/project/${projectName}`);

    // 예시: 존재하지 않는 프로젝트일 경우
    if (!projectName) {
        notFound(); // 404 페이지로 리디렉션
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold text-purple-600">
                📁 프로젝트: {projectName}
            </h1>

            <p className="mt-4 text-gray-700">
                여기는 <strong>{projectName}</strong> 프로젝트의 대시보드입니다.
            </p>

            {/* TODO: 할 일, 채팅, 팀원 목록 등 표시 */}
        </div>
    );
}
