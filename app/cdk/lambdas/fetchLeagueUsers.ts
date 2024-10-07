import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: '',
    };

    try {
        
        if (event.httpMethod === 'OPTIONS') {
            response.statusCode = 200;
            return response;
        }

        const userId = event.queryStringParameters?.userId;

        if (!userId) {
            response.statusCode = 400;
            response.body = JSON.stringify({ error: 'leagueIdInput is required' });
            return response;
        }

        const rawRes = await axios.get(`https://api.sleeper.app/v1/user/${userId}`);
        if (rawRes.status !== 200) {
            throw new Error('Failed to fetch league rosters');
        }

        response.body = JSON.stringify(rawRes.data);
    } catch (err) {
        console.error(err);
        response.statusCode = 500;
        response.body = JSON.stringify({ error: 'Failed to fetch league data' });
    }

    return response;
};
