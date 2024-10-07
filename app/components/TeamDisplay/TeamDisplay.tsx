import React from "react";
import { User } from "../../[leagueId]/team-select/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import clsx from 'clsx';

interface TeamDisplayProps {
    user: User;
    className?: string;
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({ user, className }) => {

    const router = useRouter();

    const handleClick = () => {
        router.push(`./league-roster?userId=${user.user_id}`);
    }
    return (
        <div className={clsx('flex w-[350px] justify-between hover:bg-slate-100', className)} onClick={handleClick}>
            <Image className="mr-4 rounded" src={`https://sleepercdn.com/avatars/thumbs/${user.avatar}`} alt="team img" width={50} height={50} />

            <p className="mt-2 text-xl">
                {user.display_name}
            </p>
        </div>
    )
}

export default TeamDisplay;
