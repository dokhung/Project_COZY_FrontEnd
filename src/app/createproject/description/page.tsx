"use client";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {createProjectSaveRequest} from "@/api/requests/project";
import {useUserStore} from "@/store/userStore";
import ConfirmProjectDialog from "@/components/CreateProject/ConfirmProjectDialog";

export default function DescriptionPage(){
    const searchParams = useSearchParams();
    const router = useRouter();

    const projectName = searchParams.get("projectName");
    const interest = searchParams.get("interest");
    const { user } = useUserStore();

    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [openConfirm, setOpenConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // 필수 파라미터 없으면 이전 단계로
    useEffect((): void => {
        if (!projectName || !interest) {
            router.replace("/createproject");
        }
    }, [projectName, interest, router]);

    // “Create Project” 클릭 → 다이얼로그 오픈
    const handleOpenConfirm = () => {
        if (!description.trim()) {
            setError("Please enter a description");
            return;
        }
        if (!user?.nickname) {
            setError("로그인이 필요합니다.");
            return;
        }
        setOpenConfirm(true);
    };

    // 다이얼로그에서 최종 전송
    const handleConfirmCreate = async () => {
        try {
            setSubmitting(true);
            await createProjectSaveRequest({
                projectName: projectName!,
                interest: interest!,
                description,
                leaderName: user!.nickname,
            });
            setOpenConfirm(false);
            router.push(`/project/${projectName}`);
        } catch (e) {
            console.error(e);
            setError("CreateProjectSaveRequest Error");
            alert("CreateProjectSaveRequest Error");
        } finally {
            setSubmitting(false);
        }
    };

    return(
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
            <div className="w-full max-w-2xl">
                <h1 className="mb-2 text-3xl font-bold">Please write down the description of the project.</h1>
                <p className="mx-auto mb-6 max-w-xl text-center text-sm text-gray-600">
                    Introduce your service briefly.
                </p>

                {/* text input */}
                <textarea
                    className="h-80 w-full rounded-xl border-2 p-4 outline-none focus:border-blue-600"
                    placeholder="Describe your project..."
                    value={description}
                    onChange={(e)=> {setDescription(e.target.value); setError("");}}
                />
                {error && <p className="mt-3 text-center text-red-500">{error}</p>}

                <div className="mt-3 flex justify-end">
                    <button
                        className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow hover:bg-blue-700"
                        onClick={handleOpenConfirm}
                    >
                        Create Project
                    </button>
                </div>
            </div>

            {/* 확인 다이얼로그 */}
            <ConfirmProjectDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirmCreate}
                loading={submitting}
                data={{
                    projectName: projectName || "",
                    interest: interest || "",
                    description,
                    leaderName: user?.nickname || "",
                }}
            />
        </div>
    );
}
