import { useCallback, useContext, useState } from "react";
import { WASMContext } from "../context/WASM";
import cairoOutputToFrameScene from "../helpers/cairoOutputToFrameScene";
import Agent, { agentsToArray } from "../types/Agent";
import { FrameScene } from "../types/Frame";

/**
 * Hook to run the Cairo simulation using provided agent and adversary
 */
const useRunCairoSimulation = (
    p1: Agent,
    p2: Agent,
) => {
    const ctx = useContext(WASMContext);

    const [error, setError] = useState();
    const [output, setOutput] = useState<FrameScene>();

    const runCairoSimulation = useCallback(() => {
        if (!ctx.wasm) {
            console.warn("WASM not initialized");
            return;
        }
        try {
            let shoshinInput = new Int32Array(agentsToArray(p1, p2))
            let output = ctx.wasm.runCairoProgram(shoshinInput);
            setOutput(cairoOutputToFrameScene(output));
        } catch (e) {
            console.log("Got an error running wasm", e);
            setError(e);
        }
    }, [ctx, p1, p2]);

    return {
        wasmReady: ctx.wasm,
        runCairoSimulation,
        output,
        error,
    };
};

export default useRunCairoSimulation;
