'use server';

import { FantasyCalcPlayer } from '../types/types';

export type getPlayerStatisticsResult =
  | {
      success: true;
      data: Record<string, FantasyCalcPlayer>;
    }
  | {
      success: false;
      errors: any;
    };

export async function getPlayerStatistics(): Promise<getPlayerStatisticsResult> {
  try {
    const response = await fetch(
      'https://api.fantasycalc.com/values/current?isDynasty=true&numQbs=1&numTeams=12&ppr=1'
    );
    if (response.status != 200) {
      throw new Error('Failed to fetch league data');
    }
    const data = await response.json();
    const statsMap = data.reduce(
      (map: Record<string, FantasyCalcPlayer>, item: any) => {
        const filteredObject: FantasyCalcPlayer = {
          player: {
            sleeperId: item.player.sleeperId,
          },
          value: item.value.toString(),
          overallRank: item.overallRank.toString(),
          positionRank: item.positionRank.toString(),
          redraftValue: item.redraftValue.toString(),
        };
        map[item.player.sleeperId] = filteredObject;
        return map;
      },
      {}
    );

    return {
      success: true,
      data: statsMap,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      errors: err,
    };
  }
}
