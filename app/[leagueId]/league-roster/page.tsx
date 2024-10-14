"use client";

import React, { startTransition, useEffect } from "react";
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { DynamoPlayer, Player, Team } from "../team-select/types";
import RosterDisplay from "../../components/RosterDisplay/RosterDisplay";

const LeagueRosterPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const playerInfo: Player[] = [];
    const [loading, setLoading] = useState(false);
    const [playerInfoLoaded, setPlayerInfoLoaded] = useState(false);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);

    const userId = searchParams.get('userId');
    const leagueRoster = localStorage.getItem('leagueRosters');

    if (!leagueRoster) {
        router.push('/');
        return;
    }

    const rosters = JSON.parse(leagueRoster);
    const userTeam: Team = rosters.find((team: Team) => team.owner_id === userId);
    const players = userTeam.players;

    const fetchPlayer = async (playerId: string) => {
        try {
            const rawRes = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/queryPlayerById?playerId=${playerId}`);
            if (rawRes.status != 200) {
                throw new Error('Failed to fetch league data');
            }
            return rawRes.data;

        } catch (err) {
            console.error(err);
            return null;
        }
    }

    useEffect(() => {
        const getLeagueInfo = async () => {
            setLoading(true);
            for (const player of players) {
                const playerData = await fetchPlayer(player);
                const jsonResponse: [Player] = playerData.map((item: DynamoPlayer) => {
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