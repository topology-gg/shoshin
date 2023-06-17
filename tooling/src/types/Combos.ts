import {
    ActionsAntoc,
    ActionsJessica,
    CharacterActions,
} from '../constants/constants';

// Adds buffers between each action to ensure each one is done
// Jessica's slash is number 5 and it has 4 frames
// Combo [5, 5] can becomes [5,0,0,0,5,0,0,0,0]
export const addActionBuffersToCombo = (
    combo: number[],
    actionMap: CharacterActions,
    charActions: ActionsJessica | ActionsAntoc
) => {
    actionMap[''];

    return combo.reduce((acc, action) => {
        let temp = acc;

        temp.push(action);

        for (let i = 0; i < actionMap[charActions[action]].duration; i++) {
            temp.push(0);
        }
        return temp;
    }, []);
};
