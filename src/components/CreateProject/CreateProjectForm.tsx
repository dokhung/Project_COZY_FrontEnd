'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { checkProjectNameRequest } from "@/api/requests/project";

export default function CreateProjectForm(count: number) {
    const [projectName, setProjectName] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    // Check project name
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
        } catch (error: unknown) {
            setErrorMessage("An error occurred while checking the project name.");
        } finally {
            setIsChecking(false);
        }
    };

    // Move to the next step
    const handleNextStep = (): void => {
        router.push(`/createproject/interest?projectName=${projectName}`);
    };

    //英語だけ入力できるようにする。
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const value = e.target.value;
        const onlyEnglish = value.replace(/[^a-zA-Z]/g, "");
        setProjectName(onlyEnglish);
        setIsAvailable(false);
        setErrorMessage("");
    }

    // Render
    return (
        <div className="flex flex-col items-center">
            <div className="w-full mb-4">
                <label className="block text-gray-700 font-medium mb-2">Project Name</label>
                <Input
                    type="text"
                    value={projectName}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                />
            </div>

            {errorMessage && (
                <p className="text-sm text-red-500 mb-2">{errorMessage}</p>
            )}

            {isAvailable && !errorMessage && (
                <p className="text-sm text-green-600 mb-2">This project name is available.</p>
            )}

            <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                onClick={isAvailable ? handleNextStep : handleCheckName}
                disabled={isChecking}
            >
                {isChecking
                    ? "Checking..."
                    : isAvailable
                        ? "Next"
                        : "Check Availability"}
            </Button>
        </div>
    );
}
