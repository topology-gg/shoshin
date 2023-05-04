import { IDLE_AGENT, InitialRealTimeFrameScene, OFFENSIVE_AGENT, characterActionToNumber } from "../constants/constants";
import { IShoshinWASMContext } from "../context/wasm-shoshin";
import useRunRealTime, {
    runRealTimeFromContext,
} from "../hooks/useRunRealtime";
import { RealTimeFrameScene } from "../types/Frame";
import Platformer from "./Simulator";

export default class RealTime extends Platformer {
    state: RealTimeFrameScene = InitialRealTimeFrameScene;

    private player_action: number = 5;
    private character_type_0: number = 0;
    private character_type_1: number = 1;

    private wasmContext?: IShoshinWASMContext;

    private startText : Phaser.GameObjects.Text;

    private isGameRunning : boolean;

    private gameTimer : Phaser.Time.TimerEvent;

    private keyboard : any;

    private lastPressedKey : Phaser.Input.Keyboard.Key
    
    is_wasm_undefined() {
        return this.wasmContext == undefined;
    }

    set_wasm_context(ctx: IShoshinWASMContext) {
        console.log("initialize wasm context", ctx);
        this.wasmContext = ctx;
    }

    create() {
        this.intitialize();
        this.startText = this.add.text(0, 0, 'Press Space key to begin',{ color: '#000',});
        this.isGameRunning = false

        this.keyboard = this.input.keyboard.addKeys({
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            d : Phaser.Input.Keyboard.KeyCodes.D,
            s : Phaser.Input.Keyboard.KeyCodes.S,
            w : Phaser.Input.Keyboard.KeyCodes.W,
            e : Phaser.Input.Keyboard.KeyCodes.E,
            space : Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        console.log("keyboard", this.keyboard)
        
        this.setPlayerOneCharacter(this.character_type_0)
        this.setPlayerTwoCharacter(this.character_type_1)
    }


    

    startMatch(){

        this.setPlayerOneCharacter(this.character_type_0)
        this.setPlayerTwoCharacter(this.character_type_1)

        //this.run()
        
        this.gameTimer = this.time.addEvent({
            delay: 10,                // ms
            callback: () => (this.run()),
            //args: [],
            //callbackScope: thisArg,
            repeat: 120
        });
        
        this.isGameRunning = true
        this.startText.setVisible(false)


    }

    // Call when match is over to transition to menu state
    endMatch(){
        this.startText.setVisible(true)
        this.isGameRunning = false;
}


    update(t, ds) {
        
        if(this.gameTimer?.getRemaining() == 0){
            this.endMatch()
        }
        if(this.keyboard.space.isDown && !this.isGameRunning){
            this.startMatch()
        }
        if(this.isGameRunning)
        {
            if(this.keyboard.down.isDown){
                //block
                this.player_action = characterActionToNumber[this.character_type_0 == 1? 'antoc' : 'jessica']["Block"]
                
            } else if(this.keyboard.left.isDown){
                // move left
                this.player_action = characterActionToNumber[this.character_type_0 == 1? 'antoc' : 'jessica']["MoveBackward"]
            } else if(this.keyboard.right.isDown){
                // move right
                this.player_action = characterActionToNumber[this.character_type_0 == 1? 'antoc' : 'jessica']["MoveForward"]
            } else if(this.keyboard.s.isDown){
                //attack # 1
                this.player_action = characterActionToNumber[this.character_type_0 == 1? 'antoc' : 'jessica'][this.character_type_0 == 1? 'Hori' : 'Slash']
            } else if(this.keyboard.d.isDown){

                console.log(this.character_type_0 == 1? 'antoc' : 'jessica')
                console.log(characterActionToNumber['jessica'])
                //attack # 2
                this.player_action = characterActionToNumber[this.character_type_0 == 1? 'antoc' : 'jessica'][this.character_type_0 == 1? 'Vert' : 'Upswing']

            } else if(this.keyboard.w.isDown){
                // dash back
                this.player_action = characterActionToNumber[this.character_type_0 == 1? 'antoc' : 'jessica']["DashBackward"]
            } if(this.keyboard.e.isDown){
                // dash forward
                this.player_action = characterActionToNumber[this.character_type_0 == 1? 'antoc' : 'jessica']["Forward"]
            }
        }

    }

    
    run(){

        console.log(this.wasmContext)
        if (!this.wasmContext) {
            console.log("no wasm context")
            return;
        }

        console.log("input state", this.state)
        console.log("player action", this.player_action)
        let [out, err] = runRealTimeFromContext(
            this.wasmContext,
            this.state,
            this.player_action,
            this.character_type_0,
            this.character_type_1,
            OFFENSIVE_AGENT
        );
        console.log("output state", out);
        let newState: RealTimeFrameScene = out as RealTimeFrameScene;


        this.player_action = 0;
        if(newState){
            this.state = newState;
            this.setPlayerOneFrame(newState.agent_0);
            this.setPlayerTwoFrame(newState.agent_1);
        }
        

    }
}
