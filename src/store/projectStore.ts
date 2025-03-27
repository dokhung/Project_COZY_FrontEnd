import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Project = {
    id: number;
    name: string;
    description: string;
};

type ProjectState = {
    projects: Project[];
    addProject: (project: Project) => void;
    removeProject: (id: number) => void;
};

export const useProjectStore = create<ProjectState>()(
    persist(
        (set) => ({
            projects: [],
            addProject: (project) =>
                set((state) => {
                    const exists = state.projects.some((p) => p.id === project.id);
                    if (exists) return state; // ✅ 중복 방지
                    return { projects: [...state.projects, project] };
                }),
            removeProject: (id) =>
                set((state) => ({
                    projects: state.projects.filter((project) => project.id !== id),
                })),
        }),
        {
            name: 'project-store',
            partialize: (state) => ({ projects: state.projects }),
            skipHydration: true // ✅ 클라이언트 마운트 후만 동작
        }
    )
);
