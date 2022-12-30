import {useAccount, useConnectors} from '@starknet-react/core'
import { useEffect, useState } from 'react'
import styles from "../../styles/Character.module.css";
import testJsonStr from '../json/test_engine.json';
import { SIMULATOR_H, SIMULATOR_W } from '../constants/constants';
import { TestJson, Frame } from '../types/Frame';

interface CharacterProps {
    agentIndex: number;
    characterName: string;
    animationFrame: number;
}

export default function Character( {agentIndex, characterName, animationFrame}: CharacterProps ) {

    const [recordJson, setRecordJson] = useState<TestJson>();
    useEffect(() => {
        const record = JSON.parse(testJsonStr);
        setRecordJson ((_) => record);
        console.log(agentIndex, 'recordJson:', record);
    }, []);
    if (!recordJson) return <></>

    const agentFrames = recordJson[`agent_${agentIndex}`]
    const agentFrame = agentFrames[animationFrame]
    console.log('agentFrame:', agentFrame)

    // Extract from frame
    const bodyState = agentFrame.body_state.state
    const bodyStateCounter = agentFrame.body_state.counter
    const animIndex: number = bodyState + bodyStateCounter
    const physicsState = agentFrame.physics_state
    const pos = physicsState.pos

    // Calculate left and top for rendering
    const CHAR_DIM = 300
    const left = SIMULATOR_W/2 - 48 + pos.x
    const top = SIMULATOR_H - pos.y - CHAR_DIM
    console.log(agentIndex, `(left,top) = (${left},${top})`)

    return (
        //<div style={{display:'flex', flexDirection:'column', marginRight:'20px'}}>
            <div
                className={`unit ${characterName}-${animIndex}`}
                style={{
                    width: CHAR_DIM, height: CHAR_DIM,
                    // border: '1px solid #999999',
                    border: 'none',
                    position: 'absolute', left: left, top: top,
                    zIndex: 0,
                }}
            />
            //<p>animation index: {animIndex}</p>
        //</div>
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