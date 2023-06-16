import Phaser from 'phaser';
import { bodyStateNumberToName } from '../constants/constants';
import { spriteDataPhaser } from '../constants/sprites';
import { FrameLike, RealTimeFrameScene, Rectangle } from '../types/Frame';
import { SimulatorProps } from '../types/Simulator';
import { GameModes } from '../types/Simulator';
import { IShoshinWASMContext } from '../context/wasm-shoshin';

const ARENA_WIDTH = 1000;
const DEFAULT_ZOOM = 1.7;

const DEFAULT_CAMERA_HEIGHT = 400;
const DEFAULT_CAMERA_CENTER_X = 25;
const DEFAULT_CAMERA_CENTER_Y = -95;
const DEFAULT_CAMERA_LEFT = -ARENA_WIDTH / 2;
const DEFAULT_CAMERA_TOP = DEFAULT_CAMERA_CENTER_Y - DEFAULT_CAMERA_HEIGHT / 2;
const CAMERA_REACTION_TIME = 50;

const HITBOX_STROKE_WIDTH = 1.5;

export default class Simulator extends Phaser.Scene {
    player_one: Phaser.GameObjects.Image;
    player_two: Phaser.GameObjects.Image;

    player_one_character: string;
    player_two_character: string;

    player_one_body_hitbox: Phaser.GameObjects.Rectangle;
    player_two_body_hitbox: Phaser.GameObjects.Rectangle;

    player_one_action_hitbox: Phaser.GameObjects.Rectangle;
    player_two_action_hitbox: Phaser.GameObjects.Rectangle;

    player_one_body_hitbox_text: Phaser.GameObjects.Text;
    player_two_body_hitbox_text: Phaser.GameObjects.Text;

    player_one_action_hitbox_text: Phaser.GameObjects.Text;
    player_two_action_hitbox_text: Phaser.GameObjects.Text;

    endTextP1Won: Phaser.GameObjects.Text;
    endTextP2Won: Phaser.GameObjects.Text;
    endTextDraw: Phaser.GameObjects.Text;

    readonly STROKE_STYLE_BODY_HITBOX = 0x7cfc00; //0xFEBA4F;
    readonly STROKE_STYLE_ACTION_HITBOX = 0xff2400; //0xFB4D46;

    //context only relevent for realtime atm, but I strongly think simulator will have wasm calls soon
    changeScene(
        scene: GameModes,
        context: IShoshinWASMContext,
        setPlayerStatuses: any
    ) {
        let otherSceneName =
            scene === GameModes.simulation
                ? GameModes.realtime
                : GameModes.simulation;
        if (this.scene.isActive(otherSceneName)) {
            this.scene.pause(otherSceneName);
        }

        if (this.scene.isPaused(scene)) {
            this.scene.resume(scene);
        } else {
            this.scene.start(scene, { context, setPlayerStatuses });
        }
    }

    preload() {
        //
        // Antoc
        //
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
            `antoc-clash`,
            'images/antoc/clash/spritesheet.png',
            'images/antoc/clash/spritesheet.json'
        );
        this.load.atlas(
            `antoc-jump`,
            'images/antoc/jump/spritesheet.png',
            'images/antoc/jump/spritesheet.json'
        );
        this.load.atlas(
            `antoc-step_forward`,
            'images/antoc/step_forward/spritesheet.png',
            'images/antoc/step_forward/spritesheet.json'
        );

        //
        // Jessica
        //
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
        this.load.atlas(
            `jessica-jump`,
            'images/jessica/jump/spritesheet.png',
            'images/jessica/jump/spritesheet.json'
        );
        this.load.atlas(
            `jessica-gatotsu`,
            'images/jessica/gatotsu/spritesheet.png',
            'images/jessica/gatotsu/spritesheet.json'
        );

        this.load.image(
            'arena_bg',
            'images/bg/shoshin-bg-large-transparent.png'
        );
    }

    initializeCameraSettings() {
        // Initial camera setup
        // reference: https://stackoverflow.com/questions/56289506/phaser-3-how-to-create-smooth-zooming-effect
        this.cameras.main.pan(
            DEFAULT_CAMERA_CENTER_X,
            DEFAULT_CAMERA_CENTER_Y,
            500,
            'Power2'
        );
        this.cameras.main.zoomTo(DEFAULT_ZOOM, 500);

        // Bounds are used to prevent panning horizontally past the sides of the background
        // https://newdocs.phaser.io/docs/3.55.2/Phaser.Cameras.Scene2D.BaseCamera#setBounds
        this.cameras.main.setBounds(
            DEFAULT_CAMERA_LEFT,
            DEFAULT_CAMERA_TOP,
            ARENA_WIDTH,
            DEFAULT_CAMERA_HEIGHT
        );
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

    intitialize() {
        const yDisplacementFromCenterToGround = -150;
        let bg = this.add.image(0, 20, 'arena_bg');
        bg.setScale(0.3, 0.2).setPosition(
            0,
            bg.y + yDisplacementFromCenterToGround
        );
        console.log('bg x, ', bg.x);
        console.log('bg y ', bg.y);

        const outOfBoundX = 2000;
        this.player_one = this.add.sprite(-outOfBoundX, 0, `antoc-idle`, 0);
        this.player_two = this.add.sprite(outOfBoundX, 0, `antoc-idle`, 0);
        this.player_two.setFlipX(true);

        this.player_one_body_hitbox = this.addRectangleHelper(
            this.STROKE_STYLE_BODY_HITBOX,
            HITBOX_STROKE_WIDTH
        );
        this.player_two_body_hitbox = this.addRectangleHelper(
            this.STROKE_STYLE_BODY_HITBOX,
            HITBOX_STROKE_WIDTH
        );
        this.player_one_action_hitbox = this.addRectangleHelper(
            this.STROKE_STYLE_ACTION_HITBOX,
            HITBOX_STROKE_WIDTH
        );
        this.player_two_action_hitbox = this.addRectangleHelper(
            this.STROKE_STYLE_ACTION_HITBOX,
            HITBOX_STROKE_WIDTH
        );

        this.player_one_body_hitbox_text = this.addTextHelper();
        this.player_two_body_hitbox_text = this.addTextHelper();
        this.player_one_action_hitbox_text = this.addTextHelper();
        this.player_two_action_hitbox_text = this.addTextHelper();

        this.cameras.main.centerOn(0, yDisplacementFromCenterToGround);
        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.initializeCameraSettings();

        this.endTextP1Won = this.createCenteredText('');
        this.endTextP1Won.setVisible(false);

        this.endTextP2Won = this.createCenteredText('');
        this.endTextP2Won.setVisible(false);

        this.endTextDraw = this.createCenteredText('');
        this.endTextDraw.setVisible(false);
    }
    create() {
        this.intitialize();
    }

    addRectangleHelper(strokeStyle: number, stokeWidth: number) {
        const rect = this.add.rectangle(0, 0, 0, 0);
        rect.setStrokeStyle(stokeWidth, strokeStyle);
        rect.setFillStyle(0, 0.3);
        return rect;
    }

    addTextHelper() {
        const text = this.add.text(0, 0, '');
        text.setFontSize(12).setAlign('center');
        return text;
    }

    setPlayerOneCharacter(characterType: number) {
        const characterName = characterType == 0 ? 'jessica' : 'antoc';
        this.player_one_character = characterName;
    }

    setPlayerTwoCharacter(characterType: number) {
        const characterName = characterType == 0 ? 'jessica' : 'antoc';
        this.player_two_character = characterName;
    }

    setPlayerOneFrame(frame: FrameLike) {
        this.setPlayerFrameHelper(
            frame,
            this.player_one,
            this.player_one_character
        );
    }

    setPlayerTwoFrame(frame: FrameLike) {
        this.setPlayerFrameHelper(
            frame,
            this.player_two,
            this.player_two_character
        );
    }

    private setPlayerFrameHelper(
        frame: FrameLike,
        player: Phaser.GameObjects.Image,
        characterName: string
    ) {
        // Extract from frame
        const bodyState = frame.body_state.state;
        const bodyStateCounter = frame.body_state.counter;
        const bodyStateDir = frame.body_state.dir;
        const physicsState = frame.physics_state;
        const pos = physicsState.pos;
        const hitboxW = frame.hitboxes.body.dimension.x;

        const bodyStateName = bodyStateNumberToName[characterName][bodyState];
        const direction = bodyStateDir == 1 ? 'right' : 'left';

        //Calculating offsets for frame
        const spriteAdjustments =
            spriteDataPhaser[characterName][bodyStateName];
        const spriteAdjustment =
            spriteAdjustments.length == 1
                ? spriteAdjustments[0]
                : spriteAdjustments[bodyStateCounter]; // if having more than one adjustments, use body counter to index the adjustments
        const spriteSize = spriteAdjustment?.size || [0, 0];
        const spriteLeftAdjustment =
            spriteAdjustment?.hitboxOffset[direction][0] || 0;
        const spriteTopAdjustment =
            spriteAdjustment?.hitboxOffset[direction][1] || 0;

        player.setX(pos.x + spriteLeftAdjustment - hitboxW / 2);
        player.setY(-pos.y + spriteTopAdjustment);

        console.log(
            'setTexture:',
            characterName,
            bodyStateName,
            bodyStateCounter
        );
        player.setTexture(
            `${characterName}-${bodyStateName}`,
            `frame_${bodyStateCounter}.png`
        );
    }

    private setPlayerOneBodyHitbox(frame: FrameLike) {
        this.setHitboxHelper(
            frame.hitboxes.body,
            this.player_one_body_hitbox,
            this.player_one_body_hitbox_text,
            false
        );
    }

    private setPlayerTwoBodyHitbox(frame: FrameLike) {
        this.setHitboxHelper(
            frame.hitboxes.body,
            this.player_two_body_hitbox,
            this.player_two_body_hitbox_text,
            false
        );
    }

    private setPlayerOneActionHitbox(frame: FrameLike) {
        this.setHitboxHelper(
            frame.hitboxes.action,
            this.player_one_action_hitbox,
            this.player_one_action_hitbox_text,
            true
        );
    }

    private setPlayerTwoActionHitbox(frame: FrameLike) {
        this.setHitboxHelper(
            frame.hitboxes.action,
            this.player_two_action_hitbox,
            this.player_two_action_hitbox_text,
            true
        );
    }

    private setHitboxHelper(
        hitbox: Rectangle,
        phaserHitbox: Phaser.GameObjects.Rectangle,
        phaserText: Phaser.GameObjects.Text,
        is_action: boolean
    ) {
        const hitboxW = hitbox.dimension.x;
        const hitboxH = hitbox.dimension.y;
        const hitboxX = hitbox.origin.x;
        const hitboxY = hitbox.origin.y;

        // const centerX =  hitboxX
        // const centerY = is_action ? - hitboxH : - hitboxY - hitbox.dimension.y / 2
        const topLeftX = hitboxX;
        const topLeftY = -(hitboxY + hitboxH);
        // const topLeftX = 0;
        // const topLeftY = 0;

        phaserHitbox.setPosition(topLeftX, topLeftY);
        phaserHitbox.setSize(hitboxW, hitboxH);
        phaserText.setText(`(${hitboxX},${hitboxY})\n${hitboxW}x${hitboxH}`);
        Phaser.Display.Align.In.Center(phaserText, phaserHitbox);
        phaserText.setPosition(
            Math.floor(phaserText.x + hitbox.dimension.x / 2),
            Math.floor(phaserText.y + hitbox.dimension.y / 2)
        );
    }

    private showDebug() {
        this.player_one_body_hitbox.setVisible(true);
        this.player_two_body_hitbox.setVisible(true);
        this.player_one_action_hitbox.setVisible(true);
        this.player_two_action_hitbox.setVisible(true);

        this.player_one_body_hitbox_text.setVisible(true);
        this.player_two_body_hitbox_text.setVisible(true);
        this.player_one_action_hitbox_text.setVisible(true);
        this.player_two_action_hitbox_text.setVisible(true);
    }

    private hideDebug() {
        this.player_one_body_hitbox.setVisible(false);
        this.player_two_body_hitbox.setVisible(false);
        this.player_one_action_hitbox.setVisible(false);
        this.player_two_action_hitbox.setVisible(false);

        this.player_one_body_hitbox_text.setVisible(false);
        this.player_two_body_hitbox_text.setVisible(false);
        this.player_one_action_hitbox_text.setVisible(false);
        this.player_two_action_hitbox_text.setVisible(false);
    }

    private adjustCamera(charOneX: number, charTwoX: number) {
        const camera = this.cameras.main;

        const charDistance =
            charOneX < charTwoX
                ? Math.abs(charOneX - charTwoX)
                : Math.abs(charTwoX - charOneX);
        const leftCharX = charOneX < charTwoX ? charOneX : charTwoX;

        // At the closest distance zoom is default, at further distances we zoom out till .9
        const calculatedZoom =
            charDistance < 400
                ? DEFAULT_ZOOM
                : DEFAULT_ZOOM - 0.3 * (charDistance / 800);
        camera.zoomTo(calculatedZoom, CAMERA_REACTION_TIME);

        // pan to midpoint between characters
        camera.pan(
            leftCharX + charDistance / 2 + DEFAULT_CAMERA_CENTER_X,
            DEFAULT_CAMERA_CENTER_Y,
            CAMERA_REACTION_TIME
        );
    }

    updateSceneFromFrame({
        testJson,
        animationFrame,
        animationState,
        showDebug,
    }: SimulatorProps) {
        const characterType0 = testJson?.agent_0.type;
        const characterType1 = testJson?.agent_1.type;
        const agentFrame0 = testJson?.agent_0.frames[animationFrame];
        const agentFrame1 = testJson?.agent_1.frames[animationFrame];
        const fightLength = testJson?.agent_0.frames.length;

        this.updateScene(
            characterType0,
            characterType1,
            agentFrame0,
            agentFrame1,
            animationFrame == 0,
            showDebug,
            animationFrame == fightLength - 1
        );
    }

    updateScene(
        characterType0: number,
        characterType1: number,
        agentFrame0: FrameLike,
        agentFrame1: FrameLike,
        isBeginning: boolean = true,
        showDebug: boolean = false,
        isLast: boolean = false
    ) {
        this.setPlayerOneCharacter(characterType0);
        this.setPlayerTwoCharacter(characterType1);
        this.setPlayerOneFrame(agentFrame0);
        this.setPlayerTwoFrame(agentFrame1);

        if (isLast) {
            const integrity_P1 = agentFrame0.body_state.integrity;
            const integrity_P2 = agentFrame1.body_state.integrity;
            if (integrity_P1 < integrity_P2) {
                this.endTextP2Won = this.createCenteredText('Player 2 won!');
                this.endTextP2Won.setVisible(true);
            } else if (integrity_P1 > integrity_P2) {
                this.endTextP1Won = this.createCenteredText('Player 1 won!');
                this.endTextP1Won.setVisible(true);
            } else {
                this.endTextDraw = this.createCenteredText('Draw!');
                this.endTextDraw.setVisible(true);
            }
        } else {
            this.endTextDraw.setVisible(false);
            this.endTextP1Won.setVisible(false);
            this.endTextP2Won.setVisible(false);

            if (isBeginning) {
                this.initializeCameraSettings();
            } else {
                this.adjustCamera(
                    agentFrame0.physics_state.pos.x,
                    agentFrame1.physics_state.pos.x
                );
            }
        }

        if (showDebug) {
            this.showDebug();
            this.setPlayerOneBodyHitbox(agentFrame0);
            this.setPlayerTwoBodyHitbox(agentFrame1);
            this.setPlayerOneActionHitbox(agentFrame0);
            this.setPlayerTwoActionHitbox(agentFrame1);
        } else {
            this.hideDebug();
        }
    }
}
