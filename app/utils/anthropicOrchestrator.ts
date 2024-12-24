import { filteredPlayer } from "../server-actions/mapLeaguePlayers";
import { getAIRecommendation } from "../server-actions/getAIRecommendation";

function generateRecPrompt<T>(userTeam: Record<string, filteredPlayer[]>, chunk: Record<string, T>) {
    return `For each team here, please recommend a trade that would make sense for this user's team: ${JSON.stringify(userTeam)}. Other teams: ${JSON.stringify(chunk)}. Please only return a response in the following format:
    User sends: [user team players]
    [UserId] sends: [other team players]
    Rationale: [rationale]`;
}

function generateFinalRecPrompt<T>(allRecs: string[]) {
  return `Out of all these trade recommendations: ${JSON.stringify(allRecs)}, pick the best 3 and return them in the following format: 
    User sends: [user team players]
    [UserId] sends: [other team players]
    Rationale: [rationale] `
}

export async function anthropicOrchestrator(
  userTeam: Record<string, filteredPlayer[]>,
  otherTeams: Record<string, filteredPlayer[]>
) {
  const samplePrompt = generateRecPrompt({}, {});
  const chunks = splitObjectIntoChunksByTokenLimit(otherTeams, 4096 - JSON.stringify(userTeam).length - samplePrompt.length);
  const allRecs: string[] = [];
  for (const chunk of chunks) {
    const rec = await getAIRecommendation(generateRecPrompt(userTeam, chunk));
    allRecs.push(rec);
  }

  const finalRec = await getAIRecommendation(generateFinalRecPrompt(allRecs));
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

  for (const [key, value] of entries) {
    const entrySize = JSON.stringify({ [key]: value }).length;
    if (currentSize + entrySize > tokenLimit) {
      chunks.push(Object.fromEntries(currentChunk));
      currentChunk = [];
      currentSize = 0;
    }

    currentChunk.push([key, value]);
    currentSize += entrySize;
  }

  if (currentChunk.length > 0) {
    chunks.push(Object.fromEntries(currentChunk));
  }

  return chunks;
}
