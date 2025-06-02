import { filteredPlayer } from '../server-actions/mapLeaguePlayers';
import { FantasyCalcPlayer } from '../types/types';
import { getPlayerStatistics } from '../server-actions/getPlayerStatistics';
import { tradeRecommendationPrompt } from './prompts/tradeRecommendationPrompt';
import { aggregateTradePrompt } from './prompts/aggregateTradePrompt';
import { callOpenAI } from '../server-actions/callOpenAI';

type CombinedPlayer = filteredPlayer & FantasyCalcPlayer;

export async function getAIRecommendation(
  userTeam: Record<string, filteredPlayer[]>,
  otherTeams: Record<string, filteredPlayer[]>
) {
  const TOKEN_LIMIT = 9999999;
  const samplePrompt = tradeRecommendationPrompt({}, {});
  const playerStatistics = await getPlayerStatistics();
  if (!playerStatistics.success) {
    return null;
  }
  let combinedUserTeam: Record<string, CombinedPlayer[]> = {};
  let combinedOtherTeams: Record<string, CombinedPlayer[]> = {};
  const playerStatsMap = new Map(
    Object.values(playerStatistics.data).map((fcPlayer) => [
      fcPlayer.player.sleeperId,
      fcPlayer,
    ])
  );
  for (const key in userTeam) {
    combinedUserTeam[key] = userTeam[key]
      .map((player) => {
        const matchingFantasyPlayer = playerStatsMap.get(player.id);
        if (matchingFantasyPlayer) {
          return { ...player, ...matchingFantasyPlayer };
        }
        return null;
      })
      .filter(
        (combinedPlayer): combinedPlayer is CombinedPlayer =>
          combinedPlayer !== null
      );
  }

  for (const key in otherTeams) {
    combinedOtherTeams[key] = otherTeams[key]
      .map((player) => {
        const matchingFantasyPlayer = Object.values(playerStatistics.data).find(
          (fcPlayer) => fcPlayer.player.sleeperId === player.id
        );

        if (matchingFantasyPlayer) {
          return { ...player, ...matchingFantasyPlayer };
        }
        return null;
      })
      .filter(
        (combinedPlayer): combinedPlayer is CombinedPlayer =>
          combinedPlayer !== null
      );
  }

  const chunks = splitObjectIntoChunksByTokenLimit(
    combinedOtherTeams,
    TOKEN_LIMIT - JSON.stringify(combinedUserTeam).length - samplePrompt.length
  );

  const allRecs: string[] = [];
  await Promise.all(
    chunks.map(async (chunk) => {
      const res = await fetch('http://localhost:3000/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: tradeRecommendationPrompt(combinedUserTeam, chunk),
        }),
      });
      const rec = await res.json();
      allRecs.push(rec.result);
    })
  );

  //TODO probably can get rid of this call
  // const finalRec = await callOpenAI(aggregateTradePrompt(allRecs));
  return allRecs[0];
}

function splitObjectIntoChunksByTokenLimit<T>(
  obj: Record<string, T>,
  tokenLimit: number
): Record<string, T>[] {
  const entries = Object.entries(obj);
  const chunks: Record<string, T>[] = [];

  let currentChunk: [string, T][] = [];
  let currentSize = 0;

  for (const entry of entries) {
    const entrySize = JSON.stringify({ entry }).length;
    if (currentSize + entrySize > tokenLimit) {
      chunks.push(Object.fromEntries(currentChunk));
      currentChunk = [];
      currentSize = 0;
    }

    currentChunk.push(entry);
    currentSize += entrySize;
  }

  if (currentChunk.length > 0) {
    chunks.push(Object.fromEntries(currentChunk));
  }

  return chunks;
}
