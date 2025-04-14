'use client';

import React, { Suspense, useEffect, useMemo } from 'react';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ClaudeRecommendation,
  DynamoPlayer,
  Player,
  Team,
} from '../../types/types';
import RosterDisplay from '../../components/RosterDisplay/RosterDisplay';
import { useStore } from '../../store/useStore';
import { fetchPlayerById } from '../../server-actions/fetchPlayerById';
import {
  mapLeaguePlayers,
  filteredPlayer,
} from '../../server-actions/mapLeaguePlayers';
import { getAIRecommendation } from '../../utils/getAIRecommendation';
import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import RecommendationModal from '../../components/Modal/RecommendationModal';
import Loading from '../loading';
import BackButton from '../../components/Button/BackButton';

const LeagueRosterPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const playerInfo: Player[] = [];
  const [loading, setLoading] = useState(false);
  const [playerInfoLoaded, setPlayerInfoLoaded] = useState(false);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [recommendation, setRecommendation] = useState<string | null>('');
  const [recLoading, setRecLoading] = useState(false);

  const userId = searchParams.get('userId');

  const { leagueRosters } = useStore();
  useEffect(() => {
    if (!leagueRosters) {
      router.push('/');
      return;
    }
  }, []);

  const userTeam: Team | undefined = leagueRosters?.find(
    (team: Team) => team.owner_id === userId
  );

  useEffect(() => {
    if (!userTeam) {
      router.push('/');
      return;
    }
  }, []);

  const players = userTeam?.players || [];
  let playersMap: Record<string, filteredPlayer[]> = {};
  useEffect(() => {
    const getLeagueInfo = async () => {
      if (allPlayers.length == 0) {
        setLoading(true);
        const playerPromises = players.map(
          async (player) => await fetchPlayerById(player)
        );
        const fetchedPlayers = await Promise.all(playerPromises);

        for (const player of fetchedPlayers) {
          if (!player.success) {
            throw new Error('Failed to fetch player data');
          }
          const data = JSON.parse(JSON.stringify(player.data));
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
              age: item.age.S,
            };
          });
          if (jsonResponse.length) {
            playerInfo.push(jsonResponse[0]);
          }
        }
        setPlayerInfoLoaded(true);
        setLoading(false);
        setAllPlayers(playerInfo);
      }
    };

    getLeagueInfo();
  }, [players]);

  async function getRecommendation() {
    if (!leagueRosters) {
      return null;
    }
    setRecLoading(true);
    playersMap = await mapLeaguePlayers(leagueRosters);
    const userTeam = Object.fromEntries(
      Object.entries(playersMap).filter(([user]) => user === userId)
    );
    const filteredMap = Object.fromEntries(
      Object.entries(playersMap).filter(([user]) => user !== userId)
    );
    const recommendation = await getAIRecommendation(userTeam, filteredMap);
    setRecommendation(recommendation);
    open();
    setRecLoading(false);
  }

  return (
    <Suspense fallback={<Loading />}>
      {!recLoading && (
        <div className="text-center flex flex-col items-center">
          {loading && <div> Loading player information... </div>}
          {playerInfoLoaded && <RosterDisplay players={allPlayers} />}
          {playerInfoLoaded && !recLoading && (
            <Button
              variant="filled"
              color="dark"
              onClick={getRecommendation}
              size="xl"
            >
              Recommend Me Trades
            </Button>
          )}
          <BackButton />
        </div>
      )}

      {recLoading && <Loading />}

      {recommendation && (
        <RecommendationModal
          opened={opened}
          onClose={close}
          title="Recommended trades: "
          recommendation={JSON.parse(recommendation)}
        />
      )}
    </Suspense>
  );
};

export default LeagueRosterPage;
