import React, { useState } from "react";
import type { UpdateProjectDTO } from "@/api/requests/project";

type EditProps = {
    initial: {
        projectId: number;
        projectName: string;
        description: string;
        devInterest: string;
        gitHubUrl: string | null;
        leaderName: string; // ← UUID 대신 이름
    };
    onCancel: () => void;
    onSave: (dto: UpdateProjectDTO) => Promise<void>;
};

const INTEREST_OPTIONS = [
    "Back-End","Front-End","AI","Game-Client","Full-Stack","Native-App",
];

export default function EditMode({ initial, onCancel, onSave }: EditProps) {
    const [projectName, setProjectName]   = useState(initial.projectName);
    const [description, setDescription]   = useState(initial.description || "");
    const [devInterest, setDevInterest]   = useState(
        INTEREST_OPTIONS.includes(initial.devInterest) ? initial.devInterest : ""
    );
    const [gitHubUrl, setGitHubUrl]             = useState(initial.gitHubUrl || "");
    const [leaderName, setLeaderName]     = useState(initial.leaderName || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectName.trim()) return alert("프로젝트 이름을 입력하세요.");
        if (!devInterest)        return alert("DevInterest를 선택하세요.");
        await onSave({
            projectName,
            devInterest,
            description,
            gitHubUrl,
            leaderName,
        });
    };

    return (
        <section className="mt-6 rounded-xl bg-white/70 ring-1 ring-stone-300/60 shadow">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between border-b p-5">
                    <h2 className="text-lg font-semibold text-stone-900">Edit Project</h2>
                    <div className="flex gap-2">
                        <button type="button" onClick={onCancel}
                                className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50">
                            Cancel
                        </button>
                        <button type="submit"
                                className="rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-900">
                            Save
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                    <div className="rounded-xl border border-stone-200 bg-white/70 p-5">
                        <h3 className="mb-3 text-sm font-semibold text-stone-700">Basic</h3>
                        <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3 text-sm">
                            <label className="self-center text-stone-500">Name</label>
                            <input value={projectName} onChange={e=>setProjectName(e.target.value)}
                                   className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-300"/>

                            <label className="self-center text-stone-500">DevInterest</label>
                            <select value={devInterest} onChange={e=>setDevInterest(e.target.value)}
                                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-300">
                                <option value="" disabled>선택하세요</option>
                                {INTEREST_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>

                            <label className="self-center text-stone-500">Git URL</label>
                            <input value={gitHubUrl} onChange={e=>setGitHubUrl(e.target.value)}
                                   placeholder="https://github.com/..."
                                   className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-300"/>

                            <label className="self-center text-stone-500">Leader Name</label>
                            <input value={leaderName} onChange={e=>setLeaderName(e.target.value)}
                                   placeholder="이름"
                                   className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-300"/>
                        </div>
                    </div>

                    <div className="rounded-xl border border-stone-200 bg-white/70 p-5">
                        <h3 className="mb-3 text-sm font-semibold text-stone-700">Description</h3>
                        <textarea rows={8} value={description} onChange={e=>setDescription(e.target.value)}
                                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-300"/>
                    </div>
                </div>
            </form>
        </section>
    );
}
