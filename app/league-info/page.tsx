"use client";

import React from 'react';
import Button from '../components/Button/FetchButton';
import { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

const LeagueInfoPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [leagueIdInput, setLeagueIdInput] = useState(searchParams.get('leagueId') ?? '');

    const createQueryString = useCallback(
        (name: string, value: string) => {
          const params = new URLSearchParams(searchParams.toString())
          params.set(name, value)
     
          return params.toString()
        },
        [searchParams]
      );

    const fetchLeagueData = async () => {
        setLoading(true);
        try {
            const rawRes = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/fetchLeagueData?leagueIdInput=${leagueIdInput}`);
            console.log('raw response from fetch league data: ', rawRes);
            if (rawRes.status != 200) {
                throw new Error('Failed to fetch league data');
            }
            setError(false);
            setLoading(false);
            router.push('./league-roster' + '?' + createQueryString('leagueId', leagueIdInput));
        } catch (err) {
            setLoading(false);
            setError(true);
            console.error(err);
        }
    }

    return (
        <div className="text-center">
            <h1 className='text-2xl py-2'> League Information Here</h1>
            <input
                type='text'
                placeholder='Enter your sleeper league id here'
                value={leagueIdInput}
                onChange={(e) => {
                    setLeagueIdInput(e.target.value)
                }}
                className='border-2 border-black'
            />
            {error &&
                <div className='text-red'>
                    Error occurred fetching league data. Please try again
                </div>}
            {loading && <p>Loading...</p>}
            <div>
                <Button className='bg-slate-200 py-2' onClick={fetchLeagueData}> Click here to fetch data </Button>

            </div>

        </div>
    );
};

export default LeagueInfoPage;
