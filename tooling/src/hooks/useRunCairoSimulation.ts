import { useCallback, useContext } from 'react';
import { ShoshinWASMContext } from '../context/wasm-shoshin';
import cairoOutputToFrameScene from '../helpers/cairoOutputToFrameScene';
import Agent, { agentsToArray } from '../types/Agent';

/**
 * Hook to run the Cairo simulation using provided p1 and p2 agents
 */
const useRunCairoSimulation = (p1: Agent, p2: Agent) => {
    const ctx = useContext(ShoshinWASMContext);

    const runCairoSimulation = useCallback(() => {
        if (!ctx.wasm) {
            console.warn('WASM not initialized');
            return;
        }
        try {
            let shoshinInput = new Int32Array(agentsToArray(p1, p2));
            let output = ctx.wasm.runCairoProgram(shoshinInput);
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
