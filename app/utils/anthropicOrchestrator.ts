import { filteredPlayer } from '../server-actions/mapLeaguePlayers';
import { callAnthropic } from '../server-actions/callAnthropic';
import { FantasyCalcPlayer } from '../types/types';
import { getPlayerStatistics } from '../server-actions/getPlayerStatistics';
type CombinedPlayer = filteredPlayer & FantasyCalcPlayer;

function generateRecPrompt<T>(
  userTeam: Record<string, filteredPlayer[]>,
  chunk: Record<string, T>
) {
  return `For each team here, please recommend a trade with up to 3 players on each side that would make sense for this user's team. Only return trades if a trade can be made where the difference between the value on the user sides and the other team of the trade is less than 500: ${JSON.stringify(userTeam)}. Other teams: ${JSON.stringify(chunk)}. In the response only return the following JSON object:
  {
    "userTeam": {
      "sends": [
        {
        "playerName": [playerName],
        "position": [position],
        "value": [value],
      }, ...
      ]
    },
    "otherTeam": {
      "teamId": [id],
      "sends": [
        {
        "playerName": [playerName],
        "position": [position],
        "value": [value],
      }, ...
      ]
    },
  }  
  `;
}

function generateFinalRecPrompt(allRecs: string[]) {
  return `Out of all these trade recommendations: ${JSON.stringify(allRecs)}, pick the 3 with the lowest value differences between the user and other team. Return the response in the following JSON format: 
  {"suggestions":
    [
      {
        "userTeam": {
          "sends": [
            {
            "playerName": [playerName],
            "position": [position],
            "value": [value],
          }, ...
          ],
          "rationale": [rationale]
        },
        "otherTeam": {
          "teamId": [id],
          "sends": [
            {
            "playerName": [playerName],
            "position": [position],
            "value": [value],
          }, ...
          ],
          "rationale": [rationale]
      },...
    ]
  }
}   `;
}

export async function anthropicOrchestrator(
  userTeam: Record<string, filteredPlayer[]>,
  otherTeams: Record<string, filteredPlayer[]>
) {
  const samplePrompt = generateRecPrompt({}, {});
  const playerStatistics = await getPlayerStatistics();
  if (!playerStatistics.success) {
    return null;
  }
  let combinedUserTeam: Record<string, CombinedPlayer[]> = {};
  let combinedOtherTeams: Record<string, CombinedPlayer[]> = {};
  for (const key in userTeam) {
    combinedUserTeam[key] = userTeam[key]
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
    4096 - JSON.stringify(combinedUserTeam).length - samplePrompt.length
  );
  const allRecs: string[] = [];
  for (const chunk of chunks) {
    const rec = await callAnthropic(generateRecPrompt(combinedUserTeam, chunk));
    console.log(rec);
    allRecs.push(rec);
  }

  const finalRec = await callAnthropic(generateFinalRecPrompt(allRecs));
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
