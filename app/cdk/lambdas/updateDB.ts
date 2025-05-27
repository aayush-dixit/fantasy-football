import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { type SleeperPlayer } from '../types/types';

export const handler = async (): Promise<void> => {
    const client = new DynamoDBClient({ region: 'us-east-1' });

    try {
        const res = await fetch('https://api.sleeper.app/v1/players/nfl');
        const data = await res.json();
        const players = Object.values(data) as SleeperPlayer[];
        const BATCH_SIZE = 25;

        for (let i = 0; i < players.length; i += BATCH_SIZE) {
            const batch = players.slice(i, i + BATCH_SIZE);
            await Promise.all(
                batch.map((player) => {
                    const item = {
                        playerId: { S: player.player_id },
                        full_name: { S: player.full_name || "Unknown" },
                        position: { S: player.position || "Unknown" },
                        age: { S: String(player.age || "Unknown") },
                        espn_id: { S: String(player.espn_id || "Unknown") },
                        injury_status: { S: player.injury_status || "Unknown" },
                        team: { S: player.team || "Unknown" },
                        status: { S: player.status || "Unknown" },
                        years_exp: { S: String(player.years_exp || "0") },
                    };

                    return client.send(
                        new PutItemCommand({
                            TableName: process.env.PLAYER_TABLE!,
                            Item: item,
                        })
                    );
                })
            );
        }
    } catch (error) {
        console.error("Failed to update table", error);
        throw error;
    }
};