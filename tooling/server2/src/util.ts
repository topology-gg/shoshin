import * as wasm from 'next-exp/wasm/shoshin/pkg_nodejs/shoshin.js';
import Agent, {
    PlayerAgent,
    agentsToArray,
    buildAgent,
} from 'next-exp/dist/src/types/Agent.js';

import cairoOutputToFrameScene from 'next-exp/dist/src/helpers/cairoOutputToFrameScene.js';
import { FrameScene } from 'next-exp/dist/src/types/Frame.js';
import { buildAgentFromLayers } from 'next-exp/dist/src/components/ChooseOpponent/opponents/util.js';
import {
    Character,
    ScoreMap,
    calculateScoreMap,
} from 'next-exp/dist/src/constants/constants.js';
import {
    JessicaOpponents,
    AntocOpponents,
} from 'next-exp/dist/src/components/ChooseOpponent/opponents/opponents.js';

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
    p2Agent: Agent.default
): Promise<[FrameScene, Error]> {
    const p1Agent = buildAgentFromLayers(
        p1.layers,
        p1.character === Character.Jessica ? 0 : 1,
        p1.combos
    );

    let shoshinInput = new Int32Array(agentsToArray(p1Agent, p2Agent));
    let output = wasm.runCairoProgram(shoshinInput);
    return [cairoOutputToFrameScene.default(output), null];
}
