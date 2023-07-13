import { StatusBarPanelProps } from '../components/StatusBar';
import {
    IDLE_AGENT,
    InitialRealTimeFrameScene,
    OFFENSIVE_AGENT,
    TICK_IN_SECONDS,
    characterActionToNumber,
    LEFT,
    RIGHT,
    bodyStateNumberToName,
    characterTypeToString,
} from '../constants/constants';
import { IShoshinWASMContext } from '../context/wasm-shoshin';
import { runRealTimeFromContext } from '../hooks/useRunRealtime';
import Agent from '../types/Agent';
import { RealTimeFrameScene } from '../types/Frame';
import { GameModes } from '../types/Simulator';
import Simulator from './Simulator';
import eventsCenter from '../Game/EventsCenter';

import * as wasm from '../../wasm/shoshin/pkg/shoshin';

export default class RealTime extends Simulator {
    prevState: RealTimeFrameScene = InitialRealTimeFrameScene;
    state: RealTimeFrameScene = InitialRealTimeFrameScene;

    private player_action: number = 5;
    private character_type_0: number = 0;

    private wasmContext?: IShoshinWASMContext = { wasm };

    startText: Phaser.GameObjects.Text;
    endTextP1Won: Phaser.GameObjects.Text;
    endTextP2Won: Phaser.GameObjects.Text;
    endTextDraw: Phaser.GameObjects.Text;

    private isGameRunning: boolean;
    private isGamePaused: boolean;
    private inPauseMenu: boolean = false;

    private gameTimer: Phaser.Time.TimerEvent;
    private hitstopTimer: Phaser.Time.TimerEvent;
    private repeatCountLeft: number;

    private keyboard: any;

    private opponent: Agent = IDLE_AGENT;

    private isDebug: boolean = false;

    private isFirstTick: boolean = true;

    private tick: number = 0;

    private debugToggleLocked: boolean = false;
    private spaceLocked: boolean = false;

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
        this.spaceLocked = false;
        this.repeatCountLeft = -1;
    }

    set_wasm_context(ctx: IShoshinWASMContext) {
        console.log('initialize wasm context', ctx);
        this.wasmContext = ctx;
    }

    set_opponent_agent(agent: Agent) {
        this.opponent = agent;
        this.setPlayerTwoCharacter(agent.character);

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
        this.initialize();
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
            esc: Phaser.Input.Keyboard.KeyCodes.ESC,
        });
        this.set_player_character(this.character_type_0);
        this.scene.scene.events.on('pause', () => {
            this.toggleInputs(false);
        });

        eventsCenter.emit('timer-reset');
    }

    startMatch() {
        if (!this.wasmContext || this.is_wasm_undefined()) {
            console.log('no wasm context');
            return;
        }
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

    pauseGame() {
        eventsCenter.emit('end-text-show', 'Paused', '');

        // pause the game by saving the remaining time and destroy the timer
        this.repeatCountLeft = this.gameTimer.repeatCount;
        console.log('repeatCountLeft', this.repeatCountLeft);
        this.gameTimer.destroy();
        this.isGamePaused = true;
        console.log('game paused');
    }

    resumeGame() {
        // resume the game by creating the timer with `repeatCountLeft`
        this.gameTimer = this.time.addEvent({
            delay: this.tickLatencyInSecond * 1000, // ms
            callback: () => this.run(),
            repeat: this.repeatCountLeft,
        });
        this.isGamePaused = false;
        console.log('game resumed');
        eventsCenter.emit('end-text-hide');
    }
    update(t, ds) {
        const spaceIsDown = this.keyboard.space.isDown;
        const escIsDown = this.keyboard.esc.isDown;

        if (escIsDown && !this.spaceLocked) {
            if (this.isGameRunning) {
                this.pauseGame();
            }
            this.inPauseMenu = !this.inPauseMenu;
            this.spaceLocked = true;
        }

        if (spaceIsDown && !this.inPauseMenu && !this.spaceLocked) {
            if (!this.isGameRunning && spaceIsDown && !this.inPauseMenu) {
                this.startMatch();
            } else {
                if (!this.spaceLocked) {
                    if (this.isGamePaused) {
                        this.resumeGame();
                    } else {
                        this.pauseGame();
                    }
                }
            }
            // debounce lock
            this.spaceLocked = true;
        }
        if (this.keyboard.space.isUp && this.keyboard.esc.isUp) {
            // debounce release
            this.spaceLocked = false;
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

    timestamp = new Date();
    run() {
        console.log('this wasm context', this.wasmContext);
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

            // Handle hit-stop
            // 1. check newState if any of the character is in counter==1 of HURT / KNOCKED / LAUNCH / CLASHED
            // 2. if so, kill gameTimer after recording its repeatCount; start hitstopTimer, whose callBack is self destruction + restart gameTimer with remaining repeatCount
            // 3. for the duration of hitstopTimer, also stop vfx animation via https://phaser.discourse.group/t/how-to-slow-down-the-frame-rate-animations-globally-slow-motion/11339/3
            const p1_state: string =
                bodyStateNumberToName[
                    characterTypeToString[this.character_type_0]
                ][newState.agent_0.body_state.state];
            const p2_state: string =
                bodyStateNumberToName[
                    characterTypeToString[this.opponent.character]
                ][newState.agent_1.body_state.state];
            const hitstop_strings = ['hurt', 'knocked', 'launched', 'clash'];
            const p1_needs_hitstop =
                hitstop_strings.some(function (s) {
                    return p1_state.indexOf(s) >= 0;
                }) && newState.agent_0.body_state.counter == 1;
            const p2_needs_hitstop =
                hitstop_strings.some(function (s) {
                    return p2_state.indexOf(s) >= 0;
                }) && newState.agent_1.body_state.counter == 1;
            if (p1_needs_hitstop || p2_needs_hitstop) {
                console.log('should hitstop!');

                // Kill gameTimer
                this.repeatCountLeft = this.gameTimer.repeatCount;
                this.gameTimer.destroy();

                // Stops vfx
                this.anims.pauseAll();

                // Start hitstopTimer, whose callback is self destruction + restart gameTimer with remaining repeatCount
                this.hitstopTimer = this.time.addEvent({
                    delay: 100, // ms
                    callback: () => {
                        console.log('resume from hitstop!');
                        this.gameTimer = this.time.addEvent({
                            delay: this.tickLatencyInSecond * 1000, // ms
                            callback: () => this.run(),
                            repeat: this.repeatCountLeft,
                        });
                        this.hitstopTimer.destroy();
                        this.anims.resumeAll();
                    },
                    repeat: 0, // hitstopTimer plays only once before self destruction
                });
            }

            // Emit event for UI scene
            const timeLeftDecimalString = (
                this.gameTimer.repeatCount * this.tickLatencyInSecond
            )
                .toFixed(1)
                .toString();
            const timeLeftSplit = timeLeftDecimalString.split('.');
            eventsCenter.emit(
                'timer-change',
                timeLeftSplit[0],
                timeLeftSplit[1]
            );

            // Set stats
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
