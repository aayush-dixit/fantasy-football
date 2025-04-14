'use client';

import React, { useEffect, Suspense } from 'react';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Team, User } from '../../types/types';
import TeamDisplay from '../../components/TeamDisplay/TeamDisplay';
import { useStore } from '../../store/useStore';
import { fetchLeagueUser } from '../../server-actions/fetchLeagueUser';
import { fetchLeagueRosters } from '../../server-actions/fetchLeagueRosters';
import BackButton from '../../components/Button/BackButton';

const TeamSelectPage = () => {
  const router = useRouter();
  const pathName = usePathname();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { setLeagueRosters, setLeagueUsers, leagueUsers } = useStore();

  const leagueIdInput = pathName.split('/')[1];

  if (!leagueIdInput) {
    router.push('/');
    return;
  }

  const fetchLeagueRoster = async () => {
    setLoading(true);
    try {
      const rosters = await fetchLeagueRosters(leagueIdInput);
      if (!rosters.success) {
        throw new Error('Failed to fetch league data');
      }
      const owners = rosters.data.map((team: Team) => team.owner_id);

      setError(false);
      setLoading(false);
      setLeagueRosters(rosters.data);
      await fetchLeagueUsers(owners);
    } catch (err) {
      setLoading(false);
      setError(true);
      console.error(err);
    }
  };

  const fetchLeagueUsers = async (teams: string[]) => {
    setLoading(true);
    try {
      const results: User[] = await Promise.all(
        teams.map(async (userId) => {
          const user = await fetchLeagueUser(userId);
          if (!user.success) {
            throw new Error(`Failed to fetch league data for user: ${userId}`);
          }
          return user.data;
        })
      );
      setLeagueUsers(results);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Error fetching league users:', err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLeagueInfo = async () => {
      await fetchLeagueRoster();
    };
    if (!leagueUsers) {
      getLeagueInfo();
    }
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-2xl mb-12 mt-4">Select your team</h1>
      <div className="flex flex-col items-center">
        {loading && <p>Fetching league rosters...</p>}
        {leagueUsers &&
          leagueUsers.map((user) => (
            <TeamDisplay user={user} key={user.user_id} className="py-2" />
          ))}
        <BackButton />
      </div>
    </div>
  );
};

export default TeamSelectPage;
