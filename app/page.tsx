"use client";

import React from 'react';
import Button from './components/Button/FetchButton';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const LeagueInfoPage = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [leagueIdInput, setLeagueIdInput] = useState('');

    const fetchLeagueData = async () => {
        setLoading(true);
        try {
            const rawRes = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/fetchLeagueData?leagueIdInput=${leagueIdInput}`);
            if (rawRes.status != 200) {
                throw new Error('Failed to fetch league data');
            }
            setError(false);
            setLoading(false);
            localStorage.setItem('leagueData', JSON.stringify(rawRes.data));
            router.push(`./${leagueIdInput}/team-select`);
        } catch (err) {
            setLoading(false);
            setError(true);
            console.error(err);
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
                <Button className='bg-slate-500 border-2 border-black rounded py-2 text-white w-[200px]' onClick={fetchLeagueData}> Click here to fetch data </Button>

            </div>

        </div>
    );
};

export default LeagueInfoPage;
