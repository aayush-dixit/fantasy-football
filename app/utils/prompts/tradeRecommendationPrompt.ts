import { filteredPlayer } from '../../server-actions/mapLeaguePlayers';

export function tradeRecommendationPrompt<T>(
  userTeam: Record<string, filteredPlayer[]>,
  chunk: Record<string, T>
) {
  return `For this user's team, recommend exactly 3 trades with 3 different teams, with up to 3 players on each side. Only include trades where the difference in value between the two sides is less than 400, and pick the 3 with the lowest value difference between them and the user.

User's team:
${JSON.stringify(userTeam)}

Other teams:
${JSON.stringify(chunk)}

Respond only with a JSON array of 3 trade objects. Each object in the array must have the following structure:

    {"suggestions":
      [
        {
          "userTeam": {
            "sends": [
              {
              "playerName": [playerName],
              "position": [position],
              "value": [value],
              "playerId": [playerId],
            }, ...
            ],
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
            ],
        },
        "rationale": [rationale],
      },
        ...
      ]
    }
  }

Do not include any explanation or text — only return the array of 3 trade objects in valid JSON format.`;
}
