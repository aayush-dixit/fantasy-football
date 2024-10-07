import React from 'react';
import { TeamItem } from './LeagueRosterDisplay';

interface RosterDisplayProps {
    teamItem: TeamItem;
}

const RosterDisplay: React.FC<RosterDisplayProps> = ({ teamItem }) => {


    return (
        <div>
           {JSON.stringify(teamItem.owner_id)}
        </div>
    );
};

export default RosterDisplay;
