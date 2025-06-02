'use server';

import { Team } from '../types/types';

export type fetchLeagueRostersResponse =
  | {
      success: true;
      data: Team[];
    }
  | {
      success: false;
      errors: any;
    };

export async function fetchLeagueRosters(
  leagueId: string
): Promise<fetchLeagueRostersResponse> {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}/rosters`,
      { cache: 'force-cache' }
    );
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      errors: err,
    };
  }
}
