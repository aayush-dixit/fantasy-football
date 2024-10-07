const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get the playerIds from query parameters and split them into an array
  const playerIds = event.queryStringParameters?.playerIds;

  // Check if playerIds is provided and is an array of up to 20 player IDs
  if (!playerIds) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'playerIds parameter is required' })
    };
  }

  const idsArray = playerIds.split(',').slice(0, 20); // Convert to array and limit to 20

  // Prepare the batchGet parameters
  const params = {
    RequestItems: {
      playerDatabase: {
        Keys: idsArray.map(playerId => ( {playerId })) // Format for batchGet
      }
    }
  };

  try {
    const result = await dynamoDB.batchGet(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Responses.playerDatabase) // Return the items retrieved
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not retrieve player data' })
    };
  }
};
