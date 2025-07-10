'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {checkProjectNameRequest} from "@/api/requests/project";

export default function CreateProjectForm() {
    const [projectName, setProjectName] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    // TODO: 이름을 제크한다.
    const handleCheckName = async () => {
        if (!projectName) {
            setErrorMessage("프로젝트 이름을 입력하세요.");
            setIsAvailable(false);
            return;
        }

        setIsChecking(true);
        setErrorMessage("");
        setIsAvailable(false);

        try {
            const isDuplicagte = await checkProjectNameRequest(projectName);
            if (!isDuplicagte) {
                setErrorMessage("이미 사용 중인 프로젝트 이름 입니다.");
            } else {
                setIsAvailable(true);
            }
        }catch (error : unknown) {
            setErrorMessage("중복 확인 중 오류가 발생 했습니다.");
        }finally {
            setIsChecking(false);
        }
    }

    // TODO : 다음스탭으로 이동한다.
    const handleNextStep = () : void => {
        router.push(`/createproject/interest?projectName=${projectName}`);
    };

    //TODO : HTML
    return (
        <div className="flex flex-col items-center">
            <div className="w-full mb-4">
                <label className="block text-gray-700 font-medium mb-2">프로젝트 이름</label>
                <Input
                    type="text"
                    value={projectName}
                    onChange={(e) => {
                        setProjectName(e.target.value);
                        setIsAvailable(false);
                        setErrorMessage("");
                    }}
                    placeholder="사용할 프로젝트 이름을 입력하세요"
                />
            </div>

            {errorMessage && (
                <p className="text-sm text-red-500 mb-2">{errorMessage}</p>
            )}

            {isAvailable && !errorMessage && (
                <p className="text-sm text-green-600 mb-2">등록 가능한 프로젝트 이름입니다.</p>
            )}

            <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                onClick={isAvailable ? handleNextStep : handleCheckName}
                disabled={isChecking}
            >
                {isChecking
                    ? "확인 중..."
                    : isAvailable
                        ? "다음으로"
                        : "중복 확인"}
            </Button>
        </div>
    );
}
