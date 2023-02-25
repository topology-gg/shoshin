import { useCallback, useContext, useState } from "react";
import {
    DECISION_TREE_COMBO_AGENT,
    DEFENSIVE_AGENT,
    INITIAL_FUNCTIONS,
    MENTAL_STATES_COMBO_AGENT,
    OFFENSIVE_AGENT,
} from "../constants/constants";
import { WASMContext } from "../context/WASM";
import cairoOutputToFrameScene from "../helpers/cairoOutputToFrameScene";
import Agent, { buildAgent, flattenAgent } from "../types/Agent";
import { FrameScene } from "../types/Frame";

const getDummyDefensiveArgs = () => {
    let agent = DEFENSIVE_AGENT;
    return [...flattenAgent(agent), new Int32Array(agent.actions)];
};

const getDummyOffensiveArgs = () => {
    let agent = OFFENSIVE_AGENT;
    return [...flattenAgent(agent), new Int32Array(agent.actions)];
};

const getDummyComboArgs = (combo: number[]) => {
    let agent: Agent = buildAgent(
        MENTAL_STATES_COMBO_AGENT,
        [combo],
        DECISION_TREE_COMBO_AGENT,
        INITIAL_FUNCTIONS,
        0,
        1
    );
    console.log(agent);
    return [...flattenAgent(agent), new Int32Array(agent.actions)];
};

const getDummyArgs = (type: string, combo: number[]) => {
    switch (type) {
        case "defensive": {
            return getDummyDefensiveArgs();
        }
        case "offensive": {
            return getDummyOffensiveArgs();
        }
        case "combo": {
            return getDummyComboArgs(combo);
        }
    }
};

/**
 * Hook to run the Cairo simulation using provided agent and adversary
 */
const useRunCairoSimulation = (
    agent: Agent,
    adversary: string,
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
        let [
            combosOffset,
            combos,
            mentalStatesOffset,
            mentalStates,
            functionsOffset,
            functions,
        ] = flattenAgent(agent);
        let [
            dummyCombosOffset,
            dummyCombos,
            dummyMentalStatesOffset,
            dummyMentalStates,
            dummyFunctionsOffset,
            dummyFunctions,
            dummyActions,
        ] = getDummyArgs(adversary, combo);

        try {
            let shoshinInput = new Int32Array([
                combosOffset.length,
                ...combosOffset,
                combos.length,
                ...combos,
                dummyCombosOffset.length,
                ...dummyCombosOffset,
                dummyCombos.length,
                ...dummyCombos,
                mentalStatesOffset.length,
                ...mentalStatesOffset,
                mentalStates.length / 3,
                ...mentalStates,
                agent.initialState,
                dummyMentalStatesOffset.length,
                ...dummyMentalStatesOffset,
                dummyMentalStates.length / 3,
                ...dummyMentalStates,
                0,
                functionsOffset.length,
                ...functionsOffset,
                functions.length / 3,
                ...functions,
                dummyFunctionsOffset.length,
                ...dummyFunctionsOffset,
                dummyFunctions.length / 3,
                ...dummyFunctions,
                agent.actions.length,
                ...agent.actions,
                dummyActions.length,
                ...dummyActions,
                agent.character,
                1,
            ]);
            let output = ctx.wasm.runCairoProgram(shoshinInput);
            setOutput(cairoOutputToFrameScene(output));
            console.log("New simulation output", output);
        } catch (e) {
            console.log("Got an error running wasm", e);
            setError(e);
        }
    }, [ctx, agent, adversary, combo]);

    return {
        wasmReady: ctx.wasm,
        runCairoSimulation,
        output,
        error,
    };
};

export default useRunCairoSimulation;
