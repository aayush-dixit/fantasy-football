'use client';

import React, { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from './store/useStore';
import { fetchLeagueData } from './server-actions/fetchLeagueData';
import Loading from './[leagueId]/loading';
import FetchButton from './components/Button/FetchButton';

const LeagueInfoPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [leagueIdInput, setLeagueIdInput] = useState('');
  const { setLeagueData, resetStore } = useStore();

  useEffect(() => {
    resetStore();
  }, []);

  const handleClick = async () => {
    setLoading(true);
    const response = await fetchLeagueData(leagueIdInput);
    if (response.success) {
      setLeagueData(response.data);
      router.push(`./${leagueIdInput}/team-select`);
    }
    setLoading(false);

  };

  return (
    <div className="text-center flex flex-col h-screen items-center justify-center">
      <h1 className="text-2xl mb-8">
        To get started, enter in your Sleeper league ID below
      </h1>
      <input
        type="text"
        placeholder="Enter your sleeper league id here"
        value={leagueIdInput}
        onChange={(e) => {
          setLeagueIdInput(e.target.value);
        }}
        className="border-2 border-black w-1/3 h-[40px] rounded-lg mb-4 text-center"
      />

      <div>
        {loading ? <Loading /> : <FetchButton
          className="bg-slate-500 border-2 border-black rounded py-2 text-white w-[200px]"
          onClick={handleClick}
          disabled={!leagueIdInput}

        >
          Click here to fetch data
        </FetchButton>}

      </div>
    </div>
  );
};

export default LeagueInfoPage;
