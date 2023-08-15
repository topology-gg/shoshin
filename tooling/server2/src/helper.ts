import { MongoClient, WithId } from 'mongodb';
import clientPromise from '../../lib/mongodb';
import * as wasm from '../../wasm/shoshin/pkg/shoshin';
import Agent, {
    PlayerAgent,
    agentsToArray,
    buildAgent,
} from '../../src/types/Agent';

import { layersToAgentComponents } from '../../src/types/Layer';
import cairoOutputToFrameScene from '../../src/helpers/cairoOutputToFrameScene';
import { FrameScene } from '../../src/types/Frame';
type PvPResult = {
    result: 'win' | 'loss';
    score: number;
    hp: number;
};

async function runSimulation(
    p1: Agent,
    p2: Agent
): Promise<[FrameScene, Error]> {
    let shoshinInput = new Int32Array(agentsToArray(p1, p2));
    let output = wasm.runCairoProgram(shoshinInput);
    return [cairoOutputToFrameScene(output), null];
}
