import { Action, defaultAction } from './Action';

// Adds buffers between each action to ensure each one is done
// Jessica's slash is number 5 and it has 4 frames
// Combo [5, 5] can becomes [5,0,0,0,5,0,0,0,0]
export const addActionBuffersToCombo = (combo: Action[]): number[] => {
    return combo.reduce((acc, action) => {
        let temp = acc;

        temp.push(action.id);

        for (let i = 0; i < action.frames.duration - 1; i++) {
            temp.push(0);
        }
        return temp;
    }, []);
};
