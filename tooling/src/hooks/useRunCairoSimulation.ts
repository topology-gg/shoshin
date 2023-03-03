import { useCallback, useContext, useState } from "react";
import { WASMContext } from "../context/WASM";
import cairoOutputToFrameScene from "../helpers/cairoOutputToFrameScene";
import Agent, { flattenAgent } from "../types/Agent";
import { FrameScene } from "../types/Frame";

/**
 * Hook to run the Cairo simulation using provided agent and adversary
 */
const useRunCairoSimulation = (
    agent: Agent,
    opponent: Agent,
    combo: number[]
) => {
    const ctx = useContext(WASMContext);

    const [error, setError] = useState();
    const [output, setOutput] = useState<FrameScene>();

    const runCairoSimulation = useCallback(() => {
        if (!ctx.wasm) {
            console.warn("WASM not initialized");
            return;
        }
        // flatten the user input agent
        let [
            combosOffset,
            combos,
            mentalStatesOffset,
            mentalStates,
            functionsOffset,
            functions,
        ] = flattenAgent(agent);
        // flatten the dummy agent
        let [
            opponentCombosOffset,
            opponentCombos,
            opponentMentalStatesOffset,
            opponentMentalStates,
            opponentFunctionsOffset,
            opponentFunctions,
        ] = flattenAgent(opponent);

        try {
            let shoshinInput = new Int32Array([
                combosOffset.length,
                ...combosOffset,
                combos.length,
                ...combos,
                opponentCombosOffset.length,
                ...opponentCombosOffset,
                opponentCombos.length,
                ...opponentCombos,
                mentalStatesOffset.length,
                ...mentalStatesOffset,
                mentalStates.length / 3,
                ...mentalStates,
                agent.initialState,
                opponentMentalStatesOffset.length,
                ...opponentMentalStatesOffset,
                opponentMentalStates.length / 3,
                ...opponentMentalStates,
                0,
                functionsOffset.length,
                ...functionsOffset,
                functions.length / 3,
                ...functions,
                opponentFunctionsOffset.length,
                ...opponentFunctionsOffset,
                opponentFunctions.length / 3,
                ...opponentFunctions,
                agent.actions.length,
                ...agent.actions,
                opponent.actions.length,
                ...opponent.actions,
                agent.character,
                opponent.character,
            ]);
            let output = ctx.wasm.runCairoProgram(shoshinInput);
            setOutput(cairoOutputToFrameScene(output));
        } catch (e) {
            console.log("Got an error running wasm", e);
            setError(e);
        }
    }, [ctx, agent, opponent, combo]);

    return {
        wasmReady: ctx.wasm,
        runCairoSimulation,
        output,
        error,
    };
};

export default useRunCairoSimulation;
