import {create} from "zustand";
import {persist} from "zustand/middleware";

type Team = {
    id: number;
    teamName: string;
    description: string;
}

type TeamState = {
    teams: Team[];
    hasHydrated: boolean;
    setHasHydrated: (v: boolean) => void;
    currentTeamId: number;
    setCurrentTeamId: (id: number) => void;
    addTeam:(team: Team) => void;
    removeTeam: (id: number) => void;
}

export const useTeamStore = create<TeamState>()(
    persist(
        (set) => ({
            teams:[],
            currentTeamId: 0,
            hasHydrated: false,
            setHasHydrated: (v: boolean) => set({ hasHydrated : v}),
            setCurrentTeamId:(id) => set({currentTeamId: id}),
            addTeam:(team: Team) =>
                set((state) => ({
                    teams: state.teams.some((t) => t.id === t.id)
                    ? state.teams
                        : [...state.teams, team],
                })),
            removeTeam:(id:number) =>
                set((state) => ({
                    teams: state.teams.filter((team) => team.id === id),
                })),
        }),
        {
            name:"teams-store",
            partialize:(t)=>({
                teams:t.teams,
                currentTeamId:t.currentTeamId
            }),
            skipHydration:true,
            onRehydrateStorage:()=>(state)=>{
                state?.setHasHydrated(true);
            }
        }
    )
)