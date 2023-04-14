import { useCallback, useContext } from "react";
import { ConditionWASMContext } from "../context/wasm-condition";
import cairoOutputToFrameScene from "../helpers/cairoOutputToFrameScene";
import { Condition } from "../types/Condition";
import { parseConditionToLeaf } from "../types/Condition";
import Leaf, { flattenLeaf } from "../types/Leaf";
import { getEvaluateConditionInput } from "../helpers/cairoEvaluateConditionHelpers";

/**
 * Hook to run the condition evaluation given a condition
 */
const useEvaluateCondition = () => {
    const ctx = useContext(ConditionWASMContext);

    const runEvaluateCondition = useCallback(
        (condition: Leaf, perceptibles: number[]) => {
        if (!ctx.wasm) {
            console.warn("WASM not initialized");
            return;
        }
        try {
            let evaluateConditionInput: Int32Array = getEvaluateConditionInput(condition, perceptibles);
            let output = ctx.wasm.evaluateCondition(evaluateConditionInput)
            return [output.evaluation, null];
        } catch (e) {
            console.log("Got an error running wasm", e);
            return [null, e]
        }
    }, [ctx]);

    return {
        wasmReady: ctx.wasm,
        runEvaluateCondition,
    };
};

export default useEvaluateCondition;
