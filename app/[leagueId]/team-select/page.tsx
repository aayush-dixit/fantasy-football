"use client";

import React, { useEffect } from "react";
import Button from '../../components/Button/FetchButton';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Team, User } from "./types";
import axios from 'axios';
import TeamDisplay from "../../components/TeamDisplay/TeamDisplay";

const TeamSelectPage = () => {
    const router = useRouter();
    const pathName = usePathname();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [leagueOwners, setLeagueOwners] = useState<string[]>([]);
    const [leagueUsers, setLeagueUsers] = useState<User[]>([]);

    const leagueIdInput = pathName.split('/')[1];

    useEffect(() => {
        const storedUsers = localStorage.getItem('leagueUsers');
        if (storedUsers) {
            setLeagueUsers(JSON.parse(storedUsers));
        }
    }, []);
    
    if (!leagueIdInput) {
        router.push('/');
        return;
    }
    
    
    const fetchLeagueRoster = async() => {
        setLoading(true);
        try {
            const rawRes = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/fetchLeagueRosters?leagueIdInput=${leagueIdInput}`);
            if (rawRes.status != 200) {
                throw new Error('Failed to fetch league data');
            }
            setError(false);
            setLoading(false);
            localStorage.setItem('leagueRosters', JSON.stringify(rawRes.data));
            const owners = rawRes.data.map((team: Team) => team.owner_id);
            setLeagueOwners(owners);
        } catch (err) {
            setLoading(false);
            setError(true);
            console.error(err);
        }
    }

    const fetchLeagueUsers = async (teams: string[]) => {
        setLoading(true);
        try {
            const results: User[] = [];
            
            for (const team of teams) {
                const rawRes = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/fetchLeagueUser?userId=${team}`);
                if (rawRes.status !== 200) {
                    throw new Error('Failed to fetch league data for user: ' + team);
                }
                results.push(rawRes.data);
            }
    
            setLeagueUsers(results);
            localStorage.setItem('leagueUsers', JSON.stringify(results))
            setLoading(false);
            setError(false);
            
        } catch (err) {
            console.error('Error fetching league users:', err);
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        const getUsers = async() => {
            await fetchLeagueUsers(leagueOwners);
        };
        getUsers();
    }, [leagueOwners, setLeagueOwners]);

    useEffect(() => {
        const getLeagueInfo = async() => {
            await fetchLeagueRoster();
        };
        getLeagueInfo();
    }, []);


    
    return (
        <div className="text-center">
            <h1 className="text-2xl mb-12 mt-4">Select your team</h1>
            <div className="flex flex-col items-center">
                {loading && <p>Fetching league rosters...</p>}
                {leagueUsers && leagueUsers.map(user =>  (
                <TeamDisplay user={user} key={user.user_id} className='py-2'/>
            ))}
            </div>

        </div>
    )

}

export default TeamSelectPage;