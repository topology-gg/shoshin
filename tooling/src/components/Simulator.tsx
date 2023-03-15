import { useRef } from 'react'
import Character from './Character';
import Hitbox from './Hitbox';
import { SIMULATOR_H } from '../constants/constants';
import { TestJson } from '../types/Frame';
import { useResize } from '../hooks/useResize';
import { Box } from '@mui/material';

interface SimulatorProps {
    testJson: TestJson;
    animationFrame: number;
    showDebug: boolean;
}

export default function Simulator( {
    testJson,
    animationFrame,
    showDebug = true,
}: SimulatorProps ) {

    const componentRef = useRef()
    const { width: componentWidth, height: componentHeight } = useResize(componentRef)
    if (!testJson){
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
            />
        );
    }

    const characterType0 = testJson?.agent_0.type
    const characterType1 = testJson?.agent_1.type
    const agentFrame0 = testJson?.agent_0.frames[animationFrame]
    const agentFrame1 = testJson?.agent_1.frames[animationFrame]

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
            <Character viewWidth={componentWidth} characterName={characterName0} agentFrame={agentFrame0} />
            <Character viewWidth={componentWidth} characterName={characterName1} agentFrame={agentFrame1} />

            <Hitbox show={showDebug} viewWidth={componentWidth} agentFrame={agentFrame0} hitboxType={'body'} />
            <Hitbox show={showDebug} viewWidth={componentWidth} agentFrame={agentFrame0} hitboxType={'action'} />

            <Hitbox show={showDebug} viewWidth={componentWidth} agentFrame={agentFrame1} hitboxType={'body'} />
            <Hitbox show={showDebug} viewWidth={componentWidth} agentFrame={agentFrame1} hitboxType={'action'} />

            {/* <Debug show={showDebug} viewWidth={componentWidth} agentIndex={0} agentFrame={agentFrame0} characterName={characterName0} />
            <Debug show={showDebug} viewWidth={componentWidth} agentIndex={1} agentFrame={agentFrame1} characterName={characterName1} /> */}
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