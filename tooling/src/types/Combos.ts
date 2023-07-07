import { Action, actionDurationInCombo, defaultAction } from './Action';

// Adds buffers between each action to ensure each one is done
// Jessica's slash is number 5 and it has 4 frames
// Combo [5, 5] can becomes [5,0,0,0,5,0,0,0,0]
export const addActionBuffersToCombo = (
    combo: Action[],
    character: number
): number[] => {
    return combo.reduce((acc, action, index, combo) => {
        let temp = acc;

        temp.push(action.id);

        // There is a unwanted behavior in combos where actions with distinct bodyCounters need an additional frame of rest
        // To keep the display data consistant we do custom durations for the correctly working actions, namely walk
        let duration =
            customDurations[character][action.id] !== undefined
                ? customDurations[character][action.id]
                : actionDurationInCombo(action, index, combo);

        for (let i = 0; i < duration; i++) {
            temp.push(0);
        }
        return temp;
    }, []);
};

const customDurationsJessica = {
    '0': 0,
    // walkForward
    '5': 0,
    // walkBackward
    '6': 0,
};

const customDurationsAntoc = {
    '0': 0,
    // walkForward
    '4': 0,
    // walkBackward
    '5': 0,
};

export const customDurations = [customDurationsJessica, customDurationsAntoc];
