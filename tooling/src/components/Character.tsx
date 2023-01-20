import {useAccount, useConnectors} from '@starknet-react/core'
import { useEffect, useState } from 'react'
import styles from "../../styles/Character.module.css";
import testJsonStr from '../json/test_engine.json';
import {
    SIMULATOR_H, SIMULATOR_W, bodyStateNumberToName, adjustmentForCharacter,
    CharacterComponentW, CharacterComponentH,
} from '../constants/constants';
import { TestJson, Frame, Rectangle } from '../types/Frame';
import { spriteDimensions } from '../constants/sprites';

interface CharacterProps {
    agentIndex: number;
    viewWidth: number;
    characterName: string;
    agentFrame: Frame;
}

export default function Character( {agentIndex, viewWidth, characterName, agentFrame}: CharacterProps ) {

    console.log(characterName, 'agentFrame:', agentFrame)

    // Extract from frame
    const bodyState = agentFrame.body_state.state
    const bodyStateCounter = agentFrame.body_state.counter
    const bodyStateDir = agentFrame.body_state.dir
    const physicsState = agentFrame.physics_state
    const pos = physicsState.pos
    console.log(characterName, 'pos:', pos)

    // Calculate path to the correct sprite
    const bodyStateName = bodyStateNumberToName [characterName][bodyState]
    const direction = (bodyStateDir == 1) ? 'right' : 'left'
    console.log(characterName, 'direction', direction)
    
    const spriteAdjustment = spriteDimensions[characterName][bodyStateName]
    const spriteSize = spriteAdjustment?.size || [0, 0]
    const spriteLeftAdjustment = spriteAdjustment?.hitboxOffset[direction][0] || 0
    const spriteTopAdjustment = spriteAdjustment?.hitboxOffset[direction][1] || 0
    const spriteSheetName = `./images/${characterName}/${bodyStateName}/${direction}_spritesheet.png`

    const spriteFrameAdjustment = spriteSize[0] * bodyStateCounter

    // Calculate character's left and top for rendering
    const adjustment = adjustmentForCharacter (characterName, bodyStateName, direction)
    console.log(characterName, 'adjustment', adjustment)

    const left = viewWidth/2 + pos.x + spriteLeftAdjustment
    const top = SIMULATOR_H - pos.y - spriteSize[1] + spriteTopAdjustment
    console.log(characterName, '(left,top):', `(${left},${top})`)


    return (
            <div
                // className={`unit ${characterName}-${animIndex} ${flipClass}`}
                className={'unit'}
                style={{
                    width: spriteSize[0], height: spriteSize[1],
                    // border: '1px solid #999999',
                    // border: 'none',
                    position: 'absolute', left: left, top: top,
                    zIndex: -1,
                    background: `url("${spriteSheetName}") no-repeat ${-spriteFrameAdjustment}px bottom`,
                    // backgroundRepeat: 'no-repeat',
                    // backgroundSize: 'auto',
                    // backgroundPosition: 'left bottom',
                }}
            />
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