'use server';

import { DynamoPlayer, Team } from '../types/types';
import { fetchPlayersById } from './fetchMultiplePlayersById';

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
    const playersList = team.players;
    const fetchedPlayersResult = await fetchPlayersById(playersList);

    if (fetchedPlayersResult.success) {
      playersMap[team.owner_id] = fetchedPlayersResult.data.map(
        (player: DynamoPlayer) => ({
          name: player.full_name.S,
          age: player.age.S,
          position: player.position.S,
          id: player.playerId.S,
        })
      );
    }
  }
  return playersMap;
}
