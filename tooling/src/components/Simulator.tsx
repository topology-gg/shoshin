import {useAccount, useConnectors} from '@starknet-react/core'
import { useEffect, useState } from 'react'
import Character from './Character';
import Hitbox from './Hitbox';
import Debug from './Debug';
import { SIMULATOR_H, SIMULATOR_W } from '../constants/constants';
import testJsonStr from '../json/test_engine.json';
import { TestJson, Frame } from '../types/Frame';

interface SimulatorProps {
    characterType0: number;
    characterType1: number;
    agentFrame0: Frame;
    agentFrame1: Frame;
    showDebug: boolean;
}

export default function Simulator( {
    characterType0, characterType1,
    agentFrame0, agentFrame1,
    showDebug = true,
}: SimulatorProps ) {

    // const [recordJson, setRecordJson] = useState<TestJson>();
    // useEffect(() => {
    //     const record = JSON.parse(testJsonStr);
    //     setRecordJson ((_) => record);
    //     // console.log(agentIndex, 'recordJson:', record);
    // }, []);
    // if (!recordJson) return <></>

    const characterName0 = characterType0 == 0 ? 'jessica' : 'antoc'
    const characterName1 = characterType1 == 0 ? 'jessica' : 'antoc'

    return (
        <div style={{
            display:'flex', flexDirection:'row',
            width:SIMULATOR_W, height:SIMULATOR_H,
            borderBottom:'1px solid #333333',
            position:'relative',
            marginBottom: '20px',
        }}>
            <Character agentIndex={0} characterName={characterName0} agentFrame={agentFrame0} />
            <Character agentIndex={1} characterName={characterName1} agentFrame={agentFrame1} />


            <Hitbox show={showDebug} agentFrame={agentFrame0} hitboxType={'body'} />
            <Hitbox show={showDebug} agentFrame={agentFrame0} hitboxType={'action'} />

            <Hitbox show={showDebug} agentFrame={agentFrame1} hitboxType={'body'} />
            <Hitbox show={showDebug} agentFrame={agentFrame1} hitboxType={'action'} />

            <Debug show={showDebug} agentIndex={0} agentFrame={agentFrame0} characterName={characterName0} />
            <Debug show={showDebug} agentIndex={1} agentFrame={agentFrame1} characterName={characterName1} />
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