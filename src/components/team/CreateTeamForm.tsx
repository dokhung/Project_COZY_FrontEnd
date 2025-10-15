'use client';

import {useState} from "react";
import {useRouter} from "next/navigation";
import {checkTeamNameRequest, CreateTeamDTO, createTeamRequest} from "@/api/requests/team";

export const CreateTeamForm = () => {

    // State
    const [teamName, setTeamName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isAvailable, setIsAvailable] = useState<boolean>(false);
    const [isChecking, setIsChecking] = useState<boolean>(false);
    const [isSave, setIsSave] = useState<boolean>(false);
    // val
    const router = useRouter();

    // fun
    const handleCheckName = async () => {
        if (!teamName) {
            setErrorMessage("Please enter a team name");
            setIsAvailable(false);
            return;
        }
        setIsChecking(true);
        setIsAvailable(false);
        // setErrorMessage("");
        // try {
        //     const isDuplicate = await checkTeamNameRequest(teamName);
        //     if (!isDuplicate) {
        //         setErrorMessage("This team name is already in use.");
        //     }else {
        //         setIsAvailable(true);
        //     }
        // }catch {
        //     setErrorMessage("Error while creating team");
        // }finally {
        //     setIsChecking(false);
        // }
    }

    const handleTeamNameSave = async () => {
       // if (!isAvailable) return;
       setIsSave(true);
       try {
           const dto = {
               teamName:teamName?.trim(),
               description:description?.trim() || "",
           };
           await createTeamRequest(dto);
       }catch (error) {
           setErrorMessage("error");
           setIsAvailable(false);
       }finally {
           setIsSave(false);
       }

    }


    return (
        <>
            <div className={"flex justify-center"}>
                <div>
                <input
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder={"Please input teamName"}
                    className={"w-72 sm:w-96 bg-transparent text-center text-lg border-0 border-b-2 border-gray-400 focus:border-gray-700 focus:outline-none py-2"}
                />
                </div>


                {errorMessage && (
                    <p
                        className={`mt-4 text-sm font-semibold ${
                            isAvailable
                                ? "text-blue-600"
                                : errorMessage.includes("exists")
                                    ? "text-red-600"
                                    : "text-gray-600"
                        }`}
                    >
                        {errorMessage}
                    </p>
                )}
            </div>

            <div className={"mt-8 flex justify-center"}>
                {/*<button*/}
                {/*    onClick={handleCheckName}*/}
                {/*    className={"px-6 sm:px-8 py-3 rounded-full bg-red-500 text-white font-semibold shadow hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"}>*/}
                {/*    {isChecking ?*/}
                {/*        "Checking..." : "Check for duplicates"}*/}
                {/*</button>*/}

                {!isAvailable && (
                    <button
                        onClick={handleTeamNameSave}
                        disabled={isSave}
                        className={"px-6 sm:px-8 py-3 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"}>
                        Save
                    </button>
                )}
            </div>
        </>
    )
}