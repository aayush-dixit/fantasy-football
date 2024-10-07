import React from 'react';
import RosterDisplay from './RosterDisplay';
import axios from 'axios';


interface LeagueRosterProps {
    leagueInfo: string;
}

export type TeamItem = {
    owner_id: string;
    players: string[];
    reserve: string[] | null;
    roster_id: string;
    settings: {
        wins: string;
        losses: string;
    }
}

function filterData(input: string): TeamItem | null {
    try {
        const data = JSON.parse(input);
        return {
            owner_id: data.owner_id,
            players: data.players,
            reserve: data.reserve,
            roster_id: data.roster_id.toString(),
            settings: {
                wins: data.settings.wins.toString(),
                losses: data.settings.losses.toString(),
            }
        };
    } catch (err) {
        return null
    }
}

async function queryPlayers(players: string[]): Promise<string> {
    try {
        const rawRes = await axios.get(`${process.env.API_GATEWAY_URL}/queryPlayerById?playerIds=${players.join(',')}`);
        if (rawRes.status != 200) {
            throw new Error('Failed to fetch league data');
        }
        return JSON.stringify(rawRes);

       
    } catch (err) {

        console.error(err);
    }
    return 'nothing found'
}

const LeagueRosterDisplay: React.FC<LeagueRosterProps> = ({ leagueInfo }) => {
    const data = JSON.parse(leagueInfo);
    const newData: TeamItem[] = data.map((roster: Object) => filterData(JSON.stringify(roster)));
    
    const teams = newData.map(async(team) => await queryPlayers(team.players));


    return (
        <div>
            {/* {newData.map((team) => (
                <RosterDisplay teamItem={team}/>
            ))} */}
            {teams}
        </div>
    );
};

export default LeagueRosterDisplay;
