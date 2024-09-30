"use client";

import React from 'react';
import Button from '@/app/components/Button/FetchButton';
import { useState } from 'react';
import axios from 'axios';

const LeagueInfoPage = () => {
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [leagueIdInput, setLeagueIdInput] = useState('');

    const fetchLeagueData = async () => {
        setLoading(true);
        try {
            const rawRes = await axios.get(`https://api.sleeper.app/v1/league/${leagueIdInput}`);
            if (rawRes.status != 200) {
                throw new Error('Failed to fetch league data');
            }
            // console.log('rawRes: ', rawRes.body);
            setError(false);
            setLoading(false);
            console.log('res: ', rawRes);
            setData(JSON.stringify(rawRes));
        } catch (err) {
            setLoading(false);
            setError(true);
            console.error(err);
        }
    }

    return (<>
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
                {data}
            </div>

            <Button className='bg-slate-200' onClick={fetchLeagueData}> Click here to fetch data </Button>
        </div>
    </>);
};

export default LeagueInfoPage;
