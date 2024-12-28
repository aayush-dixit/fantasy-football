'use server';

import { Team } from '../types/types';
import { fetchPlayerById } from './fetchPlayerById';

export type filteredPlayer = {
  name: string;
  age: string;
  position: string;
  id: string;
};
export async function mapLeaguePlayers(
  leagueRosters: Team[]
): Promise<Record<string, filteredPlayer[]>> {
  const playersMap: Record<string, filteredPlayer[]> = {};
  for (const team of leagueRosters) {
    const players: {
      name: string;
      age: string;
      position: string;
      id: string;
    }[] = [];
    const playersList = team.players;
    const playerPromises = playersList.map(
      async (player) => await fetchPlayerById(player)
    );
    const fetchedPlayers = await Promise.all(playerPromises);

    for (const fetchedPlayer of fetchedPlayers) {
      if (
        fetchedPlayer.success &&
        Array.isArray(fetchedPlayer.data) &&
        fetchedPlayer.data.length
      ) {
        players.push({
          name: fetchedPlayer.data[0].full_name.S,
          age: fetchedPlayer.data[0].age.S,
          position: fetchedPlayer.data[0].position.S,
          id: fetchedPlayer.data[0].playerId.S,
        });
      }
    }

    playersMap[team.owner_id] = players;
  }
  return playersMap;
}
