import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, Team, LeagueSettings } from '../types/types';
interface AppState {
  data: string | null;
  setData: (data: string) => void;
  resetData: () => void;
  leagueData: LeagueSettings | null;
  setLeagueData: (data: LeagueSettings) => void;
  resetLeagueData: () => void;
  leagueRosters: Team[] | null;
  setLeagueRosters: (data: Team[]) => void;
  resetLeagueRosters: () => void;
  leagueUsers: User[] | null;
  setLeagueUsers: (data: User[]) => void;
  resetLeagueUsers: () => void;
}

export const useStore = create<AppState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
  resetData: () => set({ data: null }),
  leagueData: null,
  setLeagueData: (leagueData) => set({ leagueData }),
  resetLeagueData: () => set({ leagueData: null }),
  leagueRosters: null,
  setLeagueRosters: (leagueRosters) => set({ leagueRosters }),
  resetLeagueRosters: () => set({ leagueRosters: null }),
  leagueUsers: null,
  setLeagueUsers: (leagueUsers) => set({ leagueUsers }),
  resetLeagueUsers: () => set({ leagueUsers: null }),
}));