import { create } from 'zustand';
import { persist } from 'zustand/middleware';


type Project = { id: number; name: string; leader:string; description: string };

type ProjectState = {
    projects: Project[];
    currentProjectId: number;
    hasHydrated: boolean;
    setHasHydrated: (v: boolean) => void;
    setCurrentProjectId: (id: number) => void;
    addProject: (p: Project) => void;
    removeProject: (id: number) => void;
};

export const useProjectStore = create<ProjectState>()(
    persist(
        (set) => ({
            projects: [],
            currentProjectId: 0,
            hasHydrated: false,
            setHasHydrated: (v) => set({ hasHydrated: v }),
            setCurrentProjectId: (id) => set({ currentProjectId: id }),
            addProject: (project) =>
                set((state) => ({
                    projects: state.projects.some((p) => p.id === project.id)
                        ? state.projects
                        : [...state.projects, project],
                })),
            removeProject: (id) =>
                set((state) => ({
                    projects: state.projects.filter((p) => p.id !== id),
                })),
        }),
        {
            name: "project-store",
            partialize: (s) => ({ projects: s.projects, currentProjectId: s.currentProjectId }),
            skipHydration: true,
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
