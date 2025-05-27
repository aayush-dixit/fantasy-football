'use server';

import { DynamoPlayer } from '../types/types';

export type fetchMultiplePlayersResponse =
    | {
        success: true;
        data: DynamoPlayer[];
    }
    | {
        success: false;
        errors: any;
    };

export async function fetchPlayersById(
    playerIds: string[]
): Promise<fetchMultiplePlayersResponse> {
    const body = JSON.stringify(playerIds);
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/queryPlayersById`,
            { method: 'POST', body: body }
        );
        const data = await response.json();
        if (data === null) {
            throw new Error('Error fetching multiple players');
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
