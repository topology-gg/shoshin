import Phaser from 'phaser';
import { spriteDataPhaser } from '../constants/sprites';
import { BodyState } from '../types/Frame';

interface BodyStateAndFrame {
    state: string;
    frames: number;
}

export default class Platformer extends Phaser.Scene {
    private player_one: Phaser.GameObjects.Image;

    private player_one_body_hitbox: Phaser.GameObjects.Rectangle;

    private keys: Phaser.Types.Input.Keyboard.CursorKeys;

    preload() {
        this.load.atlas(
            `antoc-idle`,
            'images/antoc/idle/spritesheet.png',
            'images/antoc/idle/spritesheet.json'
        );
        this.load.atlas(
            `antoc-walk_forward`,
            'images/antoc/walk_forward/spritesheet.png',
            'images/antoc/walk_forward/spritesheet.json'
        );
        this.load.atlas(
            `antoc-walk_backward`,
            'images/antoc/walk_backward/spritesheet.png',
            'images/antoc/walk_backward/spritesheet.json'
        );
        this.load.atlas(
            `antoc-hori`,
            'images/antoc/hori/spritesheet.png',
            'images/antoc/hori/spritesheet.json'
        );
        this.load.atlas(
            `antoc-hurt`,
            'images/antoc/hurt/spritesheet.png',
            'images/antoc/hurt/spritesheet.json'
        );
        this.load.atlas(
            `antoc-knocked`,
            'images/antoc/knocked/spritesheet.png',
            'images/antoc/knocked/spritesheet.json'
        );
        this.load.atlas(
            `antoc-vert`,
            'images/antoc/vert/spritesheet.png',
            'images/antoc/vert/spritesheet.json'
        );
        this.load.atlas(
            `antoc-dash_forward`,
            'images/antoc/dash_forward/spritesheet.png',
            'images/antoc/dash_forward/spritesheet.json'
        );
        this.load.atlas(
            `antoc-dash_backward`,
            'images/antoc/dash_backward/spritesheet.png',
            'images/antoc/dash_backward/spritesheet.json'
        );
        this.load.atlas(
            `antoc-block`,
            'images/antoc/block/spritesheet.png',
            'images/antoc/block/spritesheet.json'
        );
        this.load.atlas(
            `antoc-jump`,
            'images/antoc/jump/spritesheet.png',
            'images/antoc/jump/spritesheet.json'
        );
        this.load.atlas(
            `antoc-step-forward`,
            'images/antoc/step_forward/spritesheet.png',
            'images/antoc/step_forward/spritesheet.json'
        );

        this.load.atlas(
            `jessica-knocked`,
            'images/jessica/knocked/spritesheet.png',
            'images/jessica/knocked/spritesheet.json'
        );

        this.load.atlas(
            `jessica-idle`,
            'images/jessica/idle/spritesheet.png',
            'images/jessica/idle/spritesheet.json'
        );

        this.load.atlas(
            `jessica-idle`,
            'images/jessica/idle/spritesheet.png',
            'images/jessica/idle/spritesheet.json'
        );

        this.load.atlas(
            `jessica-hurt`,
            'images/jessica/hurt/spritesheet.png',
            'images/jessica/hurt/spritesheet.json'
        );

        this.load.atlas(
            `jessica-dash_forward`,
            'images/jessica/dash_forward/spritesheet.png',
            'images/jessica/dash_forward/spritesheet.json'
        );

        this.load.atlas(
            `jessica-dash_backward`,
            'images/jessica/dash_backward/spritesheet.png',
            'images/jessica/dash_backward/spritesheet.json'
        );

        this.load.atlas(
            `jessica-idle`,
            'images/jessica/idle/spritesheet.png',
            'images/jessica/idle/spritesheet.json'
        );

        this.load.atlas(
            `jessica-clash`,
            'images/jessica/clash/spritesheet.png',
            'images/jessica/clash/spritesheet.json'
        );

        this.load.atlas(
            `jessica-block`,
            'images/jessica/block/spritesheet.png',
            'images/jessica/block/spritesheet.json'
        );

        this.load.atlas(
            `jessica-sidecut`,
            'images/jessica/sidecut/spritesheet.png',
            'images/jessica/sidecut/spritesheet.json'
        );

        this.load.atlas(
            `jessica-slash`,
            'images/jessica/slash/spritesheet.png',
            'images/jessica/slash/spritesheet.json'
        );

        this.load.atlas(
            `jessica-upswing`,
            'images/jessica/upswing/spritesheet.png',
            'images/jessica/upswing/spritesheet.json'
        );

        this.load.atlas(
            `jessica-walk_backward`,
            'images/jessica/walk_backward/spritesheet.png',
            'images/jessica/walk_backward/spritesheet.json'
        );

        this.load.atlas(
            `jessica-walk_forward`,
            'images/jessica/walk_forward/spritesheet.png',
            'images/jessica/walk_forward/spritesheet.json'
        );
    }

    private spawnImage(
        x: number,
        y: number,
        characterName: string,
        bodyState: string,
        counter: number,
        direction: string,
        flipX: true
    ) {
        const spriteAdjustments = spriteDataPhaser[characterName][bodyState];
        const spriteAdjustment =
            spriteAdjustments.length == 1
                ? spriteAdjustments[0]
                : spriteAdjustments[counter]; // if having more than one adjustments, use body counter to index the adjustments
        const spriteSize = spriteAdjustment?.size || [0, 0];
        const spriteLeftAdjustment =
            spriteAdjustment?.hitboxOffset[direction][0] || 0;
        const spriteTopAdjustment =
            spriteAdjustment?.hitboxOffset[direction][1] || 0;

        let image = this.add.image(
            x + spriteLeftAdjustment,
            y + spriteTopAdjustment,
            `${characterName}-${bodyState}`,
            `frame_${counter}.png`
        );
        image.setFlipX(flipX);
        // Not sure why we need to draw the hitbox with +50 but it works!
        const rectX = x + 50;
        const rectY = y;
        let temp = this.add.rectangle(rectX, rectY, 50, 116);
        temp.setStrokeStyle(2, 0xcc3333ff);

        if (counter == 0) {
            this.add.text(
                rectX - 300,
                rectY,
                `${characterName}-${bodyState}-${direction}`
            );
        }

        //this.cameras.main.startFollow(temp)
    }

    create() {
        this.cameras.main.centerOn(0, -150);
        this.cameras.main.setZoom(1.8);

        const antocBodyStates: BodyStateAndFrame[] = [
            { state: 'idle', frames: 5 },
            { state: 'block', frames: 6 },
            //{ state: "hurt", frames: 3 },
            //{ state: "knocked", frames: 10},
            // { state: "dash_backward", frames: 6},
            //{ state: "dash_forward", frames: 7},
            //{ state: "vert", frames: 10},
            //{ state: "hori", frames: 7},
            //{ state: "walk_backward", frames: 6},
            // { state: "walk_forward", frames: 7},
        ];

        //Assume that x and y represent bottom left of hitbox and characters body position
        antocBodyStates.forEach((bodyState, index) => {
            for (let i = 0; i <= bodyState.frames; i++) {
                // this.spawnImage(0 + 100 * i, -100 + 200 * index, "antoc", bodyState.state, i, "right", false);
            }
        });

        antocBodyStates.forEach((bodyState, index) => {
            for (let i = 0; i <= bodyState.frames; i++) {
                // this.spawnImage(0 + 100 * i, -2200 + 200 * index, "antoc", bodyState.state, i, "left", true);
            }
        });

        this.keys = this.input.keyboard.createCursorKeys();

        const jessicaBodyStates: BodyStateAndFrame[] = [
            { state: 'knocked', frames: 10 },
            { state: 'idle', frames: 0 },
            //{ state: "block", frames: 0 },
            //{ state: "hurt", frames: 0 },
            //{ state: "dash_backward", frames: 0},
            //{ state: "dash_forward", frames: 0},
            //{ state: "walk_backward", frames: 0},
            //{ state: "walk_forward", frames: 0},
            //{ state: "slash", frames: 0},
            //{ state: "upswing", frames: 0},
            //{ state: "clash", frames: 0},
            //{ state: "sidecut", frames: 0},
        ];

        jessicaBodyStates.forEach((bodyState, index) => {
            for (let i = 0; i <= bodyState.frames; i++) {
                //this.spawnImage(0 + 100 * i, 0 + 200 * index, "jessica", bodyState.state, i, "right", false);
            }
        });

        jessicaBodyStates.forEach((bodyState, index) => {
            for (let i = 0; i <= bodyState.frames; i++) {
                this.spawnImage(
                    0 + 100 * i,
                    0 + 300 * index,
                    'jessica',
                    bodyState.state,
                    i,
                    'left',
                    true
                );
            }
        });
    }

    update() {
        if (this.keys.down.isDown) {
            this.cameras.main.setScroll(
                this.cameras.main.scrollX,
                this.cameras.main.scrollY + 10
            );
        }

        if (this.keys.up.isDown) {
            this.cameras.main.setScroll(
                this.cameras.main.scrollX,
                this.cameras.main.scrollY - 10
            );
        }
        if (this.keys.right.isDown) {
            this.cameras.main.setScroll(
                this.cameras.main.scrollX + 10,
                this.cameras.main.scrollY
            );
        }

        if (this.keys.left.isDown) {
            this.cameras.main.setScroll(
                this.cameras.main.scrollX - 10,
                this.cameras.main.scrollY
            );
        }
    }
}
