import { useCallback, useContext } from 'react';
import {
    IShoshinWASMContext,
    ShoshinWASMContext,
} from '../context/wasm-shoshin';
import cairoOutputToFrameScene from '../helpers/cairoOutputToFrameScene';
import Agent, { agentsToArray } from '../types/Agent';

/**
 * Hook to run the Cairo simulation using provided p1 and p2 agents
 */
const useRunCairoSimulation = (p1: Agent, p2: Agent) => {
    const ctx = useContext(ShoshinWASMContext);

    // console.log('p1', p1, 'p2', p2);
    const runCairoSimulation = useCallback(() => {
        if (!ctx.wasm) {
            console.warn('WASM not initialized');
            return;
        }

        console.log('player 1 agent before calldata formation:', p1);
        let calldataArray = agentsToArray(p1, p2);
        // console.log('calldataArray', calldataArray);
        let shoshinInput = new Int32Array(calldataArray);
        console.log('shoshinInput', shoshinInput);

        try {
            let output = ctx.wasm.runCairoProgram(shoshinInput);
            console.log('raw output', output);
            return [cairoOutputToFrameScene(output), null];
        } catch (e) {
            console.log('Got an error running wasm', e);
            return [null, e];
        }
    }, [ctx, p1, p2]);

    return {
        wasmReady: ctx.wasm,
        runCairoSimulation,
    };
};

export default useRunCairoSimulation;

export const runCairoSimulation = (
    p1: Agent,
    p2: Agent,
    ctx: IShoshinWASMContext
) => {
    if (!ctx.wasm) {
        console.warn('WASM not initialized');
        return;
    }

    console.log('player 1 agent before calldata formation:', p1);
    let calldataArray = agentsToArray(p1, p2);
    // console.log('calldataArray', calldataArray);
    let shoshinInput = new Int32Array(calldataArray);
    console.log('shoshinInput', shoshinInput);

    try {
        let output = ctx.wasm.runCairoProgram(shoshinInput);
        console.log('raw output', output);
        return [cairoOutputToFrameScene(output), null];
    } catch (e) {
        console.log('Got an error running wasm', e);
        return [null, e];
    }
};
