'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    getProjectDetailRequest,
    updateProjectRequest,
    deleteProjectRequest,
    type ProjectDetail,
    type UpdateProjectDTO,
} from "@/api/requests/project";
import EditMode from "@/components/setting/EditMode";
import ViewMode from "@/components/setting/ViewMode";

export default function ProjectSettings() {
    const router = useRouter();
    const params = useParams();
    const projectNameParam = params?.projectName as string;

    const [detail, setDetail] = useState<ProjectDetail | null>(null);
    const [mode, setMode] = useState<"view" | "edit">("view");
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getProjectDetailRequest(projectNameParam);
            console.log("Setting data :: "+JSON.stringify(data));
            setDetail(data);
        } catch (e) {
            alert("프로젝트 정보를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectNameParam) load();
    }, [projectNameParam]);

    const handleEdit = () => setMode("edit");

    const handleDelete = async () => {
        if (!detail) return;
        const ok = confirm(`프로젝트를 삭제할까요? (${detail.projectName})`);
        if (!ok) return;

        try {
            await deleteProjectRequest(detail.projectId);
            alert("삭제되었습니다.");
            router.push("/");
        } catch (e) {
            alert("삭제에 실패했습니다.");
        }
    };

    const handleSave = async (dto: UpdateProjectDTO) => {
        if (!detail) return;
        try {
            await updateProjectRequest(detail.projectId, dto);
            alert("저장되었습니다.");
            await load();
            setMode("view");
        } catch (e) {
            alert("업데이트에 실패했습니다.");
        }
    };

    if (loading) return <div className="p-6">로딩 중...</div>;
    if (!detail) return <div className="p-6">프로젝트가 없습니다.</div>;

    return mode === "view" ? (
        <ViewMode
            data={{
                projectId: detail.projectId,
                projectName: detail.projectName,
                description: detail.description,
                ownerName: detail.ownerName,
                devInterest: detail.devInterest,
                gitHubUrl: detail.gitHubUrl,
                createdAt: detail.createdAt,
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    ) : (
        <EditMode
            key={detail.projectId + "-" + mode}
            initial={{
                projectId: detail.projectId,
                projectName: detail.projectName,
                description: detail.description,
                devInterest: detail.devInterest,
                gitHubUrl: detail.gitHubUrl,
                leaderName: detail.ownerName,
            }}
            onCancel={() => setMode("view")}
            onSave={handleSave}
        />


    );
}
