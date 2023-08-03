import { PlayerAgent } from '../types/Agent';
import { OnlineOpponent, Opponent, SavedMind } from '../types/Opponent';

export interface ShoshinPersistedState {
    playerAgents: {
        jessica?: PlayerAgent;
        antoc?: PlayerAgent;
    };
    opponents: {
        jessica: Opponent[];
        antoc: Opponent[];
    };
    minds: SavedMind[];
}

const StorageKey = 'PersistedGameState';

export const getLocalState = (): ShoshinPersistedState | null => {
    const storedState = localStorage.getItem(StorageKey);
    if (storedState !== undefined && storedState !== null) {
        const state: ShoshinPersistedState = JSON.parse(storedState);
        return state;
    }

    return null;
};

export const setLocalState = (state: ShoshinPersistedState) => {
    localStorage.setItem(StorageKey, JSON.stringify(state));
};
