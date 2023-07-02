import { StatusBarPanelProps } from '../components/StatusBar';
import {
    IDLE_AGENT,
    InitialRealTimeFrameScene,
    OFFENSIVE_AGENT,
    TICK_IN_SECONDS,
    characterActionToNumber,
    LEFT,
    RIGHT,
} from '../constants/constants';
import { IShoshinWASMContext } from '../context/wasm-shoshin';
import { runRealTimeFromContext } from '../hooks/useRunRealtime';
import Agent from '../types/Agent';
import { RealTimeFrameScene } from '../types/Frame';
import { GameModes } from '../types/Simulator';
import Platformer from './Simulator';
import eventsCenter from '../Game/EventsCenter';

export default class RealTime extends Platformer {
    prevState: RealTimeFrameScene = InitialRealTimeFrameScene;
    state: RealTimeFrameScene = InitialRealTimeFrameScene;

    private player_action: number = 5;
    private character_type_0: number = 0;

    private wasmContext?: IShoshinWASMContext;

    startText: Phaser.GameObjects.Text;
    endTextP1Won: Phaser.GameObjects.Text;
    endTextP2Won: Phaser.GameObjects.Text;
    endTextDraw: Phaser.GameObjects.Text;

    private isGameRunning: boolean;

    private gameTimer: Phaser.Time.TimerEvent;

    private keyboard: any;

    private opponent: Agent = IDLE_AGENT;

    private isDebug: boolean = false;

    private isFirstTick: boolean = true;

    private tick: number = 0;

    private debugToggleLocked: boolean = false;

    private tickLatencyInSecond = TICK_IN_SECONDS;

    private setPlayerStatuses: (playerStatuses: StatusBarPanelProps) => void =
        () => {};

    is_wasm_undefined() {
        return this.wasmContext == undefined;
    }

    resetGameState() {
        this.state = InitialRealTimeFrameScene;
        this.isFirstTick = true;
        this.tick = 0;
        this.debugToggleLocked = false;
    }

    set_wasm_context(ctx: IShoshinWASMContext) {
        console.log('initialize wasm context', ctx);
        this.wasmContext = ctx;
    }

    set_opponent_agent(agent: Agent) {
        this.opponent = agent;
        this.setPlayerTwoCharacter(agent.character);

        console.log('opponent', this.opponent);
        if (!this.isGameRunning) {
            this.setMenuText();
            this.resetGameState();
        }
    }

    set_player_character(charId: number) {
        this.character_type_0 = charId;
        if (!this.isGameRunning) {
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
            .text(
                this.cameras.main.midPoint.x,
                this.cameras.main.midPoint.y - 10,
                content,
                {
                    color: '#000',
                    backgroundColor: '#FFF',
                }
            )
            .setOrigin(0.5);

        return centeredText;
    }

    setMenuText() {
        // let playerOne = this.character_type_0 == 0 ? "Jessica" : "Antoc"
        // let playerTwo = this.opponent.character == 0 ? "Jessica" : "Antoc"

        if (this.startText !== null) {
            console.log(this.startText);
            this.startText?.setText('Press Space to play');
        }
    }
    createMenu() {
        // let playerOne = this.character_type_0 == 0 ? "Jessica" : "Antoc"
        // let playerTwo = this.opponent.character == 0 ? "Jessica" : "Antoc"

        this.startText = this.createCenteredText('Press Space to start');

        this.initializeCameraSettings();
    }

    centerText(text: Phaser.GameObjects.Text) {
        text.setPosition(
            this.cameras.main.midPoint.x,
            this.cameras.main.midPoint.y - 10
        );
    }
    create() {
        this.intitialize();
        this.createMenu();

        this.isGameRunning = false;

        this.keyboard = this.input.keyboard.addKeys({
            // down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            // left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            // right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            q: Phaser.Input.Keyboard.KeyCodes.Q,
            e: Phaser.Input.Keyboard.KeyCodes.E,
            j: Phaser.Input.Keyboard.KeyCodes.J,
            k: Phaser.Input.Keyboard.KeyCodes.K,
            l: Phaser.Input.Keyboard.KeyCodes.L,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            period: Phaser.Input.Keyboard.KeyCodes.PERIOD,
            f: Phaser.Input.Keyboard.KeyCodes.F,
            n: Phaser.Input.Keyboard.KeyCodes.N,
            z: Phaser.Input.Keyboard.KeyCodes.Z,
            u: Phaser.Input.Keyboard.KeyCodes.U,
        });
        this.set_player_character(this.character_type_0);
        this.scene.scene.events.on('pause', () => {
            this.toggleInputs(false);
        });

        eventsCenter.emit('timer-reset');
    }

    startMatch() {
        this.set_player_character(this.character_type_0);
        this.resetGameState();

        this.gameTimer = this.time.addEvent({
            delay: this.tickLatencyInSecond * 1000, // ms
            callback: () => this.run(),
            //args: [],
            //callbackScope: thisArg,
            //Match is 60 seconds tops
            repeat: 60 / this.tickLatencyInSecond,
        });

        this.isGameRunning = true;
        this.startText.setVisible(false);
    }

    checkEndGame(integrityP1: number, integrityP2: number) {
        if (integrityP1 < integrityP2) {
            eventsCenter.emit(
                'end-text-show',
                'Player 2 won!',
                'Press Space to restart'
            );
        } else if (integrityP1 > integrityP2) {
            eventsCenter.emit(
                'end-text-show',
                'Player 1 won!',
                'Press Space to restart'
            );
        } else {
            eventsCenter.emit(
                'end-text-show',
                'Draw!',
                'Press Space to restart'
            );
        }

        this.gameTimer.destroy();
        this.isGameRunning = false;
    }

    toggleInputs(enable: boolean) {
        if (enable) {
            this.input.keyboard.enableGlobalCapture();
        } else {
            this.input.keyboard.disableGlobalCapture();
        }
    }

    update(t, ds) {
        if (this.keyboard.space.isDown && !this.isGameRunning) {
            this.startMatch();
        }
        if (this.isGameRunning) {
            if (this.keyboard.s.isDown) {
                //block
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? 'antoc' : 'jessica'
                    ]['Block'];
            } else if (this.keyboard.a.isDown) {
                // move left
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? 'antoc' : 'jessica'
                    ][
                        this.state.agent_0.body_state.dir == RIGHT
                            ? 'MoveBackward'
                            : 'MoveForward'
                    ];
            } else if (this.keyboard.d.isDown) {
                // move right
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? 'antoc' : 'jessica'
                    ][
                        this.state.agent_0.body_state.dir == RIGHT
                            ? 'MoveForward'
                            : 'MoveBackward'
                    ];
            } else if (this.keyboard.j.isDown) {
                //attack # 1
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? 'antoc' : 'jessica'
                    ][this.character_type_0 == 1 ? 'Hori' : 'Slash'];
            } else if (this.keyboard.k.isDown) {
                //attack # 2
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? 'antoc' : 'jessica'
                    ][this.character_type_0 == 1 ? 'Vert' : 'Upswing'];
            } else if (this.keyboard.q.isDown) {
                // dash left
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? 'antoc' : 'jessica'
                    ][
                        this.state.agent_0.body_state.dir == RIGHT
                            ? 'DashBackward'
                            : 'DashForward'
                    ];
            } else if (this.keyboard.e.isDown) {
                // dash right
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? 'antoc' : 'jessica'
                    ][
                        this.state.agent_0.body_state.dir == RIGHT
                            ? 'DashForward'
                            : 'DashBackward'
                    ];
            } else if (this.keyboard.l.isDown && this.character_type_0 == 0) {
                // jessica's attack # 3
                this.player_action =
                    characterActionToNumber['jessica']['Sidecut'];
            } else if (this.keyboard.w.isDown) {
                // jump
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? 'antoc' : 'jessica'
                    ]['Jump'];
            } else if (this.keyboard.f.isDown && this.character_type_0 == 1) {
                // antoc's step forward
                this.player_action =
                    characterActionToNumber['antoc']['StepForward'];
            } else if (this.keyboard.n.isDown && this.character_type_0 == 0) {
                // jessica's gatotsu
                this.player_action =
                    characterActionToNumber['jessica']['Gatotsu'];
            } else if (this.keyboard.u.isDown) {
                // low_kick
                this.player_action =
                    characterActionToNumber[
                        this.character_type_0 == 1 ? 'antoc' : 'jessica'
                    ]['LowKick'];
            }
        }

        if (this.keyboard.period.isDown) {
            if (!this.debugToggleLocked) {
                this.isDebug = !this.isDebug;

                // debounce
                this.debugToggleLocked = true;
            }
        }
        if (this.keyboard.period.isUp) {
            // debounce
            this.debugToggleLocked = false;
        }
    }

    run() {
        if (!this.wasmContext) {
            console.log('no wasm context');
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

        this.isFirstTick = false;
        this.tick += 1;
        let newState: RealTimeFrameScene = out as RealTimeFrameScene;

        this.player_action = 0;
        if (newState) {
            this.prevState = this.state;
            this.state = newState;
            this.updateScene(
                this.character_type_0,
                this.opponent.character,
                this.prevState.agent_0,
                this.prevState.agent_1,
                newState.agent_0,
                newState.agent_1,
                false,
                this.isDebug
            );

            const integrity_0 = newState.agent_0.body_state.integrity;
            const integrity_1 = newState.agent_1.body_state.integrity;
            const stamina_0 = newState.agent_0.body_state.stamina;
            const stamina_1 = newState.agent_1.body_state.stamina;

            // emit event for UI scene
            eventsCenter.emit(
                'timer-change',
                Math.round(
                    this.gameTimer.repeatCount * this.tickLatencyInSecond
                )
            );

            this.setPlayerStatuses({
                integrity_0,
                integrity_1,
                stamina_0,
                stamina_1,
            });
            if (
                Math.floor(this.gameTimer.repeatCount) == 0 &&
                this.isGameRunning
            ) {
                this.checkEndGame(integrity_0, integrity_1);
            }

            if (integrity_0 <= 0 || integrity_1 <= 0) {
                this.checkEndGame(integrity_0, integrity_1);
            }
        }
    }
}
