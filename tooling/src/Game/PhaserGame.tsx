/**
 * @file Game.js
 */
import * as React from "react";
import PropTypes from "prop-types";

import { useLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import styles from "./Game.module.css";
import { TestJson } from "../types/Frame";
import Simulator from "../scene/Simulator";
import { SimulatorProps } from "../types/Simulator";


const Game = ({testJson, animationFrame, showDebug}: SimulatorProps) => {
    const tagName = "div";
    const className = "relative top-0 left-0 w-full h-full my-12";
    const variant = "default";

    const parent = React.useRef();
    const canvas = React.useRef();
    const game = React.useRef();
    const Phaser = React.useMemo(() => {
        if (
            typeof window !== "undefined" &&
            typeof window.navigator !== "undefined"
        ) {
            return require("phaser");
        }
    }, []);

    // import('phaser/src/phaser').then((mod) => {
    //   if (mod && !Phaser) {
    //     setPhaser(mod.default)
    //   }
    // })

    const preload = React.useCallback(() => {
        const g = game.current;
        //@ts-ignore
        const _this = g.scene.keys.default;
        console.log("preload ->  preloading assets...", _this);
        //_this.load.setBaseURL('http://labs.phaser.io');
        _this.load.image("sky", "images/bg/shoshin-bg-large-transparent.png");
    }, []);


    const create = React.useCallback((e) => {
        const g = game.current;
        //@ts-ignore
        const _this = g.scene.keys.default;

        console.log("create -> creating elements...", _this);
        _this.add.image(400, 300, "sky");

        var particles = _this.add.particles("red");

        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: "ADD",
        });

        var logo = _this.physics.add.image(400, 100, "logo");

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        emitter.startFollow(logo);
    }, []);

    useLayoutEffect(() => {
        let g;
        if (Phaser && parent.current && canvas.current) {
            const config = {
                type: Phaser.CANVAS,
                parent: parent.current,
                canvas: canvas.current,
                width: 800,
                height: 400,
                // pixelArt: true,
                autoCenter: true,
                backgroundColor: "#000000",
                physics: {
                    default: "arcade",
                    arcade: {
                        gravity: { y: 200 },
                    },
                },
                scene: {
                },
            };
            g = game.current = new Phaser.Game(config);

            g.scene.add('simulator', Simulator)
            g.scene.start('simulator')
        }
        return () => g.destroy();
    }, [Phaser, create, preload, parent, canvas]);



    React.useEffect(() => {
        //get current scene

        if(game == undefined || game.current == undefined)
        {
          return
        }


        //@ts-ignore
        let scene = game.current?.scene.getScene('simulator') as Simulator;

        if(scene == undefined)
        {
          return
        }

        scene.updateScene({ testJson, animationFrame, showDebug })

        //render stuff
    }, [testJson, animationFrame, showDebug])

    return Phaser ? (
        <div
            className={`${styles.game} ${
                styles[`game__${variant}`]
            } ${className}`}
            ref={parent}
        >
            <canvas ref={canvas} />
        </div>
    ) : null;
};

Game.propTypes = {
    tagName: PropTypes.string,
    className: PropTypes.string,
    variant: PropTypes.oneOf(["default"]),
    children: PropTypes.node,
};

export default Game;
