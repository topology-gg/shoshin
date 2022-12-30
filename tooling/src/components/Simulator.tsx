import {useAccount, useConnectors} from '@starknet-react/core'
import { useEffect, useState } from 'react'
import Character from './Character';
import { SIMULATOR_H, SIMULATOR_W } from '../constants/constants';

interface SimulatorProps {
    character_type_0: number;
    character_type_1: number;
    animationFrame: number;
}

export default function Simulator( {character_type_0, character_type_1, animationFrame}: SimulatorProps ) {

    return (
        <div style={{
            display:'flex', flexDirection:'row',
            width:SIMULATOR_W, height:SIMULATOR_H,
            border:'2px solid #333333',
            position:'relative',
        }}>
            <Character agentIndex={0} characterName={'jessica'} animationFrame={animationFrame} />
            <Character agentIndex={1} characterName={'antoc'} animationFrame={animationFrame} />
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