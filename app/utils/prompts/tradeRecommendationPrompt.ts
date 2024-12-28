import { filteredPlayer } from "../../server-actions/mapLeaguePlayers";

export function tradeRecommendationPrompt<T>(
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
          "playerId": [playerId],
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
          "playerId": [playerId],
        }, ...
        ]
      },
    }  
    `;
  }