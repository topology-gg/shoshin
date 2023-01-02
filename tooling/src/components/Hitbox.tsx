import {useAccount, useConnectors} from '@starknet-react/core'
import { useEffect, useState } from 'react'
import styles from "../../styles/Character.module.css";
import testJsonStr from '../json/test_engine.json';
import { SIMULATOR_H, SIMULATOR_W, bodyStateNumberToName } from '../constants/constants';
import { TestJson, Frame, Rectangle } from '../types/Frame';

interface HitboxProps {
    agentFrame: Frame;
    hitboxType: string;
}

export default function Hitbox( {agentFrame, hitboxType}: HitboxProps ) {

    // Extract from frame
    const hitbox: Rectangle = hitboxType == 'body' ? agentFrame.hitboxes.body : agentFrame.hitboxes.action

    // Calculate position and dimension of the hitbox for rendering
    const hitboxW = hitbox.dimension.x
    const hitboxH = hitbox.dimension.y
    const hitboxX = hitbox.origin.x
    const hitboxY = hitbox.origin.y
    const left = SIMULATOR_W/2 + hitboxX
    const top = SIMULATOR_H - hitboxY - hitboxH

    // Calculate hitbox render style
    const borderColor = hitboxType == 'body' ? '#FCE20577' : '#CC333377';

    return (
            <div
                // className={`unit ${characterName}-${animIndex} ${flipClass}`}
                className={'unit'}
                style={{
                    position: 'absolute',
                    width: hitboxW, height: hitboxH,
                    left: left, top: top,
                    border: `7px solid ${borderColor}`,
                    zIndex: 0,
                    color: '#333333',
                }}
            >({hitboxX},{hitboxY}) {hitboxW}x{hitboxH}</div>
    )
}

// reference: https://stackoverflow.com/a/66228871
function feltLiteralToString (felt: string) {

    const tester = felt.split('');

    let currentChar = '';
    let result = "";
    const minVal = 25;
    const maxval = 255;

    for (let i = 0; i < tester.length; i++) {
        currentChar += tester[i];
        if (parseInt(currentChar) > minVal) {
            // console.log(currentChar, String.fromCharCode(currentChar));
            result += String.fromCharCode( parseInt(currentChar) );
            currentChar = "";
        }
        if (parseInt(currentChar) > maxval) {
            currentChar = '';
        }
    }

    return result
}