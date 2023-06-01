import {
    SIMULATOR_H,
    bodyStateNumberToName,
    SpriteTopAdjustmentToBg,
} from '../constants/constants';
import { Frame } from '../types/Frame';
import { spriteData } from '../constants/sprites';

interface CharacterProps {
    viewWidth: number;
    characterName: string;
    agentFrame: Frame;
}

export default function Character({
    viewWidth,
    characterName,
    agentFrame,
}: CharacterProps) {
    // console.log(characterName, 'agentFrame:', agentFrame)

    // Extract from frame
    const bodyState = agentFrame.body_state.state;
    const bodyStateCounter = agentFrame.body_state.counter;
    const bodyStateDir = agentFrame.body_state.dir;
    const physicsState = agentFrame.physics_state;
    const pos = physicsState.pos;

    // Calculate path to the correct sprite
    const bodyStateName = bodyStateNumberToName[characterName][bodyState];
    const direction = bodyStateDir == 1 ? 'right' : 'left';

    // console.log('characterName:', characterName, 'bodyStateName', bodyStateName)
    const spriteAdjustments = spriteData[characterName][bodyStateName];
    const spriteAdjustment =
        spriteAdjustments.length == 1
            ? spriteAdjustments[0]
            : spriteAdjustments[bodyStateCounter]; // if having more than one adjustments, use body counter to index the adjustments
    const spriteSize = spriteAdjustment?.size || [0, 0];
    const spriteLeftAdjustment =
        spriteAdjustment?.hitboxOffset[direction][0] || 0;
    const spriteTopAdjustment =
        spriteAdjustment?.hitboxOffset[direction][1] || 0;
    const spriteSheetName = `./images/${characterName}/${bodyStateName}/${direction}_spritesheet.png`;

    const spriteFrameAdjustment = spriteSize[0] * bodyStateCounter;

    // Calculate character's left and top for rendering
    const left = viewWidth / 2 + pos.x + spriteLeftAdjustment;
    const top =
        SIMULATOR_H -
        pos.y -
        spriteSize[1] +
        spriteTopAdjustment +
        SpriteTopAdjustmentToBg;

    return (
        <div
            // className={`unit ${characterName}-${animIndex} ${flipClass}`}
            className={'unit'}
            style={{
                width: spriteSize[0],
                height: spriteSize[1],
                // border: '1px solid #999999',
                // border: 'none',
                position: 'absolute',
                left: left,
                top: top,
                zIndex: 10,
                background: `url("${spriteSheetName}") no-repeat ${-spriteFrameAdjustment}px bottom`,
                // backgroundRepeat: 'no-repeat',
                // backgroundSize: 'auto',
                // backgroundPosition: 'left bottom',
            }}
        />
    );
}
