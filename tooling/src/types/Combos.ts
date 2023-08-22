import { Action, actionIntentsInCombo } from './Action';

// Adds buffers between each action to ensure each one is done
// Jessica's slash is number 5 and it has 4 frames
// Combo [5, 5] can becomes [5,0,0,0,5,0,0,0,0]
export const addActionBuffersToCombo = (
    combo: Action[],
    character: number
): number[] => {
    const bufferedCombo: number[] = combo.reduce(
        (acc: number[], action, index, combo) => {
            let temp = acc;

            // There is a unwanted behavior in combos where actions with distinct bodyCounters need an additional frame of rest
            // To keep the display data consistant we do custom intents for the correctly working actions, namely walk
            let intents = actionIntentsInCombo(action, index, combo);

            // console.log('final intents', intents, action);
            intents ? temp.push(...intents) : null;

            return temp;
        },
        []
    );
    // console.log('buffered combo', bufferedCombo);
    return bufferedCombo;
};
