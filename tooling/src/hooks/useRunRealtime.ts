import { useCallback, useContext } from "react";
import {
    IShoshinWASMContext,
    ShoshinWASMContext,
} from "../context/wasm-shoshin";
import Agent, {
    agentToArray,
    agentsToArray,
    flattenAgent,
} from "../types/Agent";
import { RealTimeFrameScene, realTimeInputToArray } from "../types/Frame";
import { encodeStringToFelt } from "../types/utils";
import cairoOutputToRealTimeFrameScene from "../helpers/cairoOutputToRealTimeFrameScene";

const realTimeAgentToArray = (agent: Agent, current_combo : number, combo_counter : number, currentMentalState : number) => {
    let [
        combosOffset,
        combos,
        mentalStatesOffset,
        mentalStates,
        conditionsOffset,
        conditions,
    ] = flattenAgent(agent);

    return [
        combosOffset.length,
        ...combosOffset,
        combos.length,
        ...combos,
        current_combo,
        combo_counter,
        mentalStatesOffset.length,
        ...mentalStatesOffset,
        mentalStates.length / 3,
        ...mentalStates,
        currentMentalState,
        conditionsOffset.length,
        ...conditionsOffset,
        conditions.length / 3,
        ...conditions,
        agent.actions.length,
        ...agent.actions,
    ];
};
/**
 * Hook to run the Cairo simulation using provided p1 and p2 agents
 */
const useRunRealTime = (
    realTimeFrameScene: RealTimeFrameScene,
    player_action: number,
    character_type_0: number,
    character_type_1: number,
    opponent: Agent,
    isFirstTick : boolean
) => {
    const ctx = useContext(ShoshinWASMContext);
    const runRealTime = useCallback(() => {
        return runRealTimeFromContext(
            ctx,
            realTimeFrameScene,
            player_action,
            character_type_0,
            character_type_1,
            opponent,
            isFirstTick
        );
    }, [ctx, realTimeFrameScene]);

    return {
        wasmReady: ctx.wasm,
        runRealTime,
    };
};

export const runRealTimeFromContext = (
    ctx: IShoshinWASMContext,
    realTimeFrameScene: RealTimeFrameScene,
    player_action: number,
    character_type_0: number,
    character_type_1: number,
    opponent: Agent,
    isFirstTick : boolean
) => {
    if (!ctx.wasm) {
        console.warn("WASM not initialized");
        return;
    }
    try {
        let {current_combo, combo_counter} = realTimeFrameScene.agent_1.combo_info
        let currentMentalState = isFirstTick ? opponent.initialState : realTimeFrameScene.agent_1.mental_state
        console.log('current combo in ', current_combo)
        console.log('combo counter in ', combo_counter)
        let shoshinInput = new Int32Array([
            ...realTimeInputToArray(
                realTimeFrameScene,
                player_action,
                character_type_0,
                character_type_1
            ),
            ...realTimeAgentToArray(opponent, current_combo, combo_counter, currentMentalState),
        ]);
        let output = ctx.wasm.simulateRealtimeFrame(shoshinInput);
        return [cairoOutputToRealTimeFrameScene(output), null];
    } catch (e) {
        console.log("Got an error running wasm", e);
        return [null, e];
    }
};

export default useRunRealTime;
