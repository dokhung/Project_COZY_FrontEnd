// app/createproject/page.tsx
import CreateProjectForm from "@/components/CreateProject/CreateProjectForm";

export default function CreateProject() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto w-full max-w-3xl px-6 py-10">
                {/* 스텝 헤더 */}
                <div className="mb-6 flex items-center gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">1</span>
                    <h1 className="text-2xl font-bold tracking-tight">프로젝트 이름</h1>
                    <span className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">Step 1 of 4</span>
                </div>

                {/* 카드 */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <p className="mb-6 text-sm text-gray-600">
                        사용할 프로젝트의 이름을 영어로 입력해주세요. (팀에서 쉽게 식별 가능한 이름을 추천!)
                    </p>
                    <CreateProjectForm />
                </div>

                <p className="mt-4 text-xs text-gray-500">
                    Tip: 공백은 피하고 <code className="rounded bg-gray-100 px-1">kebab-case</code> 또는 <code className="rounded bg-gray-100 px-1">CamelCase</code>를 권장합니다.
                </p>
            </div>
        </div>
    );
}
