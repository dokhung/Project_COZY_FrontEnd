'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkProjectNameRequest } from "@/api/auth";
import { useRouter } from "next/navigation";

export default function CreateProjectForm() {
    const [projectName, setProjectName] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleNextStep = async () => {
        if (!projectName.trim()) {
            setErrorMessage("프로젝트 이름을 입력하세요.");
            return;
        }

        setIsChecking(true);
        setErrorMessage("");

        try {
            const isDuplicate = await checkProjectNameRequest(projectName);

            if (isDuplicate) {
                setErrorMessage("❌ 이미 사용 중인 프로젝트 이름입니다.");
            } else {
                // 👉 중복이 아니면 다음 단계 진행
                alert("✅ 사용 가능한 프로젝트 이름입니다. 다음 단계로 이동합니다.");
                router.push(`/createproject/interest?projectName=${projectName}`);
            }
        } catch (error) {
            setErrorMessage("중복 확인 중 오류가 발생했습니다.");
            console.error("중복 확인 실패:", error);
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="w-full mb-4">
                <label className="block text-gray-700 font-medium mb-2">프로젝트 이름</label>
                <Input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="사용할 프로젝트 이름을 입력하세요"
                />
            </div>

            {/* 에러 메시지 */}
            {errorMessage && (
                <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
            )}

            {/* 단일 버튼으로 처리 */}
            <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                onClick={handleNextStep}
                disabled={isChecking}
            >
                {/*TODO:확인후에 다음으로 간다.*/}
                {isChecking ? "확인 중..." : "다음으로"}
            </Button>
        </div>
    );
}
