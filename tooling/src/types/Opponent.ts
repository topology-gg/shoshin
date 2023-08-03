import Agent, { PlayerAgent } from './Agent';

export interface Opponent {
    agent: Agent;
    medal: Medal;
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
