"use client";

import React, { useEffect } from "react";
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DynamoPlayer, Player, Team } from "../../types/types";
import RosterDisplay from "../../components/RosterDisplay/RosterDisplay";
import { useStore } from "../../store/useStore";
import { fetchPlayerById } from "../../server-actions/fetchPlayerById";
const LeagueRosterPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const playerInfo: Player[] = [];
    const [loading, setLoading] = useState(false);
    const [playerInfoLoaded, setPlayerInfoLoaded] = useState(false);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);

    const userId = searchParams.get('userId');
    
    const { leagueRosters } = useStore();
    if (!leagueRosters) {
        router.push('/');
        return;
    }

    const userTeam: Team | undefined = leagueRosters.find((team: Team) => team.owner_id === userId);
    if (!userTeam) {
        router.push('/');
        return;
    }
    const players = userTeam.players;

    useEffect(() => {
        const getLeagueInfo = async () => {
            setLoading(true);
            for (const player of players) {
                const playerData = await fetchPlayerById(player);
                if (!playerData.success) {
                    throw new Error('Failed to fetch player data');
                }
                const data = JSON.parse(JSON.stringify(playerData.data));
                const jsonResponse: [Player] = data.map((item: DynamoPlayer) => {
                    return {
                        injury_status: item.injury_status.S,
                        status: item.status.S,
                        team: item.team.S,
                        playerId: item.playerId.S,
                        full_name: item.full_name.S,
                        espn_id: item.espn_id.S,
                        years_exp: item.years_exp.S,
                        position: item.position.S,
                        age: item.age.S
                    };
                });
                if (jsonResponse.length) {
                    playerInfo.push(jsonResponse[0]);
                }
            }
            setPlayerInfoLoaded(true);
            setLoading(false);
            setAllPlayers(playerInfo);
        };
        getLeagueInfo();
    }, []);

    return (
        <div className="text-center">
            {loading && <div> Loading player information... </div>}
            {playerInfoLoaded &&
                <RosterDisplay players={allPlayers} />
            }

        </div>
    )

}

export default LeagueRosterPage;