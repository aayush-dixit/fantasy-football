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
      `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/fetchLeagueRosters?leagueIdInput=${leagueId}`,
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
