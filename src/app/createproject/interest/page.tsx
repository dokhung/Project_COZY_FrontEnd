'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createProjectSaveRequest } from "@/api/requests/project";

//選択項目
const interests: string[] = [
    'Back-End',
    'Front-End',
    'AI',
    'Game-Client',
    'Full-Stack',
    'Native-App'
];

export default function InterestPage() {
    const searchParams = useSearchParams();
    const projectName = searchParams.get('projectName'); // get parameter from URL
    const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');

    // Select button
    const toggleInterest = (interest: string) => {
        if (selectedInterest === interest) {
            setSelectedInterest(null);
        } else {
            setSelectedInterest(interest);
        }
        setErrorMessage("");
    };

    const handleNext = () => {
        if (!projectName || !selectedInterest) {
            setErrorMessage("Please select an interest before proceeding.");
            return;
        }
        router.push(
            `/createproject/description?projectName=${encodeURIComponent(projectName!)}&interest=${encodeURIComponent(selectedInterest)}`
        );
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="text-center mb-3">
                <h2 className="text-xl font-bold text-purple-600">
                    Current Project: {projectName}
                </h2>
            </div>

            <h1 className="text-3xl font-bold text-center mb-2">What type of work are you doing?</h1>
            <p className="text-center mb-6 text-gray-600">
                Tell us your work type so we can recommend the best template for your team!
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

            {/*選択したところ*/}
            {selectedInterest && (
                <div className="mt-6 text-center">
                    <p className="text-gray-700 text-sm">
                        Selected interest:{" "}
                        <span className="font-medium text-purple-600">{selectedInterest}</span>
                    </p>
                </div>
            )}

            {errorMessage && (
                <p className={"text-sm text-red-500 my-4 text-center"}>{errorMessage}</p>
            )}

            <div className="mt-6 text-center">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
                    onClick={handleNext}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
