import Phaser from "phaser";
import { bodyStateNumberToName } from "../constants/constants";
import { spriteDataPhaser } from "../constants/sprites";
import { Frame, Rectangle } from "../types/Frame";

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

    readonly STROKE_STYLE_BODY_HITBOX = 0xFCE205FF;
    readonly STROKE_STYLE_ACTION_HITBOX = 0xCC3333FF;

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

        const yDisplacementFromCenterToGround = -150;
        let bg = this.add.image(0,0,'arena_bg');
        bg.setScale(2, 2).setPosition(0, bg.y + yDisplacementFromCenterToGround)

        const outOfBoundX = 2000
        this.player_one = this.add.sprite(-outOfBoundX,0,`antoc-idle`, 0)
        this.player_two = this.add.sprite(outOfBoundX,0,`antoc-idle`, 0)
        this.player_two.setFlipX(true)

        this.player_one_body_hitbox = this.addRectangleHelper(this.STROKE_STYLE_BODY_HITBOX)
        this.player_two_body_hitbox = this.addRectangleHelper(this.STROKE_STYLE_BODY_HITBOX)
        this.player_one_action_hitbox = this.addRectangleHelper(this.STROKE_STYLE_ACTION_HITBOX)
        this.player_two_action_hitbox = this.addRectangleHelper(this.STROKE_STYLE_ACTION_HITBOX)

        this.player_one_body_hitbox_text = this.addTextHelper()
        this.player_two_body_hitbox_text = this.addTextHelper()
        this.player_one_action_hitbox_text = this.addTextHelper()
        this.player_two_action_hitbox_text = this.addTextHelper()

        this.cameras.main.centerOn(0, yDisplacementFromCenterToGround)

        // Initial camera setup
        // reference: https://stackoverflow.com/questions/56289506/phaser-3-how-to-create-smooth-zooming-effect
        this.cameras.main.pan(0, -150, 500, 'Power2');
        this.cameras.main.zoomTo(1.2, 500);
    }

    addRectangleHelper(strokeStyle: number) {
        const rect = this.add.rectangle(0, 0, 0, 0)
        rect.setStrokeStyle(2, strokeStyle);
        rect.setFillStyle(0, .3)
        return rect
    }

    addTextHelper() {
        const text = this.add.text(0,0,"")
        text.setFontSize(12).setAlign("center")
        return text
    }

    setPlayerOneCharacter(characterType : number){
        const characterName = characterType == 0 ? 'jessica' : 'antoc'
        this.player_one_character = characterName
    }
    setPlayerTwoCharacter(characterType : number){
        const characterName = characterType == 0 ? 'jessica' : 'antoc'
        this.player_two_character = characterName
    }

    setPlayerOneFrame(frame : Frame){
        this.setPlayerFrameHelper(frame, this.player_one, this.player_one_character)
    }

    setPlayerTwoFrame(frame : Frame){
        this.setPlayerFrameHelper(frame, this.player_two, this.player_two_character)
    }

    setPlayerFrameHelper(frame: Frame, player: Phaser.GameObjects.Image, characterName: string) {
        // Extract from frame
        const bodyState = frame.body_state.state
        const bodyStateCounter = frame.body_state.counter
        const bodyStateDir = frame.body_state.dir
        const physicsState = frame.physics_state
        const pos = physicsState.pos
        const hitboxW = frame.hitboxes.body.dimension.x

        const bodyStateName = bodyStateNumberToName [characterName][bodyState]
        const direction = (bodyStateDir == 1) ? 'right' : 'left'

        //Calculating offsets for frame
        const spriteAdjustments = spriteDataPhaser[characterName][bodyStateName]
        const spriteAdjustment = spriteAdjustments.length == 1 ? spriteAdjustments[0] : spriteAdjustments[bodyStateCounter] // if having more than one adjustments, use body counter to index the adjustments
        const spriteSize = spriteAdjustment?.size || [0, 0]
        const spriteLeftAdjustment = spriteAdjustment?.hitboxOffset[direction][0] || 0
        const spriteTopAdjustment = spriteAdjustment?.hitboxOffset[direction][1] || 0

        player.setX(pos.x + spriteLeftAdjustment - hitboxW / 2);
        player.setY(-pos.y + spriteTopAdjustment);

        player.setTexture(`${characterName}-${bodyStateName}`, `frame_${bodyStateCounter}.png`)
    }

    setPlayerOneBodyHitbox(frame : Frame) {
        this.setHitboxHelper(frame.hitboxes.body, this.player_one_body_hitbox, this.player_one_body_hitbox_text, false)
    }

    setPlayerTwoBodyHitbox(frame : Frame) {
        this.setHitboxHelper(frame.hitboxes.body, this.player_two_body_hitbox, this.player_two_body_hitbox_text, false)
    }

    setPlayerOneActionHitbox(frame : Frame) {
        this.setHitboxHelper(frame.hitboxes.action, this.player_one_action_hitbox, this.player_one_action_hitbox_text, true)
    }

    setPlayerTwoActionHitbox(frame : Frame) {
        this.setHitboxHelper(frame.hitboxes.action, this.player_two_action_hitbox, this.player_two_action_hitbox_text, true)
    }

    setHitboxHelper(hitbox: Rectangle, phaserHitbox: Phaser.GameObjects.Rectangle, phaserText: Phaser.GameObjects.Text, is_action: boolean) {
        const hitboxW = hitbox.dimension.x
        const hitboxH = hitbox.dimension.y
        const hitboxX = hitbox.origin.x
        const hitboxY = hitbox.origin.y

        // const centerX =  hitboxX
        // const centerY = is_action ? - hitboxH : - hitboxY - hitbox.dimension.y / 2
        const topLeftX = hitboxX
        const topLeftY = -(hitboxY + hitboxH)
        // const topLeftX = 0;
        // const topLeftY = 0;

        phaserHitbox.setPosition(topLeftX, topLeftY)
        phaserHitbox.setSize(hitboxW, hitboxH)
        phaserText.setText(`(${hitboxX},${hitboxY})\n${hitboxW}x${hitboxH}`)
        Phaser.Display.Align.In.Center(phaserText, phaserHitbox);
        phaserText.setPosition(phaserText.x + hitbox.dimension.x / 2, phaserText.y + hitbox.dimension.y / 2)
    }

    showDebug(){
        this.player_one_body_hitbox.setVisible(true)
        this.player_two_body_hitbox.setVisible(true)
        this.player_one_action_hitbox.setVisible(true)
        this.player_two_action_hitbox.setVisible(true)

        this.player_one_body_hitbox_text.setVisible(true)
        this.player_two_body_hitbox_text.setVisible(true)
        this.player_one_action_hitbox_text.setVisible(true)
        this.player_two_action_hitbox_text.setVisible(true)
    }
    hideDebug(){
        this.player_one_body_hitbox.setVisible(false)
        this.player_two_body_hitbox.setVisible(false)
        this.player_one_action_hitbox.setVisible(false)
        this.player_two_action_hitbox.setVisible(false)

        this.player_one_body_hitbox_text.setVisible(false)
        this.player_two_body_hitbox_text.setVisible(false)
        this.player_one_action_hitbox_text.setVisible(false)
        this.player_two_action_hitbox_text.setVisible(false)
    }
}