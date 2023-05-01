import { useCallback, useContext } from "react";
import { IShoshinWASMContext, ShoshinWASMContext } from "../context/wasm-shoshin";
import cairoOutputToFrameScene from "../helpers/cairoOutputToFrameScene";
import Agent, { agentsToArray } from "../types/Agent";
import { RealTimeFrameScene, realTimeInputToArray } from "../types/Frame";

/**
 * Hook to run the Cairo simulation using provided p1 and p2 agents
 */
const useRunRealTime = (
    realTimeFrameScene: RealTimeFrameScene,
    player_action : number, character_type_0: number, character_type_1 : number
) => {
    const ctx = useContext(ShoshinWASMContext);
    
    const runRealTime = useCallback(() => {
        if (!ctx.wasm) {
            console.warn("WASM not initialized");
            return;
        }
        try {
            let shoshinInput = new Int32Array(realTimeInputToArray(realTimeFrameScene,  player_action, character_type_0, character_type_1))
            let output = ctx.wasm.simulateRealtimeFrame(shoshinInput);
            return [cairoOutputToFrameScene(output), null];
        } catch (e) {
            console.log("Got an error running wasm", e);
            return [null, e]
        }
    }, [ctx, realTimeFrameScene]);

    return {
        wasmReady: ctx.wasm,
        runRealTime,
    };
};


export const runRealTimeFromContext = (ctx : IShoshinWASMContext, realTimeFrameScene: RealTimeFrameScene,
    player_action : number, character_type_0: number, character_type_1 : number
) => {
        if (!ctx.wasm) {
            console.warn("WASM not initialized");
            return;
        }
        try {
            let shoshinInput = new Int32Array(realTimeInputToArray(realTimeFrameScene,  player_action, character_type_0, character_type_1))
            let output = ctx.wasm.simulateRealtimeFrame(shoshinInput);
            return [cairoOutputToFrameScene(output), null];
        } catch (e) {
            console.log("Got an error running wasm", e);
            return [null, e]
        }
    
}


export default useRunRealTime;
