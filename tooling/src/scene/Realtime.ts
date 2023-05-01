import { IShoshinWASMContext } from "../context/wasm-shoshin";
import useRunRealTime, {
    runRealTimeFromContext,
} from "../hooks/useRunRealtime";
import { RealTimeFrameScene } from "../types/Frame";
import Platformer from "./Simulator";

export default class RealTime extends Platformer {
    state: RealTimeFrameScene;

    private player_action: number = 0;
    private character_type_0: number = 0;
    private character_type_1: number = 0;

    private wasmContext?: IShoshinWASMContext;

    is_wasm_undefined(){
        return this.wasmContext == undefined
    }

    set_wasm_context(ctx : IShoshinWASMContext){
        console.log("initialize wasm context")
        this.wasmContext = ctx
    }

    create() {
        this.intitialize();
    }

    update(t, ds) {
        
        if(!this.wasmContext){
            return
        }  
        let [out, err] = runRealTimeFromContext(
            this.wasmContext,
            this.state,
            this.player_action,
            this.character_type_0,
            this.character_type_1
        );

        let newState: RealTimeFrameScene = out[0] as RealTimeFrameScene;
        this.state = newState;

        this.setPlayerOneFrame(newState.agent_0);
        this.setPlayerTwoFrame(newState.agent_1);

  
    }
}
