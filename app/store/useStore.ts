import { create } from 'zustand';
import { User, Team, LeagueSettings, Player } from '../types/types';
import { devtools, persist } from 'zustand/middleware';
interface AppState {
  leagueData: LeagueSettings | null;
  setLeagueData: (data: LeagueSettings) => void;
  resetLeagueData: () => void;
  leagueRosters: Team[] | null;
  setLeagueRosters: (data: Team[]) => void;
  resetLeagueRosters: () => void;
  leagueUsers: User[] | null;
  setLeagueUsers: (data: User[]) => void;
  resetLeagueUsers: () => void;
  userTeam: Player[] | null;
  setUserTeam: (data: Player[]) => void;
  resetStore: () => void;
}

const initialState = {
  leagueData: null,
  leagueRosters: null,
  leagueUsers: null,
  userTeam: null,
};

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setLeagueData: (leagueData) => set({ leagueData }),
        resetLeagueData: () => set({ leagueData: null }),
        setLeagueRosters: (leagueRosters) => set({ leagueRosters }),
        resetLeagueRosters: () => set({ leagueRosters: null }),
        setLeagueUsers: (leagueUsers) => set({ leagueUsers }),
        resetLeagueUsers: () => set({ leagueUsers: null }),
        resetStore: () => set(initialState),
        setUserTeam: (userTeam) => set({ userTeam }),
      }),
      { name: 'rosterStore' }
    )
  )
);
