import { PlayerAgent } from '../../../types/Agent';
import { TestJson } from '../../../types/Frame';

const defeatOpponentEvaluation = (
    animationFrame: number,
    testJson: TestJson,
    playerAgent: PlayerAgent
) => {
    if (!testJson || testJson.agent_1 === null) {
        return false;
    }
    const frameLength = testJson.agent_1.frames.length;
    return testJson.agent_1.frames[frameLength - 1].body_state.integrity < 1000;
};

export const defeatOpponentObjective = {
    description: 'Defeat the opponent',
    evaluate: defeatOpponentEvaluation,
};
