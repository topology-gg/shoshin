import {useAccount, useConnectors} from '@starknet-react/core'
import { useEffect, useState } from 'react'
import Character from './Character';
import Hitbox from './Hitbox';
import { SIMULATOR_H, SIMULATOR_W } from '../constants/constants';
import testJsonStr from '../json/test_engine.json';
import { TestJson, Frame } from '../types/Frame';

interface SimulatorProps {
    character_type_0: number;
    character_type_1: number;
    agentFrame_0: Frame;
    agentFrame_1: Frame;
}

export default function Simulator( {
    character_type_0, character_type_1,
    agentFrame_0, agentFrame_1
}: SimulatorProps ) {

    // const [recordJson, setRecordJson] = useState<TestJson>();
    // useEffect(() => {
    //     const record = JSON.parse(testJsonStr);
    //     setRecordJson ((_) => record);
    //     // console.log(agentIndex, 'recordJson:', record);
    // }, []);
    // if (!recordJson) return <></>

    return (
        <div style={{
            display:'flex', flexDirection:'row',
            width:SIMULATOR_W, height:SIMULATOR_H,
            borderBottom:'1px solid #333333',
            position:'relative',
            marginBottom: '20px',
        }}>
            <Character agentIndex={0} characterName={'jessica'} agentFrame={agentFrame_0} />
            <Character agentIndex={1} characterName={'antoc'} agentFrame={agentFrame_1} />

            <Hitbox agentFrame={agentFrame_0} hitboxType={'body'} />
            <Hitbox agentFrame={agentFrame_0} hitboxType={'action'} />

            <Hitbox agentFrame={agentFrame_1} hitboxType={'body'} />
            <Hitbox agentFrame={agentFrame_1} hitboxType={'action'} />
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