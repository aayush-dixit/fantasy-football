export function aggregateTradePrompt(allRecs: string[]) {
    return `Out of all these trade recommendations: ${JSON.stringify(allRecs)}, pick the 3 with the lowest value differences between the user and other team and provide a rationale as to why this trade would make sense for both teams without mentioning the numerical values assigned to each player. Return the response in the following JSON format: 
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
  }   `;
  }