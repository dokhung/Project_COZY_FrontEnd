// components/CreateProject/CreateProjectForm.tsx
'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { checkProjectNameRequest } from "@/api/requests/project";

export default function CreateProjectForm() {
    const [projectName, setProjectName] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleCheckName = async () => {
        if (!projectName) {
            setErrorMessage("Please enter a project name.");
            setIsAvailable(false);
            return;
        }
        setIsChecking(true);
        setErrorMessage("");
        setIsAvailable(false);
        try {
            const isDuplicate = await checkProjectNameRequest(projectName);
            if (!isDuplicate) {
                setErrorMessage("This project name is already in use.");
            } else {
                setIsAvailable(true);
            }
        } catch {
            setErrorMessage("An error occurred while checking the project name.");
        } finally {
            setIsChecking(false);
        }
    };

    const handleNextStep = () => {
        router.push(`/createproject/interest?projectName=${encodeURIComponent(projectName)}`);
    };

    // 영어만
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const onlyEnglish = value.replace(/[^a-zA-Z]/g, "");
        setProjectName(onlyEnglish);
        setIsAvailable(false);
        setErrorMessage("");
    };

    const borderState = errorMessage
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : isAvailable
            ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-100";

    return (
        <div className="space-y-4">
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Project Name</label>
                <Input
                    type="text"
                    value={projectName}
                    onChange={handleInputChange}
                    placeholder="Enter project name (English only)"
                    className={`w-full rounded-xl bg-white p-3 text-sm outline-none ring-2 ring-transparent transition focus:ring-2 ${borderState}`}
                />
                <div className="mt-2 flex items-center justify-between text-xs">
                    <p className="text-gray-500">영문 알파벳만 입력됩니다.</p>
                    {isAvailable && !errorMessage && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 ring-1 ring-emerald-200">
              Available
            </span>
                    )}
                </div>
                {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
            </div>

            <div className="flex gap-2">
                <Button
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 active:scale-[0.99]"
                    onClick={isAvailable ? handleNextStep : handleCheckName}
                    disabled={isChecking}
                >
                    {isChecking ? "Checking..." : isAvailable ? "Next" : "Check Availability"}
                </Button>
            </div>
        </div>
    );
}
