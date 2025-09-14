// app/createproject/interest/page.tsx
'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const interests: string[] = [
    'Back-End', 'Front-End', 'AI', 'Game-Client', 'Full-Stack', 'Native-App'
];

export default function InterestPage() {
    const searchParams = useSearchParams();
    const projectName = searchParams.get('projectName');
    const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const toggleInterest = (interest: string) => {
        setSelectedInterest(prev => (prev === interest ? null : interest));
        setErrorMessage("");
    };

    const handleNext = () => {
        if (!projectName || !selectedInterest) {
            setErrorMessage("Please select an interest before proceeding.");
            return;
        }
        router.push(
            `/createproject/description?projectName=${encodeURIComponent(projectName!)}&devInterest=${encodeURIComponent(selectedInterest)}`
        );
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto w-full max-w-3xl px-6 py-10">
                {/* 스텝 헤더 */}
                <div className="mb-6 flex items-center gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">2</span>
                    <h1 className="text-2xl font-bold tracking-tight">작업 타입 선택</h1>
                    <span className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">Step 2 of 4</span>
                </div>

                {/* 요약 배지 */}
                <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-white px-3 py-1 ring-1 ring-gray-200">
            <span className="text-gray-500">Project:</span>{" "}
              <span className="font-medium text-gray-900">{projectName}</span>
          </span>
                </div>

                {/* 카드 */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <p className="mb-4 text-sm text-gray-600">
                        팀에 맞는 템플릿 추천을 위해 작업 타입을 선택해 주세요.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        {interests.map((interest) => {
                            const active = selectedInterest === interest;
                            return (
                                <button
                                    key={interest}
                                    onClick={() => toggleInterest(interest)}
                                    className={[
                                        "rounded-xl border px-4 py-3 text-left text-sm font-medium transition",
                                        active
                                            ? "border-purple-600 bg-purple-600 text-white shadow-sm"
                                            : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                                    ].join(" ")}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{interest}</span>
                                        {active && <span className="text-xs">✔︎</span>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {selectedInterest && (
                        <div className="mt-5 rounded-xl bg-purple-50 p-3 text-center text-sm text-purple-700 ring-1 ring-purple-200">
                            Selected: <span className="font-semibold">{selectedInterest}</span>
                        </div>
                    )}

                    {errorMessage && (
                        <p className="mt-3 text-center text-sm text-red-600">{errorMessage}</p>
                    )}

                    {/* 푸터 버튼 */}
                    <div className="mt-6 flex items-center justify-between">
                        <button
                            onClick={() => router.push(`/createproject?from=interest`)}
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
                        >
                            이전
                        </button>
                        <button
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 active:scale-[0.99]"
                            onClick={handleNext}
                        >
                            다음
                        </button>
                    </div>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                    필요 시 프로젝트 설정에서 작업 타입을 다시 변경할 수 있습니다.
                </p>
            </div>
        </div>
    );
}
