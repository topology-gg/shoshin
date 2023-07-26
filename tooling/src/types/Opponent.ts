import Agent from './Agent';

export interface Opponent {
    agent: Agent;
    medal: Medal;
    id: number;
    name: string;
    backgroundId: number;
    mindName?: string;
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
