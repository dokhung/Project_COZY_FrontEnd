'use client';

import {useRouter, useSearchParams} from "next/navigation";
import { useState } from "react";
import {createProjectSaveRequest} from "@/api/requests/project";

const interests: string[] = [
    'Web Development',
    'Game Development',
    'Design',
    'Marketing',
];

export default function InterestPage() {
    const searchParams = useSearchParams();
    const projectName = searchParams.get('projectName'); // ✅ URL 파라미터에서 프로젝트 이름 추출
    const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
    const router = useRouter();

    const toggleInterest = (interest: string) => {
        if (selectedInterest === interest) {
            setSelectedInterest(null); // 같은 걸 누르면 해제
        } else {
            setSelectedInterest(interest); // 새로운 관심사 선택
        }
    };

    const handleCreateProject = async () => {
        if (!projectName || !selectedInterest) {
            alert("❌ 프로젝트 이름 또는 관심사를 선택해주세요.");
            return;
        }

        try {
            const response = await createProjectSaveRequest(projectName, selectedInterest);
            console.log("response"+response);
            // TODO: 다음 단계로 이동 (예: 라우팅)
            router.push(`/project/${projectName}`);
        } catch (error) {
            console.error("❌ 프로젝트 생성 실패:", error);
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="text-center mb-3">
                <h2 className="text-xl font-bold text-purple-600">
                    작성중인 프로젝트: {projectName}
                </h2>
            </div>

            <h1 className="text-3xl font-bold text-center mb-2">어떤 작업을 하시나요?</h1>
            <p className="text-center mb-6 text-gray-600">
                팀에 적합한 템플릿을 추천드리기 위해 작업 유형을 알려주세요!
            </p>

            <div className="grid grid-cols-2 gap-4">
                {interests.map((interest) => (
                    <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`border rounded-lg py-3 px-4 text-left font-medium text-sm transition ${
                            selectedInterest === interest
                                ? 'bg-purple-500 text-white border-purple-600'
                                : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'
                        }`}
                    >
                        {interest}
                    </button>
                ))}
            </div>

            {/* 선택한 관심사 출력 */}
            {selectedInterest && (
                <div className="mt-6 text-center">
                    <p className="text-gray-700 text-sm">
                        선택한 관심사 :{" "}
                        <span className="font-medium text-purple-600">{selectedInterest}</span>
                    </p>
                </div>
            )}

            <div className="mt-6 text-center">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
                    onClick={handleCreateProject}
                    disabled={!selectedInterest}
                >
                    프로젝트 생성
                </button>
            </div>
        </div>
    );
}
