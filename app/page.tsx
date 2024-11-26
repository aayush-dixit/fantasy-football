"use client";

import React from 'react';
import Button from './components/Button/FetchButton';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from './store/useStore';
import { fetchLeagueData } from './server-actions/fetchLeagueData';

const LeagueInfoPage = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [leagueIdInput, setLeagueIdInput] = useState('');
    const {setLeagueData} = useStore();

    const handleClick = async() => {
        setLoading(true);
        const response = await fetchLeagueData(leagueIdInput);
        if (response.success) {
            setLeagueData(response.data);
            setLoading(false);
            setError(false);
            router.push(`./${leagueIdInput}/team-select`);
        } else {
            setError(true)
            setLoading(false);
        }
    }

    return (
        <div className="text-center flex flex-col h-screen items-center justify-center">
            <h1 className='text-2xl mb-8'> To get started, enter in your Sleeper league ID below</h1>
            <input
                type='text'
                placeholder='Enter your sleeper league id here'
                value={leagueIdInput}
                onChange={(e) => {
                    setLeagueIdInput(e.target.value)
                }}
                className='border-2 border-black w-1/3 h-[40px] rounded-lg mb-4 text-center'
            />
            {error &&
                <div className='text-red'>
                    Error occurred fetching league data. Please try again
                </div>}
            {loading && <p>Loading...</p>}
            <div>
                <Button className='bg-slate-500 border-2 border-black rounded py-2 text-white w-[200px]' onClick={handleClick}> Click here to fetch data </Button>

            </div>

        </div>
    );
};

export default LeagueInfoPage;
