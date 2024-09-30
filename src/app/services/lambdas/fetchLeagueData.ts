import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const leagueIdInput = event.queryStringParameters?.leagueIdInput;
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: '',
    };

    try {
        if (!leagueIdInput) {
            response.statusCode = 400;
            response.body = JSON.stringify({ error: 'leagueIdInput is required' });
            return response;
        }

        const rawRes = await axios.get(`${process.env.API_GATEWAY_URL}/${leagueIdInput}`);
        
        if (rawRes.status !== 200) {
            throw new Error('Failed to fetch league data');
        }

        response.body = JSON.stringify(rawRes.data);
    } catch (err) {
        console.error(err);
        response.statusCode = 500;
        response.body = JSON.stringify({ error: 'Failed to fetch league data' });
    }

    return response;
};