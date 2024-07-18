import { SIMULATOR_H, SpriteTopAdjustmentToBg } from '../constants/constants';
import { Frame, Rectangle } from '../types/Frame';

interface HitboxProps {
    show: boolean;
    viewWidth: number;
    agentFrame: Frame;
    hitboxType: string;
}

export default function Hitbox({
    show = false,
    viewWidth,
    agentFrame,
    hitboxType,
}: HitboxProps) {
    if (!show) {
        return <></>;
    }

    // Extract from frame
    const hitbox: Rectangle =
        hitboxType == 'body'
            ? agentFrame.hitboxes.body
            : agentFrame.hitboxes.action;
    const bodyStateState: number = agentFrame.body_state.state;

    // Calculate position and dimension of the hitbox for rendering
    const hitboxW = hitbox.dimension.x;
    const hitboxH = hitbox.dimension.y;
    const hitboxX = hitbox.origin.x;
    const hitboxY = hitbox.origin.y;
    const left = viewWidth / 2 + hitboxX;
    const top = SIMULATOR_H - hitboxY - hitboxH + SpriteTopAdjustmentToBg;

    // Calculate hitbox render style
    // const borderColor = hitboxType == 'body' ? '#FCE20577' : '#CC333377';
    const borderColor = hitboxType == 'body' ? '#FCE205FF' : '#CC3333FF';

    return (
        <div
            // className={`unit ${characterName}-${animIndex} ${flipClass}`}
            className={'unit'}
            style={{
                position: 'absolute',
                width: hitboxW,
                height: hitboxH,
                left: left,
                top: top,
                // border: `7px solid ${borderColor}`,
                // backgroundColor:'#33333399',
                border: `2px solid ${borderColor}`,
                backgroundColor: '#33333366',
                zIndex: 20,
                color: '#EEEEEE',
            }}
        >
            ({hitboxX},{hitboxY}) {hitboxW}x{hitboxH}
        </div>
    );
}

// reference: https://stackoverflow.com/a/66228871
function feltLiteralToString(felt: string) {
    const tester = felt.split('');

    let currentChar = '';
    let result = '';
    const minVal = 25;
    const maxval = 255;

    for (let i = 0; i < tester.length; i++) {
        currentChar += tester[i];
        if (parseInt(currentChar) > minVal) {
            // console.log(currentChar, String.fromCharCode(currentChar));
            result += String.fromCharCode(parseInt(currentChar));
            currentChar = '';
        }
        if (parseInt(currentChar) > maxval) {
            currentChar = '';
        }
    }

    return result;
}
