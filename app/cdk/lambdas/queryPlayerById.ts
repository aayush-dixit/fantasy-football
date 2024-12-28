import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const client = new DynamoDBClient({ region: 'us-east-1' });

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: '',
  };
  const playerId = event.queryStringParameters?.playerId;
  if (!playerId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Player id not provided' }),
    };
  }

  const command = new QueryCommand({
    TableName: process.env.PLAYER_TABLE,
    KeyConditionExpression: 'playerId = :playerId',
    ExpressionAttributeValues: {
      ':playerId': { S: playerId },
    },
  });

  try {
    if (event.httpMethod === 'OPTIONS') {
      response.statusCode = 200;
      return response;
    }
    const data = await client.send(command);
    response.body = JSON.stringify(data.Items);
    return response;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch data' }),
    };
  }
};
