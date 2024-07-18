/**
 * @file Game.js
 */
import * as React from 'react';
import PropTypes from 'prop-types';

import { useLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import styles from './Game.module.css';
import { TestJson } from '../types/Frame';
import Staging from '../scene/Staging';

const Game = () => {
    const tagName = 'div';
    const className = 'relative top-0 left-0 w-full h-full my-12';
    const variant = 'default';

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

    // import('phaser/src/phaser').then((mod) => {
    //   if (mod && !Phaser) {
    //     setPhaser(mod.default)
    //   }
    // })

    const preload = React.useCallback(() => {
        const g = game.current;
        //@ts-ignore
        const _this = g.scene.keys.default;
        console.log('preload ->  preloading assets...', _this);
        //_this.load.setBaseURL('http://labs.phaser.io');
        _this.load.image('sky', 'images/bg/shoshin-bg-white-long.png');
    }, []);

    const create = React.useCallback((e) => {
        const g = game.current;
        //@ts-ignore
        const _this = g.scene.keys.default;

        console.log('create -> creating elements...', _this);
        _this.add.image(400, 300, 'sky');

        var particles = _this.add.particles('red');

        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
        });

        var logo = _this.physics.add.image(400, 100, 'logo');

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
                width: window.innerWidth - 10,
                height: window.innerHeight - 10,
                // pixelArt: true,
                autoCenter: true,
                backgroundColor: '#000000',
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 200 },
                    },
                },
                scene: {},
                // callbacks: {
                //   preBoot: (game) => console.log('preBoot -> ', game),
                //   postBoot: (game) => console.log('postBoot -> ', game),
                // }
            };
            g = game.current = new Phaser.Game(config);

            g.scene.add('staging', Staging);
            g.scene.start('staging');
            console.log('game', game.current);
        }
        return () => g.destroy();
    }, [Phaser, create, preload, parent, canvas]);

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

export default Game;
