type Metadata = {
    record?: string;
    streak?: string;
}

type Settings = {
    division: number;
    fpts: number;
    fpts_against: number;
    fpts_against_decimal: number;
    fpts_decimal: number;
    losses: number;
    ppts: number;
    ppts_decimal: number;
    ties: number;
    total_moves: number;
    waiver_adjusted: number;
    waiver_budget_used: number;
    waiver_position: number;
    wins: number;
}

export type Team = {
    co_owners: string[] | null;
    keepers: string[] | null;
    league_id: string;
    metadata: Metadata | null;
    owner_id: string;
    player_map: string | null;
    players: string[];
    reserve: string[];
    roster_id: number;
    settings: Settings;
    starters: string[];
    taxi: string[] | null;
}

export type User = {
    avatar: string | null;
    display_name: string;
    user_id: string;
    username: string;
}