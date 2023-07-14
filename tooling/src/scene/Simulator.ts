import Phaser from 'phaser';
import {
    bodyStateNumberToName,
    LEFT,
    PHASER_CANVAS_W,
    RIGHT,
} from '../constants/constants';
import { spriteDataPhaser } from '../constants/sprites';
import {
    FrameLike,
    RealTimeFrameScene,
    Rectangle,
    StimulusType,
    STIMULUS_ENCODING,
} from '../types/Frame';
import { SimulatorProps } from '../types/Simulator';
import { GameModes } from '../types/Simulator';
import { IShoshinWASMContext } from '../context/wasm-shoshin';
import { BodystatesAntoc, BodystatesJessica } from '../types/Condition';
import eventsCenter from '../Game/EventsCenter';
import { Body } from 'matter';
import { statsInfo } from './UI';

const ARENA_WIDTH = 1600;
const DEFAULT_ZOOM = 2.4;

const DEFAULT_CAMERA_HEIGHT = 400;
const DEFAULT_CAMERA_CENTER_X = 25;
const DEFAULT_CAMERA_CENTER_Y = -100;
const DEFAULT_CAMERA_LEFT = -ARENA_WIDTH / 2;
const DEFAULT_CAMERA_TOP = DEFAULT_CAMERA_CENTER_Y - DEFAULT_CAMERA_HEIGHT / 2;
const CAMERA_REACTION_TIME = 50;

const HITBOX_STROKE_WIDTH = 1.5;

const PLAYER_POINTER_DIM = 20;

// Effects
const DASH_SMOKE_SCALE = 0.1;
const STEP_FORWARD_SMOKE_SCALE = 0.07;
const JUMP_TAKEOFF_SMOKE_SCALE_X = 0.7;
const JUMP_TAKEOFF_SMOKE_SCALE_Y = 0.7;
const JUMP_SMOKE_SCALE_X = 0.1;
const JUMP_SMOKE_SCALE_Y = 0.09;

enum CombatEvent {
    Block = 'Block',
    Clash = 'Clash',
    Combo = 'Combo',
}

interface BattleEvent {
    frameIndex: number;
    event: CombatEvent;
    eventCount: number;
}

interface PlayerPointer {
    cir: Phaser.GameObjects.Arc;
    text: Phaser.GameObjects.Text;
}
const setPlayerPointerVisible = (
    playerPointer: PlayerPointer,
    visible: boolean
) => {
    playerPointer.cir.setVisible(visible);
    playerPointer.text.setVisible(visible);
};

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

    player_pointers: PlayerPointer[];

    player_one_combat_log: BattleEvent;
    player_two_combat_log: BattleEvent;

    readonly STROKE_STYLE_BODY_HITBOX = 0x7cfc00; //0xFEBA4F;
    readonly STROKE_STYLE_ACTION_HITBOX = 0xff2400; //0xFB4D46;

    // VFX
    sparkSprites: Phaser.GameObjects.Sprite[];
    dashSmokeSprites: Phaser.GameObjects.Sprite[];
    stepForwardSmokeSprites: Phaser.GameObjects.Sprite[];
    jumpTakeoffSmokeSprites: Phaser.GameObjects.Sprite[];
    jumpLandingSmokeSprites: Phaser.GameObjects.Sprite[];

    // SFX
    dashForwardSounds: Phaser.Sound.BaseSound[];
    dashBackwardSounds: Phaser.Sound.BaseSound[];
    slashSounds: Phaser.Sound.BaseSound[];
    upswingSounds: Phaser.Sound.BaseSound[];
    sidecutSounds: Phaser.Sound.BaseSound[];
    gatotsuSounds: Phaser.Sound.BaseSound[];
    horiSounds: Phaser.Sound.BaseSound[];
    vertSounds: Phaser.Sound.BaseSound[];
    clashSounds: Phaser.Sound.BaseSound[];
    antocHurtSounds: Phaser.Sound.BaseSound[];
    antocKnockedSounds: Phaser.Sound.BaseSound[];
    antocLaunchedSounds: Phaser.Sound.BaseSound[];
    antocJumpSounds: Phaser.Sound.BaseSound[];
    jessicaHurtSounds: Phaser.Sound.BaseSound[];
    jessicaKnockedSounds: Phaser.Sound.BaseSound[];
    jessicaJumpSounds: Phaser.Sound.BaseSound[];
    jessicaLaunchedSounds: Phaser.Sound.BaseSound[];
    lowKickHitSounds: Phaser.Sound.BaseSound[];
    landingSounds: Phaser.Sound.BaseSound[];
    landingFromKnockedSounds: Phaser.Sound.BaseSound[];
    katanaHitSounds: Phaser.Sound.BaseSound[];
    greatSwordHitSounds: Phaser.Sound.BaseSound[];

    player_one_action_confirm = false;
    player_two_action_confirm = false;

    last_accessed_frame = 0;

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
        this.load.atlas(
            `antoc-low_kick`,
            'images/antoc/low_kick/spritesheet.png',
            'images/antoc/low_kick/spritesheet.json'
        );
        this.load.atlas(
            `antoc-drop_slash`,
            'images/antoc/drop_slash/spritesheet.png',
            'images/antoc/drop_slash/spritesheet.json'
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
        this.load.atlas(
            `jessica-low_kick`,
            'images/jessica/low_kick/spritesheet.png',
            'images/jessica/low_kick/spritesheet.json'
        );
        this.load.atlas(
            `jessica-birdswing`,
            'images/jessica/birdswing/spritesheet.png',
            'images/jessica/birdswing/spritesheet.json'
        );

        this.load.image(
            'arena_bg',
            'images/bg/shoshin-bg-large-transparent.png'
        );

        // VFX
        this.load.spritesheet('spark', 'images/effects/spark/spritesheet.png', {
            frameWidth: 730,
            frameHeight: 731,
        });
        this.load.spritesheet(
            'dash-smoke',
            'images/effects/dash-smoke/spritesheet.png',
            {
                frameWidth: 1251,
                frameHeight: 1251,
            }
        );
        this.load.spritesheet('smoke', 'images/effects/smoke/spritesheet.png', {
            frameWidth: 1182,
            frameHeight: 1182,
        });
        this.load.spritesheet(
            'jump-takeoff-smoke',
            'images/effects/jump-takeoff-smoke/spritesheet.png',
            {
                frameWidth: 201,
                frameHeight: 201,
            }
        );

        // SFX
        this.load.audio('dash-forward-sound', 'sounds/dash/forward.mp3');
        this.load.audio('dash-backward-sound', 'sounds/dash/backward.mp3');
        this.load.audio('katana-sound-1', 'sounds/weapon/katana-1.mp3');
        this.load.audio('katana-sound-2', 'sounds/weapon/katana-2.mp3');
        this.load.audio('katana-sound-3', 'sounds/weapon/katana-3.mp3');
        this.load.audio(
            'great-sword-sound-1',
            'sounds/weapon/great-sword-1.mp3'
        );
        this.load.audio(
            'great-sword-sound-2',
            'sounds/weapon/great-sword-2.mp3'
        );
        this.load.audio(
            'great-sword-sound-3',
            'sounds/weapon/great-sword-3.mp3'
        );
        this.load.audio('gatotsu-sound', 'sounds/weapon/gatotsu-sound.mp3');
        this.load.audio('clash-sound', 'sounds/weapon/clash.wav');
        this.load.audio('antoc-hurt-sound', 'sounds/hurt/antoc-hurt.mp3');
        this.load.audio('jessica-hurt-sound', 'sounds/hurt/jessica-hurt.wav');
        this.load.audio(
            'antoc-knocked-sound',
            'sounds/knocked/antoc-knocked.mp3'
        );
        this.load.audio(
            'jessica-knocked-sound',
            'sounds/hurt/jessica-hurt.wav'
        );
        this.load.audio(
            'antoc-launched-sound',
            'sounds/launched/antoc-launched.wav'
        );
        this.load.audio(
            'jessica-launched-sound',
            'sounds/hurt/jessica-hurt.wav'
        );
        this.load.audio('antoc-jump-sound', 'sounds/jump/antoc-jump.wav');
        this.load.audio('jessica-jump-sound', 'sounds/jump/jessica-jump.wav');
        this.load.audio('low-kick-hit-sound', 'sounds/weapon/kick.ogg');
        this.load.audio('landing-from-jump-sound', 'sounds/jump/landing.wav');
        this.load.audio(
            'landing-from-knocked-sound',
            'sounds/hurt/landing-from-knocked.m4a'
        );
        this.load.audio('katana-cut-sound', 'sounds/weapon/katana-cut.wav');
    }

    scaledZoom: number = DEFAULT_ZOOM;

    initializeCameraSettings() {
        // Initial camera setup
        // reference: https://stackoverflow.com/questions/56289506/phaser-3-how-to-create-smooth-zooming-effect
        this.cameras.main.pan(
            DEFAULT_CAMERA_CENTER_X,
            DEFAULT_CAMERA_CENTER_Y,
            500,
            'Power2'
        );

        this.scaledZoom =
            DEFAULT_ZOOM * (+this.game.config.width / PHASER_CANVAS_W);
        this.cameras.main.zoomTo(this.scaledZoom, 500);

        this.scale.on(
            'resize',
            (gameSize, baseSize, displaySize, resolution) => {
                // Update camera dimensions based on new canvas size
                this.scaledZoom =
                    DEFAULT_ZOOM * (displaySize.width / PHASER_CANVAS_W);
            }
        );

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

    initializeVFX() {
        this.anims.create({
            key: 'sparkAnim',
            frameRate: 30,
            frames: this.anims.generateFrameNumbers('spark', {
                start: 0,
                end: 6,
            }),
            repeat: 0,
            hideOnComplete: true, // this setting makes the animation hide itself (setVisible false) on completion
        });

        this.anims.create({
            key: 'dashSmokeAnim',
            frameRate: 20,
            frames: this.anims.generateFrameNumbers('dash-smoke', {
                start: 0,
                end: 5,
            }),
            repeat: 0,
            hideOnComplete: true, // this setting makes the animation hide itself (setVisible false) on completion
        });

        this.anims.create({
            key: 'smokeAnim',
            frameRate: 20,
            frames: this.anims.generateFrameNumbers('smoke', {
                start: 0,
                end: 8,
            }),
            repeat: 0,
            hideOnComplete: true, // this setting makes the animation hide itself (setVisible false) on completion
        });

        this.anims.create({
            key: 'jumpTakeoffSmokeAnim',
            frameRate: 20,
            frames: this.anims.generateFrameNumbers('jump-takeoff-smoke', {
                start: 0,
                end: 7,
            }),
            repeat: 0,
            hideOnComplete: true, // this setting makes the animation hide itself (setVisible false) on completion
        });

        this.sparkSprites = [];
        this.dashSmokeSprites = [];
        this.stepForwardSmokeSprites = [];
        this.jumpTakeoffSmokeSprites = [];
        this.jumpLandingSmokeSprites = [];
        [0, 1].forEach((_) => {
            this.sparkSprites.push(
                this.add
                    .sprite(0, 0, 'spark')
                    .setScale(0.2)
                    .setVisible(false)
                    .setAlpha(0.9)
                    .setDepth(100)
            );
            this.dashSmokeSprites.push(
                this.add
                    .sprite(0, 0, 'dash-smoke')
                    .setScale(DASH_SMOKE_SCALE)
                    .setVisible(false)
                    .setAlpha(1.0)
                    .setDepth(100)
                    .setFlipX(true)
            );

            this.stepForwardSmokeSprites.push(
                this.add
                    .sprite(0, 0, 'dash-smoke')
                    .setScale(STEP_FORWARD_SMOKE_SCALE)
                    .setVisible(false)
                    .setTint(0xff0000)
                    .setAlpha(1.0)
                    .setDepth(100)
                    .setFlipX(true)
            );

            this.jumpTakeoffSmokeSprites.push(
                this.add
                    .sprite(0, 0, 'jump-takeoff-smoke')
                    .setScale(
                        JUMP_TAKEOFF_SMOKE_SCALE_X,
                        JUMP_TAKEOFF_SMOKE_SCALE_Y
                    )
                    .setVisible(false)
                    .setAlpha(0.95)
                    .setDepth(100)
            );

            this.jumpLandingSmokeSprites.push(
                this.add
                    .sprite(0, 0, 'smoke')
                    .setScale(JUMP_SMOKE_SCALE_X, JUMP_SMOKE_SCALE_Y)
                    .setVisible(false)
                    .setAlpha(0.9)
                    .setDepth(100)
            );
        });
    }

    initializeSFX() {
        this.dashForwardSounds = [];
        this.dashBackwardSounds = [];
        this.slashSounds = [];
        this.upswingSounds = [];
        this.sidecutSounds = [];
        this.horiSounds = [];
        this.vertSounds = [];
        this.clashSounds = [];
        this.gatotsuSounds = [];
        this.antocJumpSounds = [];
        this.jessicaJumpSounds = [];
        this.antocHurtSounds = [];
        this.jessicaHurtSounds = [];
        this.antocKnockedSounds = [];
        this.jessicaKnockedSounds = [];
        this.antocLaunchedSounds = [];
        this.jessicaLaunchedSounds = [];
        this.lowKickHitSounds = [];
        this.landingSounds = [];
        this.landingFromKnockedSounds = [];
        this.katanaHitSounds = [];
        this.greatSwordHitSounds = [];
        [0, 1].forEach((_) => {
            this.dashForwardSounds.push(this.sound.add('dash-forward-sound'));
            this.dashBackwardSounds.push(this.sound.add('dash-backward-sound'));

            this.slashSounds.push(this.sound.add('katana-sound-1'));
            this.upswingSounds.push(this.sound.add('katana-sound-2'));
            this.sidecutSounds.push(this.sound.add('katana-sound-3'));
            this.horiSounds.push(this.sound.add('great-sword-sound-1'));
            this.vertSounds.push(this.sound.add('great-sword-sound-2'));
            this.gatotsuSounds.push(this.sound.add('gatotsu-sound'));

            this.clashSounds.push(this.sound.add('clash-sound'));

            this.antocJumpSounds.push(this.sound.add('antoc-jump-sound'));
            this.jessicaJumpSounds.push(this.sound.add('jessica-jump-sound'));

            this.antocHurtSounds.push(this.sound.add('antoc-hurt-sound'));
            this.jessicaHurtSounds.push(this.sound.add('jessica-hurt-sound'));
            this.antocKnockedSounds.push(this.sound.add('antoc-knocked-sound'));
            this.jessicaKnockedSounds.push(
                this.sound.add('jessica-knocked-sound')
            );
            this.antocLaunchedSounds.push(
                this.sound.add('antoc-launched-sound')
            );
            this.jessicaLaunchedSounds.push(
                this.sound.add('jessica-launched-sound')
            );
            this.lowKickHitSounds.push(this.sound.add('low-kick-hit-sound'));
            this.landingSounds.push(this.sound.add('landing-from-jump-sound'));
            this.landingFromKnockedSounds.push(
                this.sound.add('landing-from-knocked-sound')
            );
            this.katanaHitSounds.push(this.sound.add('katana-cut-sound'));
            this.greatSwordHitSounds.push(this.sound.add('katana-cut-sound'));
        });
    }

    initialize() {
        this.initializeVFX();
        this.initializeSFX();

        const yDisplacementFromCenterToGround = -150;
        let bg = this.add.image(0, 20, 'arena_bg');
        bg.setScale(0.3, 0.2).setPosition(
            0,
            bg.y + yDisplacementFromCenterToGround
        );
        // console.log('bg x, ', bg.x);
        // console.log('bg y ', bg.y);

        const outOfBoundX = 2000;
        this.player_one = this.add.sprite(-outOfBoundX, 0, `antoc-idle`, 0);
        this.player_two = this.add.sprite(outOfBoundX, 0, `antoc-idle`, 0);
        this.player_two.setFlipX(true);

        this.player_one_body_hitbox = this.addRectangleHelper(
            this.STROKE_STYLE_BODY_HITBOX,
            HITBOX_STROKE_WIDTH,
            0x0,
            0.4
        );
        this.player_two_body_hitbox = this.addRectangleHelper(
            this.STROKE_STYLE_BODY_HITBOX,
            HITBOX_STROKE_WIDTH,
            0x0,
            0.4
        );
        this.player_one_action_hitbox = this.addRectangleHelper(
            this.STROKE_STYLE_ACTION_HITBOX,
            HITBOX_STROKE_WIDTH,
            0x0,
            0.4
        );
        this.player_two_action_hitbox = this.addRectangleHelper(
            this.STROKE_STYLE_ACTION_HITBOX,
            HITBOX_STROKE_WIDTH,
            0x0,
            0.4
        );

        this.player_pointers = [];
        [0, 1].forEach((index) => {
            const cir = this.addCircleHelper(
                0x0,
                1,
                index == 0 ? 0xff0000 : 0x0000ff,
                0.6
            );
            const text = this.addTextHelper('0x555');
            const playerPointer = {
                cir: cir,
                text: text,
            };
            this.player_pointers.push(playerPointer);
        });

        this.player_one_body_hitbox_text = this.addTextHelper('0xfff');
        this.player_two_body_hitbox_text = this.addTextHelper('0xfff');
        this.player_one_action_hitbox_text = this.addTextHelper('0xfff');
        this.player_two_action_hitbox_text = this.addTextHelper('0xfff');

        this.cameras.main.centerOn(0, yDisplacementFromCenterToGround);
        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.initializeCameraSettings();
    }
    create() {
        this.initialize();
    }

    addRectangleHelper(
        strokeStyle: number,
        strokeWidth: number,
        colorHex: number,
        alpha: number
    ) {
        const rect = this.add.rectangle(0, 0, 0, 0);
        if (strokeWidth > 0) rect.setStrokeStyle(strokeWidth, strokeStyle);
        rect.setFillStyle(colorHex, alpha);
        return rect;
    }

    addCircleHelper(
        strokeStyle: number,
        strokeWidth: number,
        colorHex: number,
        alpha: number
    ) {
        const cir = this.add.circle(0, 0, 0);
        if (strokeWidth > 0) cir.setStrokeStyle(strokeWidth, strokeStyle);
        cir.setFillStyle(colorHex, alpha);
        return cir;
    }

    addTriangleHelper(
        strokeStyle: number,
        strokeWidth: number,
        colorHex: number,
        alpha: number
    ) {
        const tri = this.add.isotriangle(0, 0, 20, 20, true);
        if (strokeWidth > 0) tri.setStrokeStyle(strokeWidth, strokeStyle);
        tri.setFillStyle(colorHex, alpha);
        return tri;
    }

    addTextHelper(colorHexString: string) {
        const text = this.add.text(0, 0, '', { color: '#fff' });
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

        let bodyStateName = bodyStateNumberToName[characterName][bodyState];
        if (bodyStateName == 'launched') bodyStateName = 'knocked'; // launched uses the animation of knocked
        if (bodyStateName.includes('jump')) bodyStateName = 'jump'; // jump / jump_move_forward / jump_move_backward all use the animation of jump
        const direction = bodyStateDir == 1 ? 'right' : 'left';
        // console.log(
        //     'characterName',
        //     characterName,
        //     'bodyState',
        //     bodyState,
        //     'bodyStateName',
        //     bodyStateName
        // );
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

        player.setTexture(
            `${characterName}-${bodyStateName}`,
            `frame_${bodyStateCounter}.png`
        );

        // TODO: handle direction switching
        if (direction == 'right') {
            player.setFlipX(false);
        } else {
            player.setFlipX(true);
        }
    }

    private setPlayerOnePointer(frame: FrameLike) {
        this.setPointerHelper(
            frame.hitboxes.body,
            this.player_pointers[0],
            'P1'
        );
    }
    private setPlayerTwoPointer(frame: FrameLike) {
        this.setPointerHelper(
            frame.hitboxes.body,
            this.player_pointers[1],
            'P2'
        );
    }

    private setPointerHelper(
        hitbox: Rectangle,
        playerPointer: PlayerPointer,
        text: string
    ) {
        const hitboxW = hitbox.dimension.x;
        const hitboxH = hitbox.dimension.y;
        const hitboxX = hitbox.origin.x;
        const hitboxY = hitbox.origin.y;
        const topLeftX = hitboxX + (hitboxW - PLAYER_POINTER_DIM) / 2;
        const topLeftY = -(hitboxY + hitboxH + PLAYER_POINTER_DIM + 10);

        if (hitboxW * hitboxH == 0) playerPointer.cir.setRadius(0);
        else playerPointer.cir.setRadius(PLAYER_POINTER_DIM / 2);
        playerPointer.cir.setPosition(
            topLeftX + PLAYER_POINTER_DIM / 2,
            topLeftY + PLAYER_POINTER_DIM / 2
        );

        playerPointer.text.setText(text);
        Phaser.Display.Align.In.Center(playerPointer.text, playerPointer.cir);
        playerPointer.text.setPosition(
            Math.floor(playerPointer.text.x + 1),
            Math.floor(playerPointer.text.y + 1)
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

        const topLeftX = hitboxX;
        const topLeftY = -(hitboxY + hitboxH);

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

        [0, 1].forEach((index) => {
            setPlayerPointerVisible(this.player_pointers[index], true);
        });
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

        [0, 1].forEach((index) => {
            setPlayerPointerVisible(this.player_pointers[index], false);
        });
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
                ? this.scaledZoom
                : this.scaledZoom - 0.3 * (charDistance / 800);
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
        const agentPrevFrame0 =
            testJson?.agent_0.frames[
                animationFrame == 0 ? 0 : animationFrame - 1
            ];
        const agentPrevFrame1 =
            testJson?.agent_1.frames[
                animationFrame == 0 ? 0 : animationFrame - 1
            ];
        const agentFrame0 = testJson?.agent_0.frames[animationFrame];
        const agentFrame1 = testJson?.agent_1.frames[animationFrame];
        const fightLength = testJson?.agent_0.frames.length;

        this.updateScene(
            characterType0,
            characterType1,
            agentPrevFrame0,
            agentPrevFrame1,
            agentFrame0,
            agentFrame1,
            animationFrame == 0,
            showDebug,
            animationFrame == fightLength - 1
        );

        this.battleText(
            characterType0,
            characterType1,
            agentFrame0,
            agentFrame1,
            animationFrame
        );

        const rewound = this.last_accessed_frame > animationFrame;
        this.last_accessed_frame = animationFrame;
        if (
            this.player_one_combat_log?.frameIndex + 50 <= animationFrame ||
            rewound
        ) {
            eventsCenter.emit('player-event-remove', 1);
            this.player_one_combat_log = undefined;
        }
        if (
            this.player_two_combat_log?.frameIndex + 50 <= animationFrame ||
            rewound
        ) {
            eventsCenter.emit('player-event-remove', 2);
            this.player_two_combat_log = undefined;
        }

        if (agentFrame0.body_state.counter == 0) {
            this.player_one_action_confirm = false;
        }

        if (agentFrame1.body_state.counter == 0) {
            this.player_two_action_confirm = false;
        }
    }

    updateEffects(prevFrames, frames: FrameLike[]) {
        //
        // attack sounds
        //
        const attackBodyStateCounterPairs = [
            { state: BodystatesAntoc.HorizontalSwing, counter: 1 },
            { state: BodystatesAntoc.VerticalSwing, counter: 3 },
            { state: BodystatesAntoc.DropSlash, counter: 3 },
            { state: BodystatesJessica.Slash, counter: 2 },
            { state: BodystatesJessica.Upswing, counter: 2 },
            { state: BodystatesJessica.Sidecut, counter: 2 },
            { state: BodystatesJessica.BirdSwing, counter: 3 },
            { state: BodystatesJessica.Gatotsu, counter: 3 },
            { state: BodystatesJessica.LowKick, counter: 3 },
            { state: BodystatesAntoc.LowKick, counter: 3 },
        ];
        [0, 1].forEach((playerIndex) => {
            attackBodyStateCounterPairs.forEach((pair) => {
                if (
                    frames[playerIndex].body_state.state == pair.state &&
                    frames[playerIndex].body_state.counter == pair.counter
                ) {
                    if (pair.state == BodystatesAntoc.HorizontalSwing)
                        this.horiSounds[playerIndex].play();
                    else if (pair.state == BodystatesAntoc.VerticalSwing)
                        this.vertSounds[playerIndex].play();
                    else if (pair.state == BodystatesAntoc.DropSlash)
                        this.vertSounds[playerIndex].play();
                    else if (pair.state == BodystatesJessica.Slash)
                        this.slashSounds[playerIndex].play();
                    else if (pair.state == BodystatesJessica.Upswing)
                        this.upswingSounds[playerIndex].play();
                    else if (pair.state == BodystatesJessica.Sidecut)
                        this.sidecutSounds[playerIndex].play();
                    else if (pair.state == BodystatesJessica.BirdSwing)
                        this.sidecutSounds[playerIndex].play();
                    else if (pair.state == BodystatesJessica.Gatotsu)
                        this.gatotsuSounds[playerIndex].play();
                    else if (pair.state == BodystatesJessica.LowKick)
                        this.dashBackwardSounds[playerIndex].play();
                    else if (pair.state == BodystatesAntoc.LowKick)
                        this.dashBackwardSounds[playerIndex].play();
                }
            });
        });

        //
        // spark & clash
        //
        const clashBodyStates: number[] = [
            BodystatesAntoc.Clash,
            BodystatesJessica.Clash,
        ];
        const jessicaHitBodyStates: number[] = [
            BodystatesJessica.Hurt,
            BodystatesJessica.Knocked,
            BodystatesJessica.Launched,
        ];
        const antocHitBodyStates: number[] = [
            BodystatesAntoc.Hurt,
            BodystatesAntoc.Knocked,
            BodystatesAntoc.Launched,
        ];
        const hitBodyStates = jessicaHitBodyStates.concat(antocHitBodyStates);
        const sparkBodyStates = hitBodyStates.concat(clashBodyStates);

        [
            [0, 1],
            [1, 0],
        ].forEach((e) => {
            const subjectIndex = e[0];
            const objectIndex = e[1];
            const subjectPrevFrame: FrameLike = prevFrames[subjectIndex];
            const objectPrevFrame: FrameLike = prevFrames[objectIndex];

            const subjectFrame: FrameLike = frames[subjectIndex];
            const objectFrame: FrameLike = frames[objectIndex];

            // if subject body state matches one of sparkBodyStates, and subject body counter==0 (first frame)
            if (
                sparkBodyStates.includes(subjectFrame.body_state.state) &&
                subjectFrame.body_state.counter == 0
            ) {
                // position spark effect's x at x-center of the attacked (subject) body
                const x =
                    subjectFrame.hitboxes.body.origin.x +
                    subjectFrame.hitboxes.body.dimension.x / 2;

                // position spark effect's y at the y of the attacker's (object) action hitbox y-center in the previous frame (when the hit registered),
                // upperbounded by the head of the attacked
                // note: phaser's y axis points downward on screen
                const yAttackAction =
                    objectPrevFrame.hitboxes.action.origin.y +
                    objectPrevFrame.hitboxes.action.dimension.y / 2;
                const yAttackedHead =
                    subjectFrame.hitboxes.body.origin.y +
                    subjectFrame.hitboxes.body.dimension.y;
                const y = -1 * Math.min(yAttackAction, yAttackedHead);

                // console.log('Play spark at', x, y);
                this.sparkSprites[subjectIndex]
                    .setPosition(x, y)
                    .setVisible(true)
                    .play('sparkAnim');

                if (clashBodyStates.includes(subjectFrame.body_state.state)) {
                    this.clashSounds[subjectIndex].play();
                }

                if (subjectFrame.body_state.state == BodystatesAntoc.Hurt)
                    this.antocHurtSounds[subjectIndex].play();
                else if (
                    subjectFrame.body_state.state == BodystatesAntoc.Knocked
                )
                    this.antocKnockedSounds[subjectIndex].play();
                else if (
                    subjectFrame.body_state.state == BodystatesAntoc.Launched
                )
                    this.antocLaunchedSounds[subjectIndex].play();
                else if (
                    subjectFrame.body_state.state == BodystatesJessica.Hurt
                )
                    this.jessicaHurtSounds[subjectIndex].play();
                else if (
                    subjectFrame.body_state.state == BodystatesJessica.Knocked
                )
                    this.jessicaKnockedSounds[subjectIndex].play();
                else if (
                    subjectFrame.body_state.state == BodystatesJessica.Launched
                )
                    this.jessicaLaunchedSounds[subjectIndex].play();

                if (hitBodyStates.includes(subjectFrame.body_state.state)) {
                    if (
                        [
                            BodystatesAntoc.LowKick,
                            BodystatesJessica.LowKick,
                        ].includes(objectPrevFrame.body_state.state)
                    ) {
                        this.lowKickHitSounds[subjectIndex].play();
                    } else if (
                        antocHitBodyStates.includes(
                            objectPrevFrame.body_state.state
                        )
                    ) {
                        this.greatSwordHitSounds[objectIndex].play();
                    } else {
                        this.katanaHitSounds[objectIndex].play();
                    }
                }
            }
        });

        //
        // dash-smoke
        //
        const dashForwardBodyStates = [
            BodystatesJessica.DashForward,
            BodystatesAntoc.DashForward,
        ];
        const dashBackwardBodyStates = [
            BodystatesJessica.DashBackward,
            BodystatesAntoc.DashBackward,
        ];
        const dashBodyStates = dashForwardBodyStates.concat(
            dashBackwardBodyStates
        );
        [0, 1].forEach((playerIndex) => {
            // get frame and qualify
            const frame = frames[playerIndex];
            if (frame.body_state.counter != 0) return;
            if (!dashBodyStates.includes(frame.body_state.state)) return;

            // configure sprite
            const x =
                frame.body_state.dir == RIGHT
                    ? frame.physics_state.pos.x +
                      (frame.body_state.state ==
                          BodystatesJessica.DashForward ||
                      frame.body_state.state == BodystatesAntoc.DashForward
                          ? 25
                          : 35)
                    : frame.physics_state.pos.x +
                      frame.hitboxes.body.dimension.x +
                      (frame.body_state.state ==
                          BodystatesJessica.DashForward ||
                      frame.body_state.state == BodystatesAntoc.DashForward
                          ? -25
                          : -35);
            const y = -1 * frame.physics_state.pos.y - 25;

            // play animation
            this.dashSmokeSprites[playerIndex]
                .setPosition(x, y)
                .setVisible(true)
                .play('dashSmokeAnim')
                .setFlipX(
                    frame.body_state.dir ==
                        (frame.body_state.state ==
                            BodystatesJessica.DashForward ||
                        frame.body_state.state == BodystatesAntoc.DashForward
                            ? RIGHT
                            : LEFT)
                );

            // sfx
            if (dashForwardBodyStates.includes(frame.body_state.state)) {
                this.dashForwardSounds[playerIndex].play();
            }
            if (dashBackwardBodyStates.includes(frame.body_state.state)) {
                this.dashBackwardSounds[playerIndex].play();
            }
        });

        //
        // step-forward-smoke
        //
        const stepForwardBodyStates = [BodystatesAntoc.StepForward];
        [0, 1].forEach((playerIndex) => {
            // get frame and qualify
            const frame = frames[playerIndex];
            if (frame.body_state.counter != 0) return;
            if (!stepForwardBodyStates.includes(frame.body_state.state)) return;

            // configure sprite
            const x =
                frame.body_state.dir == RIGHT
                    ? frame.physics_state.pos.x
                    : frame.physics_state.pos.x +
                      frame.hitboxes.body.dimension.x;
            const y = -1 * frame.physics_state.pos.y - 15;

            // play animation
            this.stepForwardSmokeSprites[playerIndex]
                .setPosition(x, y)
                .setVisible(true)
                .play('dashSmokeAnim')
                .setFlipX(
                    frame.body_state.dir ==
                        (frame.body_state.state ==
                            BodystatesJessica.DashForward ||
                        frame.body_state.state == BodystatesAntoc.DashForward
                            ? RIGHT
                            : LEFT)
                );

            this.dashForwardSounds[playerIndex].play();
        });

        //
        // jump smoke, both take-off & landing
        //
        const possibleLandingStates = [
            BodystatesAntoc.Jump,
            BodystatesAntoc.DropSlash,
            BodystatesAntoc.Launched,
            BodystatesJessica.Jump,
            BodystatesJessica.BirdSwing,
            BodystatesJessica.Launched,
            BodystatesJessica.JumpMoveForward,
            BodystatesJessica.JumpMoveBackward,
        ];
        [0, 1].forEach((playerIndex) => {
            const frame = frames[playerIndex];
            const prevFrame = prevFrames[playerIndex];
            // console.log(playerIndex, 'stimulus', frame.stimulus);

            const stimulusType = Math.floor(frame.stimulus / STIMULUS_ENCODING);
            const prevStimulusType = Math.floor(
                prevFrame.stimulus / STIMULUS_ENCODING
            );

            if (
                (frame.body_state.state == BodystatesAntoc.Jump ||
                    frame.body_state.state == BodystatesJessica.Jump) &&
                frame.body_state.counter == 0
            ) {
                const x =
                    frame.physics_state.pos.x +
                    frame.hitboxes.body.dimension.x / 2;
                const y = -1 * frame.physics_state.pos.y - 40;

                this.jumpTakeoffSmokeSprites[playerIndex]
                    .setPosition(x, y)
                    .setVisible(true)
                    .play('jumpTakeoffSmokeAnim');

                if (frame.body_state.state == BodystatesAntoc.Jump)
                    this.antocJumpSounds[playerIndex].play();
                else if (frame.body_state.state == BodystatesJessica.Jump)
                    this.jessicaJumpSounds[playerIndex].play();
            } else if (
                stimulusType == StimulusType.GROUND &&
                prevStimulusType != StimulusType.GROUND &&
                possibleLandingStates.includes(frame.body_state.state)
            ) {
                const x =
                    frame.physics_state.pos.x +
                    frame.hitboxes.body.dimension.x / 2;
                const y = -1 * frame.physics_state.pos.y - 10;

                this.jumpLandingSmokeSprites[playerIndex]
                    .setPosition(x, y)
                    .setVisible(true)
                    .play('smokeAnim');

                if (
                    [
                        BodystatesAntoc.Jump,
                        BodystatesJessica.Jump,
                        BodystatesAntoc.DropSlash,
                        BodystatesJessica.BirdSwing,
                    ].includes(frame.body_state.state)
                ) {
                    // voluntary landing
                    this.landingSounds[playerIndex].play();
                } else {
                    // involuntary landing
                    this.landingFromKnockedSounds[playerIndex].play();
                }
            }
        });
    }

    updateScene(
        characterType0: number,
        characterType1: number,
        agentPrevFrame0: FrameLike,
        agentPrevFrame1: FrameLike,
        agentFrame0: FrameLike,
        agentFrame1: FrameLike,
        isBeginning: boolean = true,
        showDebug: boolean = false,
        isLast: boolean = false
    ) {
        //
        // Draw characters
        //
        this.setPlayerOneCharacter(characterType0);
        this.setPlayerTwoCharacter(characterType1);
        this.setPlayerOneFrame(agentFrame0);
        this.setPlayerTwoFrame(agentFrame1);

        //
        // Draw vfx
        //
        this.updateEffects(
            [agentPrevFrame0, agentPrevFrame1],
            [agentFrame0, agentFrame1]
        );

        //
        // Draw stats
        //
        eventsCenter.emit('update-stats', [
            {
                hp: agentFrame0.body_state.integrity,
                stamina: agentFrame0.body_state.stamina,
            } as statsInfo,
            {
                hp: agentFrame1.body_state.integrity,
                stamina: agentFrame1.body_state.stamina,
            } as statsInfo,
        ]);

        //
        // Draw end game messages
        //
        if (isLast) {
            const integrity_P1 = agentFrame0.body_state.integrity;
            const integrity_P2 = agentFrame1.body_state.integrity;
            if (integrity_P1 < integrity_P2) {
                eventsCenter.emit('end-text-show', 'Player 2 won!');
            } else if (integrity_P1 > integrity_P2) {
                eventsCenter.emit('end-text-show', 'Player 1 won!');
            } else {
                eventsCenter.emit('end-text-show', 'Draw!');
            }
        } else {
            eventsCenter.emit('end-text-hide');

            if (isBeginning) {
                this.initializeCameraSettings();
            } else {
                this.adjustCamera(
                    agentFrame0.physics_state.pos.x,
                    agentFrame1.physics_state.pos.x
                );
            }
        }

        //
        // Handle frame data display
        //
        if (showDebug) {
            this.showDebug();
            this.setPlayerOneBodyHitbox(agentFrame0);
            this.setPlayerTwoBodyHitbox(agentFrame1);
            this.setPlayerOneActionHitbox(agentFrame0);
            this.setPlayerTwoActionHitbox(agentFrame1);
            this.setPlayerOnePointer(agentFrame0);
            this.setPlayerTwoPointer(agentFrame1);

            eventsCenter.emit('frame-data-show', [
                agentFrame0,
                agentFrame1,
            ] as FrameLike[]);
        } else {
            this.hideDebug();

            eventsCenter.emit('frame-data-hide', null);
        }
    }

    addEventToBattleLog(
        playerIndex: number,
        event: CombatEvent,
        frameIndex: number
    ) {
        const combatLog =
            playerIndex == 0
                ? this.player_one_combat_log
                : this.player_two_combat_log;
        const repeatEvent = combatLog?.event == event;
        const eventCount = repeatEvent ? combatLog?.eventCount + 1 : 0;

        if (playerIndex == 0) {
            this.player_one_combat_log = {
                frameIndex,
                event,
                eventCount: eventCount,
            };
        } else {
            this.player_two_combat_log = {
                frameIndex,
                event,
                eventCount: eventCount,
            };
        }

        //Invalidate other players combo/action
        if (playerIndex == 0) {
            eventsCenter.emit('player-event-remove', 2);
            this.player_two_combat_log = undefined;
        } else {
            eventsCenter.emit('player-event-remove', 1);
            this.player_one_combat_log = undefined;
        }

        if (!(event == CombatEvent.Combo && eventCount == 0)) {
            eventsCenter.emit(
                'player-event-create',
                playerIndex + 1,
                event.toString(),
                eventCount
            );
        }
    }

    getBodyStateFromFrame(characterType: number, agentFrame: FrameLike) {
        return bodyStateNumberToName[characterType == 0 ? 'jessica' : 'antoc'][
            agentFrame.body_state.state
        ];
    }

    battleText(
        characterType0: number,
        characterType1: number,
        agentFrame0: FrameLike,
        agentFrame1: FrameLike,
        currentFrame: number
    ) {
        const p1BodyState = this.getBodyStateFromFrame(
            characterType0,
            agentFrame0
        );
        const p2BodyState = this.getBodyStateFromFrame(
            characterType1,
            agentFrame1
        );

        //Each action can register once
        // Track changing actions or action counter hitting 0
        // An event log is based off of current action, bodyState of each

        if (
            p2BodyState === 'clash' &&
            p1BodyState === 'clash' &&
            agentFrame0.body_state.counter == 0 &&
            agentFrame1.body_state.counter == 0
        ) {
            this.addEventToBattleLog(0, CombatEvent.Clash, currentFrame);
            return;
        }

        const p1ActionConfirm = this.battleTextPerPlayer(
            this.player_one_action_confirm,
            p1BodyState,
            p2BodyState,
            agentFrame1.body_state.counter,
            0,
            currentFrame,
            this.player_one_combat_log
        );

        this.player_one_action_confirm = p1ActionConfirm
            ? true
            : this.player_one_action_confirm;
        const p2ActionConfirm = this.battleTextPerPlayer(
            this.player_one_action_confirm,
            p2BodyState,
            p1BodyState,
            agentFrame0.body_state.counter,
            1,
            currentFrame,
            this.player_two_combat_log
        );

        this.player_two_action_confirm = p2ActionConfirm
            ? true
            : this.player_two_action_confirm;
    }

    battleTextPerPlayer(
        confirm: boolean,
        selfBodyState: string,
        otherBodyState: string,
        otherBodyCounter: number,
        playerIndex: number,
        currentFrame: number,
        combatLog: BattleEvent
    ) {
        let newActionConfirm = false;

        if (!confirm) {
            if (
                ((selfBodyState === 'block' && otherBodyState === 'knocked') ||
                    (selfBodyState === 'block' &&
                        otherBodyState === 'clash')) &&
                otherBodyCounter == 0
            ) {
                newActionConfirm = true;
                this.addEventToBattleLog(
                    playerIndex,
                    CombatEvent.Block,
                    currentFrame
                );
            } else if (
                (otherBodyState === 'knocked' || otherBodyState == 'hurt') &&
                otherBodyCounter == 0
            ) {
                newActionConfirm = true;
                if (
                    combatLog == undefined ||
                    combatLog.event !== CombatEvent.Combo
                ) {
                    this.addEventToBattleLog(
                        playerIndex,
                        CombatEvent.Combo,
                        currentFrame
                    );
                } else {
                    this.addEventToBattleLog(
                        playerIndex,
                        CombatEvent.Combo,
                        currentFrame
                    );
                }
            }
        }

        return newActionConfirm;
    }
}
