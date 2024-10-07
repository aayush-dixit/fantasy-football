"use client";

import React, { useEffect } from "react";
import Button from '../components/Button/FetchButton';
import LeagueRosterDisplay from "../components/LeagueRostersDisplay/LeagueRosterDisplay";
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

const LeagueRosterPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [leagueRoster, setLeagueRoster] = useState('');

    const leagueIdInput = searchParams.get('leagueId');

    if (!leagueIdInput) {
        router.replace('./league-info');
        return;
    }

    useEffect(()=> {
        console.log('league roster: ', leagueRoster)
    }, [leagueRoster, setLeagueRoster]);

    const fetchLeagueRoster = async() => {
        setLoading(true);
        try {
            const rawRes = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/fetchLeagueRosters?leagueIdInput=${leagueIdInput}`);
            if (rawRes.status != 200) {
                throw new Error('Failed to fetch league data');
            }
            console.log('raw data: ',rawRes)
            setError(false);
            setLoading(false);
            setLeagueRoster(JSON.stringify(rawRes.data));
            console.log('done setting league roster',leagueRoster);
        } catch (err) {
            setLoading(false);
            setError(true);
            console.error(err);
        }
    }
    return (
        <div className="text-center">
            <div>
                <Button className='bg-slate-200 py-2' onClick={fetchLeagueRoster}> Click here to fetch your leagues rosters </Button>
            </div>
            {leagueRoster} 
            {/* {leagueRoster && <LeagueRosterDisplay leagueInfo={leagueRoster} />} */}
        </div>
    )

}

export default LeagueRosterPage;