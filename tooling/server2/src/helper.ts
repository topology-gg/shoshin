import * as wasm from '../../wasm/shoshin/pkg/shoshin';
import Agent, {
    PlayerAgent,
    agentsToArray,
    buildAgent,
} from '../../src/types/Agent';

import { layersToAgentComponents } from '../../src/types/Layer';
import cairoOutputToFrameScene from '../../src/helpers/cairoOutputToFrameScene';
import { FrameScene } from '../../src/types/Frame';
import { buildAgentFromLayers } from '.../../../src/components/ChooseOpponent/opponents/util';
import { Character, ScoreMap } from '../../src/constants/constants';
import {
    JessicaOpponents,
    AntocOpponents,
} from '../../src/components/ChooseOpponent/opponents/opponents';
import { calculateScoreMap } from '../../src/components/SimulationScene/MainScene';

export async function getScoreForOpponent(
    p1: PlayerAgent,
    opponentIndex: number
): Promise<[ScoreMap, Error]> {
    const opponents =
        p1.character === Character.Jessica ? JessicaOpponents : AntocOpponents;
    const frameScene = await runSimulation(p1, opponents[opponentIndex].agent);

    if (frameScene[0] && !frameScene[1]) {
        return [calculateScoreMap(frameScene[0], p1.character), null];
    }
    return [null, frameScene[1]];
}

async function runSimulation(
    p1: PlayerAgent,
    p2Agent: Agent
): Promise<[FrameScene, Error]> {
    const p1Agent = buildAgentFromLayers(
        p1.layers,
        p1.character === Character.Jessica ? 0 : 1,
        p1.combos
    );

    let shoshinInput = new Int32Array(agentsToArray(p1Agent, p2Agent));
    let output = wasm.runCairoProgram(shoshinInput);
    return [cairoOutputToFrameScene(output), null];
}
