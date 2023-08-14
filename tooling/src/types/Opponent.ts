import { Character, ScoreMap } from '../constants/constants';
import { PRESET_CONDITIONS } from '../constants/starter_agent';
import Agent, { PlayerAgent } from './Agent';

export interface Opponent {
    agent: Agent;
    medal: Medal;
    scoreMap: ScoreMap;
    id: number;
    name: string;
    backgroundId: number;
    mindName?: string;
}

export interface OnlineOpponent {
    agent: PlayerAgent;
    mindName: string;
    playerName: string;
}

export interface SavedMind extends OnlineOpponent {
    createdDate: string;
    lastUpdatedDate: string;
}

export const EMPTY_SAVED_MINDS: SavedMind[] = [
    {
        agent: {
            layers: [],
            character: Character.Jessica,
            conditions: PRESET_CONDITIONS,
            combos: [],
        } as PlayerAgent,
        mindName: 'Blank Jessica',
        playerName: 'SYSTEM',
        createdDate: '',
        lastUpdatedDate: '',
    },
    {
        agent: {
            layers: [],
            character: Character.Antoc,
            conditions: PRESET_CONDITIONS,
            combos: [],
        } as PlayerAgent,
        mindName: 'Blank Antoc',
        playerName: 'SYSTEM',
        createdDate: '',
        lastUpdatedDate: '',
    },
];

export enum Medal {
    NONE = 'None',
    GOLD = 'Gold',
    SILVER = 'Silver',
    BRONZE = 'Bronze',
}

const medalToNumber = (medal: Medal) => {
    if (medal == Medal.NONE) {
        return 0;
    } else if (medal == Medal.BRONZE) {
        return 1;
    } else if (medal == Medal.SILVER) {
        return 2;
    } else if (medal == Medal.GOLD) {
        return 3;
    }

    return 0;
};
export const achievedBetterPerformance = (newGrade: Medal, oldGrade: Medal) => {
    if (medalToNumber(newGrade) >= medalToNumber(oldGrade)) {
        return true;
    }
    return false;
};

export const achievedBetterScore = (newScore: ScoreMap, oldScore: ScoreMap) => {
    if (newScore.totalScore > oldScore.totalScore) {
        return true;
    }
    return false;
};
