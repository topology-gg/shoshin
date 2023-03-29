import Phaser from "phaser";
import { bodyStateNumberToName } from "../constants/constants";
import { spriteData, spriteDataPhaser } from "../constants/sprites";
import { Frame } from "../types/Frame";

export default class Platformer extends Phaser.Scene {
    private player_one : Phaser.GameObjects.Image;
    private player_two : Phaser.GameObjects.Image;

    private player_one_character : string;
    private player_two_character : string;

    private player_one_body_hitbox : Phaser.GameObjects.Rectangle;
    private player_two_body_hitbox : Phaser.GameObjects.Rectangle;

    private player_one_action_hitbox : Phaser.GameObjects.Rectangle;
    private player_two_action_hitbox : Phaser.GameObjects.Rectangle;

    private player_one_body_hitbox_text : Phaser.GameObjects.Text
    private player_two_body_hitbox_text : Phaser.GameObjects.Text

    private player_one_action_hitbox_text : Phaser.GameObjects.Text
    private player_two_action_hitbox_text : Phaser.GameObjects.Text

    preload(){

        this.load.atlas(`antoc-idle`, 'images/antoc/idle/spritesheet.png',  'images/antoc/idle/spritesheet.json');
        this.load.atlas(`antoc-walk_forward`, 'images/antoc/walk_forward/spritesheet.png',  'images/antoc/walk_forward/spritesheet.json');
        this.load.atlas(`antoc-walk_backward`, 'images/antoc/walk_backward/spritesheet.png',  'images/antoc/walk_backward/spritesheet.json');
        this.load.atlas(`antoc-hori`, 'images/antoc/hori/spritesheet.png',  'images/antoc/hori/spritesheet.json');
        this.load.atlas(`antoc-hurt`, 'images/antoc/hurt/spritesheet.png',  'images/antoc/hurt/spritesheet.json');
        this.load.atlas(`antoc-knocked`, 'images/antoc/knocked/spritesheet.png',  'images/antoc/knocked/spritesheet.json');
        this.load.atlas(`antoc-vert`, 'images/antoc/vert/spritesheet.png',  'images/antoc/vert/spritesheet.json');
        this.load.atlas(`antoc-dash_forward`, 'images/antoc/dash_forward/spritesheet.png',  'images/antoc/dash_forward/spritesheet.json');
        this.load.atlas(`antoc-dash_backward`, 'images/antoc/dash_backward/spritesheet.png',  'images/antoc/dash_backward/spritesheet.json');
        this.load.atlas(`antoc-block`, 'images/antoc/block/spritesheet.png',  'images/antoc/block/spritesheet.json');

        this.load.atlas(
            `jessica-knocked`,
            "images/jessica/knocked/spritesheet.png",
            "images/jessica/knocked/spritesheet.json"
        );

        this.load.atlas(
            `jessica-idle`,
            "images/jessica/idle/spritesheet.png",
            "images/jessica/idle/spritesheet.json"
        );

        this.load.atlas(
            `jessica-idle`,
            "images/jessica/idle/spritesheet.png",
            "images/jessica/idle/spritesheet.json"
        );

        this.load.atlas(
            `jessica-hurt`,
            "images/jessica/hurt/spritesheet.png",
            "images/jessica/hurt/spritesheet.json"
        );

        this.load.atlas(
            `jessica-dash_forward`,
            "images/jessica/dash_forward/spritesheet.png",
            "images/jessica/dash_forward/spritesheet.json"
        );

        this.load.atlas(
            `jessica-dash_backward`,
            "images/jessica/dash_backward/spritesheet.png",
            "images/jessica/dash_backward/spritesheet.json"
        );

        this.load.atlas(
            `jessica-idle`,
            "images/jessica/idle/spritesheet.png",
            "images/jessica/idle/spritesheet.json"
        );

        this.load.atlas(
            `jessica-clash`,
            "images/jessica/clash/spritesheet.png",
            "images/jessica/clash/spritesheet.json"
        );

        this.load.atlas(
            `jessica-block`,
            "images/jessica/block/spritesheet.png",
            "images/jessica/block/spritesheet.json"
        );

        this.load.atlas(
            `jessica-sidecut`,
            "images/jessica/sidecut/spritesheet.png",
            "images/jessica/sidecut/spritesheet.json"
        );

        this.load.atlas(
            `jessica-slash`,
            "images/jessica/slash/spritesheet.png",
            "images/jessica/slash/spritesheet.json"
        );

        this.load.atlas(
            `jessica-upswing`,
            "images/jessica/upswing/spritesheet.png",
            "images/jessica/upswing/spritesheet.json"
        );

        this.load.atlas(
            `jessica-walk_backward`,
            "images/jessica/walk_backward/spritesheet.png",
            "images/jessica/walk_backward/spritesheet.json"
        );

        this.load.atlas(
            `jessica-walk_forward`,
            "images/jessica/walk_forward/spritesheet.png",
            "images/jessica/walk_forward/spritesheet.json"
        );

        this.load.image('arena_bg', "images/bg/shoshin-bg-white-long.png")
    }

    create(){       
        
        let bg = this.add.image(0,0,'arena_bg');
        bg.setScale(2, 2).setPosition(0, bg.y - 120)

        this.player_one = this.add.sprite(-100,0,`antoc-idle`, 0)
        this.player_two = this.add.sprite(100,0,`antoc-idle`, 0)
        this.player_two.setFlipX(true)
        
        this.player_one_body_hitbox = this.add.rectangle(0, 0, 0, 0)
        this.player_one_body_hitbox.setStrokeStyle(2, 0xFCE205FF);

        this.player_two_body_hitbox = this.add.rectangle(0, 0, 0, 0)
        this.player_two_body_hitbox.setStrokeStyle(2, 0xFCE205FF);

        this.player_one_action_hitbox = this.add.rectangle(0, 0, 0, 0)
        this.player_one_action_hitbox.setStrokeStyle(2, 0xCC3333FF);

        this.player_two_action_hitbox = this.add.rectangle(0, 0, 0, 0)
        this.player_two_action_hitbox.setStrokeStyle(2, 0xCC3333FF);

        this.player_one_body_hitbox_text = this.add.text(0,0,"")


        //this.player_one_body_hitbox_text.setAlign('center')
        this.player_one_body_hitbox_text.setFontSize(12)

        

        
        this.player_two_body_hitbox_text = this.add.text(-100,-100,"")
        this.player_two_body_hitbox_text.setFontSize(12)
        //this.player_two_body_hitbox_text.setVisible(false)
        this.player_one_action_hitbox_text = this.add.text(0,2,"")
        this.player_one_action_hitbox_text.setFontSize(12)
        //this.player_one_action_hitbox_text.setVisible(false)
        this.player_two_action_hitbox_text = this.add.text(0,3,"")
        this.player_two_action_hitbox_text.setFontSize(12)
        //this.player_two_action_hitbox_text.setVisible(false)

        
        //Phaser.Display.Align.In.Center(this.player_one_action_hitbox_text, this.player_one_action_hitbox);
        //Phaser.Display.Align.In.Center(this.player_two_action_hitbox_text, this.player_two_action_hitbox);


        //this.cameras.main.startFollow(this.player_one_body_hitbox, true);
        this.cameras.main.centerOn(0, -120)
        //this.cameras.main.setScroll(-500, -300)

        //this.cameras.main.setSize(this.cameras.main.width - 400, this.cameras.main.height - 400)
    }
    setPlayerOneCharacter(characterType : number){

        const characterName = characterType == 0 ? 'jessica' : 'antoc'    
        this.player_one_character = characterName
        //this.player_one = this.add.sprite(0,0,`${characterName}-idle-right`)
    }
    setPlayerTwoCharacter(characterType : number){
        const characterName = characterType == 0 ? 'jessica' : 'antoc'    
        this.player_two_character = characterName
        //this.player_two = this.add.sprite(0,0,`${characterName}-idle-left`)
    }

    setPlayerOneFrame(frame : Frame){
        // Extract from frame
        const bodyState = frame.body_state.state
        const bodyStateCounter = frame.body_state.counter
        const bodyStateDir = frame.body_state.dir
        const physicsState = frame.physics_state
        const pos = physicsState.pos

        const characterName = this.player_one_character;

        const bodyStateName = bodyStateNumberToName [characterName][bodyState]
        const direction = (bodyStateDir == 1) ? 'right' : 'left'

        //Calculating offsets for frame
        const spriteAdjustments = spriteDataPhaser[characterName][bodyStateName]
        const spriteAdjustment = spriteAdjustments.length == 1 ? spriteAdjustments[0] : spriteAdjustments[bodyStateCounter] // if having more than one adjustments, use body counter to index the adjustments
        const spriteSize = spriteAdjustment?.size || [0, 0]
        const spriteLeftAdjustment = spriteAdjustment?.hitboxOffset[direction][0] || 0
        const spriteTopAdjustment = spriteAdjustment?.hitboxOffset[direction][1] || 0

        this.player_one.setX(pos.x + spriteLeftAdjustment);
        this.player_one.setY(pos.y + spriteTopAdjustment);

        this.player_one.setTexture(`${characterName}-${bodyStateName}`, `frame_${bodyStateCounter}.png`)   
    }

    setPlayerTwoFrame(frame : Frame){
        // Extract from frame
        const bodyState = frame.body_state.state
        const bodyStateCounter = frame.body_state.counter
        const bodyStateDir = frame.body_state.dir
        const physicsState = frame.physics_state
        const pos = physicsState.pos

        const characterName = this.player_two_character;

        const bodyStateName = bodyStateNumberToName [characterName][bodyState]
        const direction = (bodyStateDir == 1) ? 'right' : 'left'

        //Calculating offsets for frame
        const spriteAdjustments = spriteDataPhaser[characterName][bodyStateName]
        const spriteAdjustment = spriteAdjustments.length == 1 ? spriteAdjustments[0] : spriteAdjustments[bodyStateCounter] // if having more than one adjustments, use body counter to index the adjustments
        const spriteSize = spriteAdjustment?.size || [0, 0]
        const spriteLeftAdjustment = spriteAdjustment?.hitboxOffset[direction][0] || 0
        const spriteTopAdjustment = spriteAdjustment?.hitboxOffset[direction][1] || 0
        
        this.player_two.setX(pos.x + spriteLeftAdjustment);
        this.player_two.setY(-pos.y + spriteTopAdjustment);

        this.player_two.setTexture(`${characterName}-${bodyStateName}`, `frame_${bodyStateCounter}.png`)
        
    }

    setPlayerOneBodyHitbox(frame : Frame) {
        const hitbox = frame.hitboxes.body;
        const hitboxW = hitbox.dimension.x
        const hitboxH = hitbox.dimension.y
        const hitboxX = hitbox.origin.x
        const hitboxY = hitbox.origin.y

        const centerX =  hitbox.origin.x + hitbox.dimension.x / 2
        const centerY = - hitbox.origin.y - hitbox.dimension.y / 2
        //const left = viewWidth/2 + hitboxX
        //const top = SIMULATOR_H - hitboxY - hitboxH + SpriteTopAdjustmentToBg

        this.player_one_body_hitbox.setPosition(centerX, centerY)
        this.player_one_body_hitbox.setSize(hitboxW, hitboxH)
        this.player_one_body_hitbox_text.setText(`(${hitboxX},${hitboxY})\n${hitboxW}x${hitboxH}`)
        Phaser.Display.Align.In.BottomCenter(this.player_one_body_hitbox_text, this.player_one_body_hitbox);
        
    }   

    setPlayerTwoBodyHitbox(frame : Frame) {
        const hitbox = frame.hitboxes.body;
        const hitboxW = hitbox.dimension.x
        const hitboxH = hitbox.dimension.y
        const hitboxX = hitbox.origin.x
        const hitboxY = hitbox.origin.y

        const centerX =  hitbox.origin.x + hitbox.dimension.x / 2
        const centerY = - hitbox.origin.y - hitbox.dimension.y / 2
        //const left = viewWidth/2 + hitboxX
        //const top = SIMULATOR_H - hitboxY - hitboxH + SpriteTopAdjustmentToBg

        this.player_two_body_hitbox.setPosition(centerX, centerY)
        this.player_two_body_hitbox.setSize(hitboxW, hitboxH)
        this.player_two_body_hitbox_text.setText(`(${hitboxX},${hitboxY})\n${hitboxW}x${hitboxH}`)
        Phaser.Display.Align.In.BottomRight(this.player_two_body_hitbox_text, this.player_two_body_hitbox);
    }   

    setPlayerOneActionHitbox(frame : Frame) {
        const hitbox = frame.hitboxes.action;
        const hitboxW = hitbox.dimension.x
        const hitboxH = hitbox.dimension.y
        const hitboxX = hitbox.origin.x
        const hitboxY = hitbox.origin.y

        const centerX =  hitbox.origin.x + hitbox.dimension.x / 2
        const centerY = - hitbox.origin.y - hitbox.dimension.y / 2
        //const left = viewWidth/2 + hitboxX
        //const top = SIMULATOR_H - hitboxY - hitboxH + SpriteTopAdjustmentToBg

        this.player_one_action_hitbox.setPosition(centerX, centerY)
        this.player_one_action_hitbox.setSize(hitboxW, hitboxH)
        this.player_one_action_hitbox_text.setText(`(${hitboxX},${hitboxY})\n${hitboxW}x${hitboxH}`)
        Phaser.Display.Align.In.BottomRight(this.player_one_action_hitbox_text, this.player_one_action_hitbox);
    }   

    setPlayerTwoActionHitbox(frame : Frame) {
        const hitbox = frame.hitboxes.action;
        const hitboxW = hitbox.dimension.x
        const hitboxH = hitbox.dimension.y
        const hitboxX = hitbox.origin.x
        const hitboxY = hitbox.origin.y

        const centerX =  hitbox.origin.x + hitbox.dimension.x / 2
        const centerY = - hitbox.origin.y - hitbox.dimension.y / 2
        //const left = viewWidth/2 + hitboxX
        //const top = SIMULATOR_H - hitboxY - hitboxH + SpriteTopAdjustmentToBg

        this.player_two_action_hitbox.setPosition(centerX, centerY)
        this.player_two_action_hitbox.setSize(hitboxW, hitboxH)
        this.player_two_action_hitbox_text.setText(`(${hitboxX},${hitboxY})\n${hitboxW}x${hitboxH}`)
        Phaser.Display.Align.In.Center(this.player_two_action_hitbox_text, this.player_two_action_hitbox);
    }   

    showDebug(){
        this.player_one_body_hitbox.setVisible(true)
        this.player_two_body_hitbox.setVisible(true)
        this.player_one_action_hitbox.setVisible(true)
        this.player_two_action_hitbox.setVisible(true)
    }
    hideDebug(){
        this.player_one_body_hitbox.setVisible(false)
        this.player_two_body_hitbox.setVisible(false)
        this.player_one_action_hitbox.setVisible(false)
        this.player_two_action_hitbox.setVisible(false)
    }
}