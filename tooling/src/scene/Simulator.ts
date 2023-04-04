import Phaser from "phaser";
import { bodyStateNumberToName } from "../constants/constants";
import { spriteDataPhaser } from "../constants/sprites";
import { Frame, Rectangle } from "../types/Frame";
import { SimulatorProps } from "../types/Simulator";

const ARENA_WIDTH = 1000;
const DEFAULT_ZOOM = 1.5

const DEFAULT_CAMERA_HEIGHT = 400
const DEFAULT_CAMERA_CENTER_X = 25
const DEFAULT_CAMERA_CENTER_Y = -110
const DEFAULT_CAMERA_LEFT = - ARENA_WIDTH / 2
const DEFAULT_CAMERA_TOP = DEFAULT_CAMERA_CENTER_Y - DEFAULT_CAMERA_HEIGHT / 2
const CAMERA_REACTION_TIME = 400

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

        this.load.atlas(`jessica-knocked`,"images/jessica/knocked/spritesheet.png","images/jessica/knocked/spritesheet.json");
        this.load.atlas(`jessica-idle`,"images/jessica/idle/spritesheet.png","images/jessica/idle/spritesheet.json");
        this.load.atlas(`jessica-idle`,"images/jessica/idle/spritesheet.png","images/jessica/idle/spritesheet.json");
        this.load.atlas(`jessica-hurt`,"images/jessica/hurt/spritesheet.png","images/jessica/hurt/spritesheet.json");
        this.load.atlas(`jessica-dash_forward`,"images/jessica/dash_forward/spritesheet.png","images/jessica/dash_forward/spritesheet.json");
        this.load.atlas(`jessica-dash_backward`,"images/jessica/dash_backward/spritesheet.png","images/jessica/dash_backward/spritesheet.json");
        this.load.atlas(`jessica-idle`,"images/jessica/idle/spritesheet.png","images/jessica/idle/spritesheet.json");
        this.load.atlas(`jessica-clash`,"images/jessica/clash/spritesheet.png","images/jessica/clash/spritesheet.json");
        this.load.atlas(`jessica-block`,"images/jessica/block/spritesheet.png","images/jessica/block/spritesheet.json");
        this.load.atlas(`jessica-sidecut`,"images/jessica/sidecut/spritesheet.png","images/jessica/sidecut/spritesheet.json");
        this.load.atlas(`jessica-slash`,"images/jessica/slash/spritesheet.png","images/jessica/slash/spritesheet.json");
        this.load.atlas(`jessica-upswing`,"images/jessica/upswing/spritesheet.png","images/jessica/upswing/spritesheet.json");
        this.load.atlas(`jessica-walk_backward`,"images/jessica/walk_backward/spritesheet.png","images/jessica/walk_backward/spritesheet.json");
        this.load.atlas(`jessica-walk_forward`,"images/jessica/walk_forward/spritesheet.png","images/jessica/walk_forward/spritesheet.json");

        this.load.image('arena_bg', "images/bg/shoshin-bg-white-long.png")
    }

    initializeCameraSettings(){
        // Initial camera setup
        // reference: https://stackoverflow.com/questions/56289506/phaser-3-how-to-create-smooth-zooming-effect
        this.cameras.main.pan(DEFAULT_CAMERA_CENTER_X, DEFAULT_CAMERA_CENTER_Y, 500, 'Power2');
        this.cameras.main.zoomTo(DEFAULT_ZOOM, 500);


        // Bounds are used to prevent panning horizontally past the sides of the background
        // https://newdocs.phaser.io/docs/3.55.2/Phaser.Cameras.Scene2D.BaseCamera#setBounds
        this.cameras.main.setBounds(DEFAULT_CAMERA_LEFT, DEFAULT_CAMERA_TOP , ARENA_WIDTH, DEFAULT_CAMERA_HEIGHT)
    }
    create(){

        const yDisplacementFromCenterToGround = -150;
        let bg = this.add.image(0,0,'arena_bg');
        bg.setScale(2.5, 2.5).setPosition(0, bg.y + yDisplacementFromCenterToGround)

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
        this.initializeCameraSettings()

    }

    private addRectangleHelper(strokeStyle: number) {
        const rect = this.add.rectangle(0, 0, 0, 0)
        rect.setStrokeStyle(2, strokeStyle);
        rect.setFillStyle(0, .3)
        return rect
    }

    private addTextHelper() {
        const text = this.add.text(0,0,"")
        text.setFontSize(12).setAlign("center")
        return text
    }

    private setPlayerOneCharacter(characterType : number){
        const characterName = characterType == 0 ? 'jessica' : 'antoc'
        this.player_one_character = characterName
    }
    private setPlayerTwoCharacter(characterType : number){
        const characterName = characterType == 0 ? 'jessica' : 'antoc'
        this.player_two_character = characterName
    }

    private setPlayerOneFrame(frame : Frame){
        this.setPlayerFrameHelper(frame, this.player_one, this.player_one_character)
    }

    private setPlayerTwoFrame(frame : Frame){
        this.setPlayerFrameHelper(frame, this.player_two, this.player_two_character)
    }

    private setPlayerFrameHelper(frame: Frame, player: Phaser.GameObjects.Image, characterName: string) {
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

    private setPlayerOneBodyHitbox(frame : Frame) {
        this.setHitboxHelper(frame.hitboxes.body, this.player_one_body_hitbox, this.player_one_body_hitbox_text, false)
    }

    private setPlayerTwoBodyHitbox(frame : Frame) {
        this.setHitboxHelper(frame.hitboxes.body, this.player_two_body_hitbox, this.player_two_body_hitbox_text, false)
    }

    private setPlayerOneActionHitbox(frame : Frame) {
        this.setHitboxHelper(frame.hitboxes.action, this.player_one_action_hitbox, this.player_one_action_hitbox_text, true)
    }

    private setPlayerTwoActionHitbox(frame : Frame) {
        this.setHitboxHelper(frame.hitboxes.action, this.player_two_action_hitbox, this.player_two_action_hitbox_text, true)
    }

    private setHitboxHelper(hitbox: Rectangle, phaserHitbox: Phaser.GameObjects.Rectangle, phaserText: Phaser.GameObjects.Text, is_action: boolean) {
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

    private showDebug(){
        this.player_one_body_hitbox.setVisible(true)
        this.player_two_body_hitbox.setVisible(true)
        this.player_one_action_hitbox.setVisible(true)
        this.player_two_action_hitbox.setVisible(true)

        this.player_one_body_hitbox_text.setVisible(true)
        this.player_two_body_hitbox_text.setVisible(true)
        this.player_one_action_hitbox_text.setVisible(true)
        this.player_two_action_hitbox_text.setVisible(true)
    }

    private hideDebug(){
        this.player_one_body_hitbox.setVisible(false)
        this.player_two_body_hitbox.setVisible(false)
        this.player_one_action_hitbox.setVisible(false)
        this.player_two_action_hitbox.setVisible(false)

        this.player_one_body_hitbox_text.setVisible(false)
        this.player_two_body_hitbox_text.setVisible(false)
        this.player_one_action_hitbox_text.setVisible(false)
        this.player_two_action_hitbox_text.setVisible(false)
    }

    private adjustCamera(charOneX : number, charTwoX : number){

        const camera = this.cameras.main

        const charDistance = charOneX < charTwoX ? Math.abs(charOneX - charTwoX)  : Math.abs(charTwoX - charOneX)
        const leftCharX = charOneX < charTwoX ? charOneX : charTwoX

        // At the closest distance zoom is default, at further distances we zoom out till .9
        const calculatedZoom =  charDistance < 400 ? DEFAULT_ZOOM :  DEFAULT_ZOOM - .3 * (charDistance /  800 )
        camera.zoomTo(calculatedZoom, CAMERA_REACTION_TIME);

        // pan to midpoint between characters
        camera.pan( leftCharX + charDistance / 2 + DEFAULT_CAMERA_CENTER_X , DEFAULT_CAMERA_CENTER_Y, CAMERA_REACTION_TIME)

    }
    updateScene({testJson, animationFrame, showDebug}: SimulatorProps){
                const characterType0 = testJson?.agent_0.type
                const characterType1 = testJson?.agent_1.type
                const agentFrame0 = testJson?.agent_0.frames[animationFrame]
                const agentFrame1 = testJson?.agent_1.frames[animationFrame]
                this.setPlayerOneCharacter(characterType0)
                this.setPlayerTwoCharacter(characterType1)
                this.setPlayerOneFrame(agentFrame0);
                this.setPlayerTwoFrame(agentFrame1);



                if(animationFrame == 0)
                {
                    this.initializeCameraSettings()
                }
                else
                {
                    this.adjustCamera(agentFrame0.physics_state.pos.x, agentFrame1.physics_state.pos.x)
                }

                if(showDebug)
                {
                    this.showDebug()
                    this.setPlayerOneBodyHitbox(agentFrame0)
                    this.setPlayerTwoBodyHitbox(agentFrame1)
                    this.setPlayerOneActionHitbox(agentFrame0)
                    this.setPlayerTwoActionHitbox(agentFrame1)
                }else{
                    this.hideDebug()
                }
    }
}