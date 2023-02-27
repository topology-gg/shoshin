import {useAccount, useConnectors} from '@starknet-react/core'
import { useEffect, useState, useRef } from 'react'
import Character from './Character';
import Hitbox from './Hitbox';
import Debug from './Debug';
import { SIMULATOR_H, SIMULATOR_W } from '../constants/constants';
import testJsonStr from '../json/test_engine.json';
import { TestJson, Frame } from '../types/Frame';
import { useResize } from '../hooks/useResize';
import { Box } from '@mui/material';

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

    const componentRef = useRef()
    const { width: componentWidth, height: componentHeight } = useResize(componentRef)

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
        <Box
            ref={componentRef}
            sx={{
              border: 1,
              borderRadius: 4,
              display: 'flex',
              height: SIMULATOR_H,
              flexDirection: "row",
              position: "relative",
              mb: 2
            }}
            id={'simulator-background'}
        >
            <Character agentIndex={0} viewWidth={componentWidth} characterName={characterName0} agentFrame={agentFrame0} />
            <Character agentIndex={1} viewWidth={componentWidth} characterName={characterName1} agentFrame={agentFrame1} />


            <Hitbox show={showDebug} viewWidth={componentWidth} agentFrame={agentFrame0} hitboxType={'body'} />
            <Hitbox show={showDebug} viewWidth={componentWidth} agentFrame={agentFrame0} hitboxType={'action'} />

            <Hitbox show={showDebug} viewWidth={componentWidth} agentFrame={agentFrame1} hitboxType={'body'} />
            <Hitbox show={showDebug} viewWidth={componentWidth} agentFrame={agentFrame1} hitboxType={'action'} />

            <Debug show={showDebug} viewWidth={componentWidth} agentIndex={0} agentFrame={agentFrame0} characterName={characterName0} />
            <Debug show={showDebug} viewWidth={componentWidth} agentIndex={1} agentFrame={agentFrame1} characterName={characterName1} />
        </Box>
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