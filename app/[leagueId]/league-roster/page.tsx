"use client";

import React, { useEffect } from "react";
import Button from '../../components/Button/FetchButton';
import LeagueRosterDisplay from "../../components/LeagueRostersDisplay/LeagueRosterDisplay";
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

const LeagueRosterPage = () => {

    return (
        <div className="text-center">
            Hi this is the league roster page!!!!
        </div>
    )

}

export default LeagueRosterPage;