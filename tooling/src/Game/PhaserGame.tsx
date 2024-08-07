/**
 * @file Game.js
 */
import * as React from 'react';
import PropTypes from 'prop-types';

import { useLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import styles from './Game.module.css';
import Simulator from '../scene/Simulator';
import RealTime from '../scene/Realtime';
import UI from '../scene/UI';
import { GameModes, PhaserGameProps } from '../types/Simulator';
import { ShoshinWASMContext } from '../context/wasm-shoshin';
import eventsCenter from './EventsCenter';
import { PHASER_CANVAS_H, PHASER_CANVAS_W } from '../constants/constants';

// Many shamefull @ts-ignore(s) in this file. It is not easy to know if game or scene is defined from outside the PhaserGame
const Game = ({
    testJson,
    animationFrame,
    showDebug,
    gameMode,
    realTimeOptions,
    isInView,
    backgroundId,
    onPhaserLoad,
    volume,
    lives,
    playerOneName,
    playerTwoName,
}: PhaserGameProps) => {
    const tagName = 'div';
    const className = 'relative top-0 left-0 w-full h-full my-12';
    const variant = 'default';

    const isRealTime = gameMode == GameModes.realtime;

    const parent = React.useRef();
    const canvas = React.useRef();
    const game = React.useRef();
    const Phaser = React.useMemo(() => {
        if (
            typeof window !== 'undefined' &&
            typeof window.navigator !== 'undefined'
        ) {
            return require('phaser');
        }
    }, []);

    const ctx = React.useContext(ShoshinWASMContext);

    // import('phaser/src/phaser').then((mod) => {
    //   if (mod && !Phaser) {
    //     setPhaser(mod.default)
    //   }
    // })

    // const preload = React.useCallback(() => {
    //     const g = game.current;
    //     //@ts-ignore
    //     const _this = g.scene.keys.default;
    //     console.log('preload ->  preloading assets...', _this);
    //     //_this.load.setBaseURL('http://labs.phaser.io');
    //     _this.load.image('sky', 'images/bg/shoshin-bg-large-transparent.png');
    // }, []);

    // const create = React.useCallback((e) => {
    //     const g = game.current;
    //     //@ts-ignore
    //     const _this = g.scene.keys.default;

    //     console.log('create -> creating elements...', _this);
    //     _this.add.image(400, 300, 'sky');

    //     var particles = _this.add.particles('red');

    //     var emitter = particles.createEmitter({
    //         speed: 100,
    //         scale: { start: 1, end: 0 },
    //         blendMode: 'ADD',
    //     });

    //     var logo = _this.physics.add.image(400, 100, 'logo');

    //     logo.setVelocity(100, 200);
    //     logo.setBounce(1, 1);
    //     logo.setCollideWorldBounds(true);

    //     emitter.startFollow(logo);
    // }, []);

    useLayoutEffect(() => {
        // let g;
        if (Phaser && parent.current && canvas.current) {
            const config = {
                type: Phaser.CANVAS,
                parent: parent.current,
                canvas: canvas.current,
                // pixelArt: true,
                height: PHASER_CANVAS_H,
                width: PHASER_CANVAS_W,
                scale: {
                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                    minWidth: '800',
                    minHeight: '450',
                    maxWidth: '1920',
                    maxHeight: '1080',
                },
                backgroundColor: '#000000',
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 200 },
                    },
                },
                scene: {},
            };
            game.current = new Phaser.Game(config);

            // Add the scenes
            const realtimeScene = (game.current as Phaser.Game).scene.add(
                'realtime',
                RealTime
            );
            const simulatorScene = (game.current as Phaser.Game).scene.add(
                'simulator',
                Simulator
            );
            const uiScene = (game.current as Phaser.Game).scene.add('ui', UI);

            // Start the scenes
            console.log(
                'PhaserGame starting scene with backgroundId',
                backgroundId
            );
            if (isRealTime) {
                console.log("running g.scene.start('realtime');");
                (game.current as Phaser.Game).scene.start('realtime', {
                    backgroundId: backgroundId,
                });
            } else {
                console.log("running g.scene.start('simulator');");
                (game.current as Phaser.Game).scene.start('simulator', {
                    backgroundId: backgroundId,
                });
            }
            console.log("running g.scene.start('ui');");
            (game.current as Phaser.Game).scene.start('ui');

            (game.current as Phaser.Game).events.on('ready', () => {
                // onPhaserLoad?.()
                let phaserLoadDelay = setTimeout(() => {
                    onPhaserLoad?.();
                }, 2500);
            });
        }

        return () => {
            (game.current as Phaser.Game).destroy(true, false);
        };
        // return () => g.destroy();
    }, [Phaser, parent, canvas]);
    // }, [Phaser, create, preload, parent, canvas]);

    const attemptToSetWasmContext = () => {
        let attemptWasmID = setInterval(() => {
            console.log('Attempting to prepare realtime scene');
            if (isRealTime && ctx) {
                // @ts-ignore
                let realtimeScene = game.current?.scene.getScene('realtime');
                console.log('real time scene ', realtimeScene);
                if (realtimeScene !== null) {
                    realtimeScene.set_wasm_context(ctx);
                    clearInterval(attemptWasmID);
                }
            }
        }, 500);
    };

    const isGameSceneDefined = (gameMode: GameModes) => {
        if (game == undefined || game.current == undefined) {
            return false;
        }
        // @ts-ignore
        let scene = game.current?.scene.getScene(gameMode);

        if (scene == null) {
            return false;
        }
        return true;
    };

    React.useEffect(() => {
        if (isRealTime && isGameSceneDefined(gameMode)) {
            // @ts-ignore
            let scene = game.current?.scene.getScene(gameMode);
            if (realTimeOptions.agentOpponent) {
                scene.set_opponent_agent(realTimeOptions.agentOpponent);
            }
            if (realTimeOptions.playerCharacter != null) {
                scene.set_player_character(realTimeOptions.playerCharacter);
            }
        }
    }, [isRealTime, realTimeOptions]);

    React.useEffect(() => {
        // @ts-ignore
        let scene = game.current?.scene.getScene(
            isRealTime ? GameModes.simulation : GameModes.realtime
        );
        if (scene !== null && scene !== undefined) {
            //setPlayerStatuses currently is not called in the phaser scene
            scene.changeScene(gameMode, ctx, realTimeOptions.setPlayerStatuses);
        }

        if (isRealTime) {
            eventsCenter.emit('timer-reset');
            eventsCenter.emit('reset-stats');
            eventsCenter.emit('end-text-hide');
        } else {
            console.log(
                'eventsCenter emission for !isRealTime in PhaserGame.tsx'
            );
            eventsCenter.emit('timer-hide');
            eventsCenter.emit('reset-stats');
            eventsCenter.emit('end-text-hide');
        }
    }, [isRealTime]);

    React.useEffect(() => {
        if (gameMode == GameModes.realtime) {
            // @ts-ignore
            let scene = game.current?.scene.getScene(
                isRealTime ? GameModes.realtime : GameModes.simulation
            );
            if (scene !== null && scene !== undefined) {
                scene.toggleInputs(isInView);
            }
        }
    }, [isInView]);

    React.useEffect(() => {
        if (isGameSceneDefined(gameMode)) {
            eventsCenter.emit('setPlayerOneName', playerOneName);
            eventsCenter.emit('setPlayerTwoName', playerTwoName);
        }
    }, [testJson, playerOneName, playerTwoName]);

    // const [lastTimeLog, setLastTimeLog] = React.useState<number>(0);
    // React.useEffect(() => {
    //     console.log('Time elapsed since last change in animationFrame:', Date.now() - lastTimeLog);
    //     setLastTimeLog((_) => Date.now());
    // }, [animationFrame])

    React.useEffect(() => {
        if (isGameSceneDefined(gameMode) && testJson) {
            // console.log('Time elapsed:', Date.now() - lastTimeLog, 'animationFrame', animationFrame);
            // setLastTimeLog((_) => Date.now());

            // @ts-ignore
            let scene = game.current?.scene.getScene('simulator') as Simulator;

            const sceneCreateCompleted = scene.getCreateCompleted();
            if (!sceneCreateCompleted) return;

            scene.updateSceneFromFrame({
                testJson,
                animationFrame,
                showDebug,
                lives,
            });
            scene.setVolume(volume);
        }

        //render stuff
    }, [testJson, animationFrame, showDebug, ctx.wasm, volume, lives]);

    return (
        <div
            style={{
                aspectRatio: '1.77',
                position: 'relative',
            }}
            ref={parent}
        >
            {Phaser ? (
                <canvas
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                    }}
                    ref={canvas}
                />
            ) : null}
        </div>
    );
};

//
Game.propTypes = {
    tagName: PropTypes.string,
    className: PropTypes.string,
    variant: PropTypes.oneOf(['default']),
    children: PropTypes.node,
};

export default Game;
