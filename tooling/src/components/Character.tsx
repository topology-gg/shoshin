import {useAccount, useConnectors} from '@starknet-react/core'
import { useEffect, useState } from 'react'
import styles from "../../styles/Character.module.css";
import testJsonStr from '../json/test_engine.json';

interface CharacterProps {
    agentIndex: number;
    frameIndex: number;
}

export default function Character( {agentIndex, frameIndex}: CharacterProps ) {

    const testJson = JSON.parse(testJsonStr)
    if (!testJson) return <></>
    console.log('testJson:', testJson)

    const agentFrames = testJson[`agent_${agentIndex}`]
    console.log('agentFrames:', agentFrames)

    const agentFrame = agentFrames[frameIndex]
    const characterName = agentIndex == 0 ? 'jessica' : 'antoc'

    // Extract from frame
    const bodyState = agentFrame.object_state
    const bodyStateCounter = agentFrame.object_counter
    const animIndex: number = bodyState + bodyStateCounter

    const CHAR_DIM = '300px'
    return (
        <div className={`unit ${characterName}-${animIndex}`} style={{width: CHAR_DIM, height: CHAR_DIM}} />
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