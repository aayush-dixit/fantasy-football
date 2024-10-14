import React, { startTransition, useState } from 'react';
import { Player, Team } from '../../[leagueId]/team-select/types';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAIRecommendation } from "../../server-actions/getAIRecommendation";
import { ContentBlock } from '@anthropic-ai/sdk/resources/messages.mjs';
import { generateAnthropicPrompt } from '../../utils/generateAnthropicPrompt';

interface RosterDisplayProps {
    players: Player[];
}

const RosterDisplay: React.FC<RosterDisplayProps> = ({ players }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [response, setResponse] = useState<ContentBlock[] | string>();

    const qbs = players.filter((player: Player) => player.position === 'QB');
    const rbs = players.filter((player: Player) => player.position === 'RB');
    const wrs = players.filter((player: Player) => player.position === 'WR');
    const tes = players.filter((player: Player) => player.position === 'TE');
    const kickers = players.filter((player: Player) => player.position === 'K');

    const leagueRosters = localStorage.getItem('leagueRosters');
    if (leagueRosters == null) {
        router.push('/');
        return;
    }
    const userId = searchParams.get('userId');

    const roster: Team[] = JSON.parse(leagueRosters);
    const userPlayers = players.map((player: Player) => {
        player.injury_status,
        player.age,
        player.full_name,
        player.position,
        player.team
    });    
    
  const handleClick = () => {
    startTransition(async () => {
      const result = await getAIRecommendation(generateAnthropicPrompt(JSON.stringify(players)));
      setResponse(result); 
    });
  };
    

    return (
        <div>
            <h1 className='text-2xl font-bold'>Your Roster</h1>
            <div className='grid grid-cols-5 gap-4 mt-8'>
                <div>
                    <h1 className='text-xl font-bold'> QBs </h1>
                    {qbs.map((qb: Player, index: number) => (
                        <div key={index} className="flex flex-col p-2 border-b flex justify-center items-center">
                            <Image src={`https://sleepercdn.com/content/nfl/players/thumb/${qb.playerId}.jpg`} alt='headshot' width={100} height={100} />
                            <p>{qb.full_name} - {qb.team} - {qb.age}</p>
                        </div>
                    ))}
                </div>

                <div>
                    <h1 className='text-xl font-bold'> RBs </h1>
                    {rbs.map((rb: Player, index: number) => (
                        <div key={index} className="flex flex-col p-2 border-b flex justify-center items-center">
                            <Image src={`https://sleepercdn.com/content/nfl/players/thumb/${rb.playerId}.jpg`} alt='headshot' width={100} height={100} />
                            <p>{rb.full_name} - {rb.team} - {rb.age}</p>
                        </div>
                    ))}
                </div>

                <div>
                    <h1 className='text-xl font-bold'> WRs </h1>
                    {wrs.map((wr: Player, index: number) => (
                        <div key={index} className="flex flex-col p-2 border-b flex justify-center items-center">
                            <Image src={`https://sleepercdn.com/content/nfl/players/thumb/${wr.playerId}.jpg`} alt='headshot' width={100} height={100} />
                            <p>{wr.full_name} - {wr.team} - {wr.age}</p>
                        </div>
                    ))}
                </div>

                <div>
                    <h1 className='text-xl font-bold'> TEs </h1>
                    {tes.map((te: Player, index: number) => (
                        <div key={index} className="flex flex-col p-2 border-b flex justify-center items-center">
                            <Image src={`https://sleepercdn.com/content/nfl/players/thumb/${te.playerId}.jpg`} alt='headshot' width={100} height={100} />
                            <p>{te.full_name} - {te.team} - {te.age}</p>
                        </div>
                    ))}
                </div>

                <div>
                    <h1 className='text-xl font-bold'> Ks </h1>
                    {kickers.map((k: Player, index: number) => (
                        <div key={index} className="flex flex-col p-2 border-b flex justify-center items-center">
                            <Image src={`https://sleepercdn.com/content/nfl/players/thumb/${k.playerId}.jpg`} alt='headshot' width={100} height={100} />
                            <p>{k.full_name} - {k.team} - {k.age}</p>
                        </div>
                    ))}
                </div>
            </div>

            {JSON.stringify(response)}

            <button onClick={handleClick} className='py-8 rounded-lg bg-slate-200 text-xl'> Recommend My Next Move</button>
        </div>
    );
};

export default RosterDisplay;
