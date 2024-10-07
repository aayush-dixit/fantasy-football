import React from "react";
import { User } from "../../[leagueId]/team-select/types";
import Image from "next/image";
import Link from "next/link";
import clsx from 'clsx';

interface TeamDisplayProps {
    user: User;
    className?: string;
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({ user, className }) => {
    return (
        <div className={clsx('flex w-[250px] justify-center hover:bg-slate-100', className)}>
            <Image className="mr-4" src={`https://sleepercdn.com/avatars/thumbs/${user.avatar}`} alt="team img" width={50} height={50} />

            <Link className="mt-2 text-xl" href={'./league-roster'}>
                {user.display_name}
            </Link>
        </div>
    )
}

export default TeamDisplay;
