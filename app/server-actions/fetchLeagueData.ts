'use server';

import { LeagueSettings } from "../types/types";

export type fetchLeagueDataSuccessResponse = {
    success: true,
    data: LeagueSettings
} | {
    success: false,
    errors: any
}

export async function fetchLeagueData (leagueId: string): Promise<fetchLeagueDataSuccessResponse> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/fetchLeagueData?leagueIdInput=${leagueId}`, {cache: "force-cache"});
        if (response.status != 200) {
            throw new Error('Failed to fetch league data');
        }
        const data = await response.json()
        return {
            success: true,
            data
        }
    } catch (err) {
        console.error(err);
        return {
            success: false,
            errors: err
        }
    }
}
