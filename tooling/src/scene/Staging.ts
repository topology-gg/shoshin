import Phaser from "phaser";
import { spriteDataPhaser } from "../constants/sprites";
import { BodyState } from "../types/Frame";

interface BodyStateAndFrame {
    state: string;
    frames: number;
}

export default class Platformer extends Phaser.Scene {
    private player_one: Phaser.GameObjects.Image;

    private player_one_body_hitbox: Phaser.GameObjects.Rectangle;


    preload() {
        this.load.atlas(
            `antoc-idle`,
            "images/antoc/idle/spritesheet.png",
            "images/antoc/idle/spritesheet.json"
        );
        this.load.atlas(
            `antoc-walk_forward`,
            "images/antoc/walk_forward/spritesheet.png",
            "images/antoc/walk_forward/spritesheet.json"
        );
        this.load.atlas(
            `antoc-walk_backward`,
            "images/antoc/walk_backward/spritesheet.png",
            "images/antoc/walk_backward/spritesheet.json"
        );
        this.load.atlas(
            `antoc-hori`,
            "images/antoc/hori/spritesheet.png",
            "images/antoc/hori/spritesheet.json"
        );
        this.load.atlas(
            `antoc-hurt`,
            "images/antoc/hurt/spritesheet.png",
            "images/antoc/hurt/spritesheet.json"
        );
        this.load.atlas(
            `antoc-knocked`,
            "images/antoc/knocked/spritesheet.png",
            "images/antoc/knocked/spritesheet.json"
        );
        this.load.atlas(
            `antoc-vert`,
            "images/antoc/vert/spritesheet.png",
            "images/antoc/vert/spritesheet.json"
        );
        this.load.atlas(
            `antoc-dash_forward`,
            "images/antoc/dash_forward/spritesheet.png",
            "images/antoc/dash_forward/spritesheet.json"
        );
        this.load.atlas(
            `antoc-dash_backward`,
            "images/antoc/dash_backward/spritesheet.png",
            "images/antoc/dash_backward/spritesheet.json"
        );
        this.load.atlas(
            `antoc-block`,
            "images/antoc/block/spritesheet.png",
            "images/antoc/block/spritesheet.json"
        );

        this.load.atlas(
            `jessica-idle-right`,
            "images/jessica/idle/right_spritesheet.png"
        );
        this.load.atlas(
            `jessica-idle-left`,
            "images/jessica/idle/left_spritesheet.png"
        );
    }

    private spawnImage(
        x: number,
        y: number,
        characterName: string,
        bodyState: string,
        counter : number,
        direction: string,
        flipX : true
    ) { 

        const spriteAdjustments =
            spriteDataPhaser[characterName][bodyState];
        const spriteAdjustment =
            spriteAdjustments.length == 1
                ? spriteAdjustments[0]
                : spriteAdjustments[counter]; // if having more than one adjustments, use body counter to index the adjustments
        const spriteSize = spriteAdjustment?.size || [0, 0];
        const spriteLeftAdjustment =
            spriteAdjustment?.hitboxOffset[direction][0] || 0;
        const spriteTopAdjustment =
            spriteAdjustment?.hitboxOffset[direction][1] || 0;

        console.log(x);
        console.log(y);
        let image = this.add.image(
            x + spriteLeftAdjustment,
            y + spriteTopAdjustment,
            `${characterName}-${bodyState}`,
            `frame_${counter}.png`
        );
        image.setFlipX(flipX)
        // Not sure why we need to draw the hitbox with +50 but it works!
        const rectX = x + 50;
        const rectY = y;
        console.log(rectX);
        console.log(rectY);
        let temp = this.add.rectangle(rectX, rectY, 50, 116);
        temp.setStrokeStyle(2, 0xcc3333ff);
        this.cameras.main.startFollow(temp);
    }

    create() {
        this.cameras.main.centerOn(0, -200);
        this.cameras.main.setZoom(0.5)
        

        const antocBodyStates: BodyStateAndFrame[] = [
            { state: "idle", frames: 0 },
            { state: "block", frames: 0 },
            { state: "hurt", frames: 0 },
            { state: "knocked", frames: 4},
           // { state: "dash_backward", frames: 0},
           // { state: "dash_forward", frames: 0},
            //{ state: "vert", frames: 0},
            //{ state: "hori", frames: 0},
            //{ state: "walk_backward", frames: 0},
           // { state: "walk_forward", frames: 0},                                
        ];

        //Assume that x and y represent bottom left of hitbox and characters body position
        antocBodyStates.forEach((bodyState, index) => {
            for(let i = 0; i <= bodyState.frames; i ++){
                this.spawnImage(0 + 100 * i, -100 + 200 * index, "antoc", bodyState.state, i, "right", false);
            }
            
        });

        antocBodyStates.forEach((bodyState, index) => {
            for(let i = 0; i <= bodyState.frames; i ++){
                this.spawnImage(0 + 100 * i, -3000 + 200 * index, "antoc", bodyState.state, i, "left", true);
            }
            
        });
    }


}
