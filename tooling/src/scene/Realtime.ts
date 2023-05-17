import { StatusBarPanelProps } from "../components/StatusBar";
import {
    IDLE_AGENT,
    InitialRealTimeFrameScene,
    OFFENSIVE_AGENT,
    characterActionToNumber,
} from "../constants/constants";
import { IShoshinWASMContext } from "../context/wasm-shoshin";
import { runRealTimeFromContext } from "../hooks/useRunRealtime";
import Agent from "../types/Agent";
import { RealTimeFrameScene } from "../types/Frame";
import { GameModes } from "../types/Simulator";
import Platformer from "./Simulator";

export default class RealTime extends Platformer {
    state: RealTimeFrameScene = InitialRealTimeFrameScene;

    private player_action: number = 5;
    private character_type_0: number = 0;

    private wasmContext?: IShoshinWASMContext;

    private startText: Phaser.GameObjects.Text;
    private endText : Phaser.GameObjects.Text;

    private isGameRunning: boolean;

    private gameTimer: Phaser.Time.TimerEvent;

    private keyboard: any;

    private opponent: Agent = IDLE_AGENT;

    private isDebug : boolean = false;

    private isFirstTick : boolean = true;

    private setPlayerStatuses: (playerStatuses: StatusBarPanelProps) => void =
        () => {};

    is_wasm_undefined() {
        return this.wasmContext == undefined;
    }

    resetGameState() {
        this.state = InitialRealTimeFrameScene;
        this.isFirstTick = true;
    }

    set_wasm_context(ctx: IShoshinWASMContext) {
        console.log("initialize wasm context", ctx);
        this.wasmContext = ctx;
    }

    set_opponent_agent(agent: Agent) {
        this.opponent = agent;
        this.setPlayerTwoCharacter(agent.character);

        console.log('opponent', this.opponent)
        if(!this.isGameRunning)
        {
            this.setMenuText();   
            this.resetGameState();
        }        
    }

    set_player_character(charId: number) {
        this.character_type_0 = charId;
        if(!this.isGameRunning)
        {   
            this.setMenuText();   
            this.resetGameState();
        }      
    }
    

    init(data: any) {
        if (data !== undefined) {
            this.wasmContext = data.context;
            this.setPlayerStatuses = data.setPlayerStatuses;
        }
    }

    createCenteredText(content: string) {
        const centeredText = this.add
            .text(this.cameras.main.midPoint.x,
                this.cameras.main.midPoint.y, 
                content, {
                color : "#000",
                backgroundColor: "#FFF"
            })

        return centeredText
    }

    setMenuText(){
        let playerOne = this.character_type_0 == 0 ? "Jessica" : "Antoc"
        let playerTwo = this.opponent.character == 0 ? "Jessica" : "Antoc"

        if(this.startText !== null)
        {   
            console.log(this.startText)
            this.startText?.setText(`Player One ${playerOne} \n Player Two ${playerTwo} \nPress Space key to play`)
        }
        
    }
    createMenu(){
        let playerOne = this.character_type_0 == 0 ? "Jessica" : "Antoc"
        let playerTwo = this.opponent.character == 0 ? "Jessica" : "Antoc"

        this.startText = this.createCenteredText(`Player One ${playerOne} \n Player Two ${playerTwo} \nPress Space key to play`)
        this.initializeCameraSettings()
    }

    centerText(text : Phaser.GameObjects.Text)
    {
        text.setPosition(
            this.cameras.main.midPoint.x,
            this.cameras.main.midPoint.y
        )
    }
    create() {
        this.intitialize();
        this.createMenu()

        this.isGameRunning = false;

        this.keyboard = this.input.keyboard.addKeys({
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            e: Phaser.Input.Keyboard.KeyCodes.E,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            h: Phaser.Input.Keyboard.KeyCodes.H,
            f: Phaser.Input.Keyboard.KeyCodes.F,
        });
        this.setPlayerOneCharacter(this.character_type_0);
    }

    startMatch() {
        this.setPlayerOneCharacter(this.character_type_0);
        this.resetGameState()

        this.gameTimer = this.time.addEvent({
            delay: 100, // ms
            callback: () => this.run(),
            //args: [],
            //callbackScope: thisArg,
            //Match is 20 minutes tops
            repeat: 12000,
        });

        this.isGameRunning = true;
        this.startText.setVisible(false);
    }

    endGame() { 
        this.centerText(this.startText)
        this.startText.setVisible(true)
        this.gameTimer.destroy();
        this.isGameRunning = false;
    }

    toggleInputs(enable : boolean){
        if(enable)
        {
            this.input.keyboard.enableGlobalCapture()
        }else{
            this.input.keyboard.disableGlobalCapture()
        }
    }

    update(t, ds) {
        if (this.keyboard.space.isDown && !this.isGameRunning) {
            this.startMatch();
        }
        if (this.isGameRunning) {
            if (this.keyboard.down.isDown) {
                //block
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? "antoc" : "jessica"
                    ]["Block"];
            } else if (this.keyboard.left.isDown) {
                // move left
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? "antoc" : "jessica"
                    ]["MoveBackward"];
            } else if (this.keyboard.right.isDown) {
                // move right
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? "antoc" : "jessica"
                    ]["MoveForward"];
            } else if (this.keyboard.s.isDown) {
                //attack # 1
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? "antoc" : "jessica"
                    ][this.character_type_0 == 1 ? "Hori" : "Slash"];
            } else if (this.keyboard.d.isDown) {
                //attack # 2
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? "antoc" : "jessica"
                    ][this.character_type_0 == 1 ? "Vert" : "Upswing"];
            } else if (this.keyboard.w.isDown) {
                // dash back
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? "antoc" : "jessica"
                    ]["DashBackward"];
            } else if (this.keyboard.e.isDown) {
                // dash forward
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? "antoc" : "jessica"
                    ]["DashForward"];
            } else if (this.keyboard.f.isDown && this.character_type_0 == 0) {
                // attack # 3
                this.player_action =
                    characterActionToNumber[
                        "jessica"
                    ]["Sidecut"];
            }
        } 
        if (this.keyboard.h.isDown) {
                this.isDebug = !this.isDebug
        }
    }

    run() {
        if (!this.wasmContext) {
            console.log("no wasm context");
            return;
        }

        let [out, err] = runRealTimeFromContext(
            this.wasmContext,
            this.state,
            this.player_action,
            this.character_type_0,
            this.opponent.character,
            this.opponent,
            this.isFirstTick
        );

        this.isFirstTick = false
        let newState: RealTimeFrameScene = out as RealTimeFrameScene;

        this.player_action = 0;
        if (newState) {
            this.state = newState;
            this.updateScene(
                this.character_type_0,
                this.opponent.character,
                newState.agent_0,
                newState.agent_1,
                false,
                this.isDebug
            );

            const integrity_0 = newState.agent_0.body_state.integrity;
            const integrity_1 = newState.agent_1.body_state.integrity;
            const stamina_0 = newState.agent_0.body_state.stamina;
            const stamina_1 = newState.agent_1.body_state.stamina;

            this.setPlayerStatuses({
                integrity_0,
                integrity_1,
                stamina_0,
                stamina_1,
            });

            if (this.gameTimer?.getRemaining() == 0 && this.isGameRunning) {
                if (integrity_0 <= integrity_1) {
                    //this.endGame(1);
                } else {
                    //this.endGame(2);
                }
            }
            if (integrity_0 <= 0) {
                this.endGame();
            } else if (integrity_1 <= 0) {
                this.endGame();
            }
        }


    }
}
