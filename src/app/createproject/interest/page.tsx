'use client'

import {useSearchParams} from "next/navigation";
import {useState} from "react";

const interests:string[] = [
    'Web Development',
    'Game Development',
    'Design',
    'Marketing',
]

export default function InterestPage() {
    const searchParams = useSearchParams();
    const projectName = searchParams.get('projectName'); // ✅ URL에서 받아옴
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest]
        );
    };

    const handleNext = () => {
        alert('📌 프로젝트 이름:' + projectName);
        alert('✅ 선택된 관심사:'+selectedInterests);
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="text-center mb-3">
                <h2 className="text-xl font-bold text-purple-600">작성중인 프로젝트: {projectName}</h2>
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
                            selectedInterests.includes(interest)
                                ? 'bg-purple-500 text-white border-purple-600'
                                : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'
                        }`}
                    >
                        {interest}
                    </button>
                ))}
            </div>

            {/*TODO:사이영역*/}
            {selectedInterests.length > 0 && (
                <div className={"mt-6 text-center"}>
                    <p className={"text-gray-700 text-sm"}>
                        선택한 관심사 : <span className={"font-medium text-purple-600"}>
                        {selectedInterests.join(', ')}
                    </span>
                    </p>
                </div>
            )}

            <div className="mt-6 text-center">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
                    onClick={handleNext}
                    disabled={selectedInterests.length === 0}
                >
                    다음으로
                </button>
            </div>
        </div>
    );
}