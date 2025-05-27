import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
    DynamoDBClient, BatchGetItemCommand,
} from '@aws-sdk/client-dynamodb';

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const client = new DynamoDBClient({ region: 'us-east-1' });
    const body = event.body ? JSON.parse(event.body) : {};

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: '',
    };
    if (!Array.isArray(body)) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Player ids not provided' }),
        };
    }

    const keys = body.map((id) => ({
        playerId: { S: id },
    }));
    const command = new BatchGetItemCommand({
        RequestItems: {
            [process.env.PLAYER_TABLE!]: {
                Keys: keys,
            },
        },
    });

    try {
        if (event.httpMethod === 'OPTIONS') {
            response.statusCode = 200;
            return response;
        }
        const data = await client.send(command);
        response.body = JSON.stringify(data.Responses?.[process.env.PLAYER_TABLE!]);
        return response;
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not fetch data' }),
        };
    }
};
