import {useAccount, useConnectors} from '@starknet-react/core'
import { useEffect, useState } from 'react'
import styles from "../../styles/Character.module.css";
import testJsonStr from '../json/test_engine.json';
import { SIMULATOR_H, SIMULATOR_W, bodyStateNumberToName } from '../constants/constants';
import { TestJson, Frame, Rectangle } from '../types/Frame';

interface DebugProps {
    show: boolean;
    agentIndex: number;
    agentFrame: Frame;
    characterName: string;
}

export default function Debug( {show=false, agentIndex, agentFrame, characterName}: DebugProps ) {

    if (!show) { return <></>; }

    // Extract from frame
    const bodyHitbox: Rectangle = agentFrame.hitboxes.body
    const bodyStateStateString: string = bodyStateNumberToName [characterName][agentFrame.body_state.state]
    const animationIndex: number = agentFrame.body_state.state + agentFrame.body_state.counter

    // Calculate position and dimension of the hitbox for rendering
    const hitboxW = bodyHitbox.dimension.x
    const hitboxH = bodyHitbox.dimension.y
    const hitboxX = bodyHitbox.origin.x
    const hitboxY = bodyHitbox.origin.y
    const topOffset = agentIndex == 0 ? 0 : 25
    const left = SIMULATOR_W/2 + hitboxX - 25
    const top = SIMULATOR_H - hitboxY - hitboxH - 50 - topOffset

    return (
            <div
                // className={`unit ${characterName}-${animIndex} ${flipClass}`}
                className={'unit'}
                style={{
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    left: left, top: top,
                    border: 'none',
                    zIndex: 10,
                    color: '#333333',
                }}
            >
                <p style={{margin:'0'}}>Body state: {bodyStateStateString}</p>
                <p style={{margin:'0'}}>Anim index: {animationIndex}</p>
            </div>
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