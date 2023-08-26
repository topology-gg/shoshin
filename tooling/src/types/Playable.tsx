import { Typography } from '@mui/material';
import { OnlineOpponent, Opponent, SavedMind } from './Opponent';
import { PlayerAgent } from './Agent';

export type Playable = SavedMind | OnlineOpponent | PlayerAgent;

export const getNameForPlayable = (playable: Playable | Opponent) => {
    let playerOneNameString = '';
    if ('playerName' in playable) {
        if ('playerName' in playable && playable.playerName.length) {
            playerOneNameString =
                playable.mindName + ' by ' + playable.playerName;
        } else if ('mindName' in playable && !playable.mindName.length) {
            playerOneNameString = playable.mindName;
        } else {
            playerOneNameString = playable.agent.character;
        }
    } else if ('mindName' in playable && playable.mindName.length) {
        playerOneNameString = playable.mindName;
    } else if ('character' in playable) {
        playerOneNameString = playable.character;
    }

    return playerOneNameString;
};
