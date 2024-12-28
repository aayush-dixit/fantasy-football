'use server';

import { DynamoPlayer } from '../types/types';

export type fetchPlayerResponse =
  | {
      success: true;
      data: DynamoPlayer;
    }
  | {
      success: false;
      errors: any;
    };

export async function fetchPlayerById(
  playerId: string
): Promise<fetchPlayerResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/queryPlayerById?playerId=${playerId}`,
      { cache: 'force-cache' }
    );
    const data = await response.json();
    if (data === null) {
      throw new Error('No player found with that id');
    }
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
