import { filteredPlayer } from '../server-actions/mapLeaguePlayers';
import { callAnthropic } from '../server-actions/callAnthropic';
import { FantasyCalcPlayer } from '../types/types';
import { getPlayerStatistics } from '../server-actions/getPlayerStatistics';
import { tradeRecommendationPrompt } from './prompts/tradeRecommendationPrompt';
import { aggregateTradePrompt } from './prompts/aggregateTradePrompt';

type CombinedPlayer = filteredPlayer & FantasyCalcPlayer;

export async function getAIRecommendation(
  userTeam: Record<string, filteredPlayer[]>,
  otherTeams: Record<string, filteredPlayer[]>
) {
  const TOKEN_LIMIT = 4000;
  const samplePrompt = tradeRecommendationPrompt({}, {});
  const playerStatistics = await getPlayerStatistics();
  if (!playerStatistics.success) {
    return null;
  }
  let combinedUserTeam: Record<string, CombinedPlayer[]> = {};
  let combinedOtherTeams: Record<string, CombinedPlayer[]> = {};
  const playerStatsMap = new Map(
    Object.values(playerStatistics.data).map(fcPlayer => [fcPlayer.player.sleeperId, fcPlayer])
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
  for (const chunk of chunks) {
    const rec = await callAnthropic(
      tradeRecommendationPrompt(combinedUserTeam, chunk)
    );
    allRecs.push(rec);
  }
  const finalRec = await callAnthropic(aggregateTradePrompt(allRecs));
  return finalRec;
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
