import { create } from 'zustand';
import { persist } from 'zustand/middleware';


type ProjectState = {
    projects: { id: number; name: string; description: string }[];
    addProject: (project: { id: number; name: string; description: string }) => void;
    removeProject: (id: number) => void;
};

export const useProjectStore = create<ProjectState>()(
    persist(
        (set) => ({
            projects: [], // 기본값: 참여 중인 프로젝트 없음
            addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
            removeProject: (id) =>
                set((state) => ({
                    projects: state.projects.filter((project) => project.id !== id),
                })),
        }),
        {
            name: 'project-store',
            partialize: (state) => ({
                projects: state.projects,
            }),
        }
    )
);
