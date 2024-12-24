'use server';

import { Team } from "../types/types";
import { fetchPlayerById } from "./fetchPlayerById";

export type filteredPlayer = {
    name: string;
    age: string;
    position: string;
}
export async function mapLeaguePlayers(leagueRosters: Team[]): Promise<Record<string,filteredPlayer[]>> {
    const playersMap: Record<string, filteredPlayer[]> = {};
    for (const team of leagueRosters) {
        const players: {
            name: string;
            age: string;
            position: string;
        }[] = [];
        const playersList = team.players;
        for (const player of playersList) {
            const fetchedPlayer = await fetchPlayerById(player);
            if (fetchedPlayer.success && Array.isArray(fetchedPlayer.data)) {
                players.push({
                    name: fetchedPlayer.data[0].full_name.S,
                    age: fetchedPlayer.data[0].age.S,
                    position: fetchedPlayer.data[0].position.S
                });
            }
        }
    
        playersMap[team.owner_id] = players;
    
    }
    return playersMap;
}