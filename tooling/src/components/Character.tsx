import {useAccount, useConnectors} from '@starknet-react/core'
import { useEffect, useState } from 'react'
import styles from "../../styles/Character.module.css";
import testJsonStr from '../json/test_engine.json';
import { SIMULATOR_H, SIMULATOR_W, bodyStateNumberToName, adjustmentForCharacter } from '../constants/constants';
import { TestJson, Frame, Rectangle } from '../types/Frame';

interface CharacterProps {
    agentIndex: number;
    characterName: string;
    agentFrame: Frame;
}

export default function Character( {agentIndex, characterName, agentFrame}: CharacterProps ) {

    console.log(characterName, 'agentFrame:', agentFrame)

    // Extract from frame
    const bodyState = agentFrame.body_state.state
    const bodyStateCounter = agentFrame.body_state.counter
    const bodyStateDir = agentFrame.body_state.dir
    const physicsState = agentFrame.physics_state
    const pos = physicsState.pos

    // Calculate path to the correct sprite
    const bodyStateName = bodyStateNumberToName [characterName][bodyState]
    const direction = (bodyStateDir == 1) ? 'right' : 'left'

    // Calculate character's left and top for rendering
    const CHAR_DIM = 300
    const adjustment = adjustmentForCharacter (characterName, bodyStateName, direction)
    const left = SIMULATOR_W/2 + pos.x + adjustment.left
    const top = SIMULATOR_H - pos.y - CHAR_DIM + adjustment.top

    return (
            <div
                // className={`unit ${characterName}-${animIndex} ${flipClass}`}
                className={'unit'}
                style={{
                    width: CHAR_DIM, height: CHAR_DIM,
                    // border: '1px solid #999999',
                    // border: 'none',
                    position: 'absolute', left: left, top: top,
                    zIndex: 0,
                    background: `url("./images/${characterName}/${bodyStateName}/${direction}/frame_${bodyStateCounter}.png") no-repeat left bottom`,
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