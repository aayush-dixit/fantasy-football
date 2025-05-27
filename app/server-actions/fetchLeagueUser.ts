'use server';

import { User } from '../types/types';

export type fetchLeagueUserResponse =
  | {
    success: true;
    data: User;
  }
  | {
    success: false;
    errors: any;
  };

export async function fetchLeagueUser(
  userId: string
): Promise<fetchLeagueUserResponse> {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/user/${userId}`,
      { cache: 'force-cache' }
    );
    if (response.status != 200) {
      throw new Error('Failed to fetch league data');
    }
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
