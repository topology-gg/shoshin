import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { Box, createTheme, ThemeProvider, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import MidScreenControl from '../src/components/MidScreenControl';
import LoadTestJson from '../src/components/LoadTestJson';
import Simulator from '../src/components/Simulator';
import SidePanel from '../src/components/SidePanel';
import { TestJson, Frame } from '../src/types/Frame';
import { style } from '@mui/system';

const theme = createTheme({
    typography: {
        fontFamily: "Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;"
    },
    palette: {
        primary: {
            main: "#FFFE71",
        },
        secondary: {
            main: "#2d4249",
        },
        info: {
            main: "#848f98",
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                outlinedPrimary: {
                    color: "black",
                }
            }
        }
    }
});

export default function Home() {

    // Constants
    const LATENCY = 150;
    const runnable = true;

    // React states
    const [loop, setLoop] = useState<NodeJS.Timer>();
    const [animationFrame, setAnimationFrame] = useState<number>(0);
    const [animationState, setAnimationState] = useState<string>('Stop');
    const [testJson, setTestJson] = useState<TestJson>(null);
    const [checkedShowDebugInfo, setCheckedShowDebugInfo] = useState<boolean>(false);
    const [workingTab, setWorkingTab] = useState<number>(0);
    const [mentalStates, addMentalState] = useState<string[]>(["hey", "there"]);

    // Decode from React states
    if (testJson !== null) { console.log('testJson:',testJson); }
    const N_FRAMES = testJson == null ? 0 : testJson.agent_0.frames.length


    function handleMidScreenControlClick (operation: string) {

        if (operation == "NextFrame" && animationState != "Run") {

            setAnimationFrame((prev) => (prev < N_FRAMES ? prev + 1 : prev));

        } else if (operation == "PrevFrame" && animationState != "Run") {

            setAnimationFrame((prev) => (prev > 0 ? prev - 1 : prev));

        }

        else if (operation == "ToggleRun") {

            // If in Run => go to Pause
            if (animationState == "Run") {
                clearInterval(loop); // kill the timer
                setAnimationState("Pause");
            }

            // If in Pause => resume Run without simulation
            else if (animationState == "Pause") {
                // Begin animation
                setAnimationState("Run");
                setLoop(
                    setInterval(() => {
                        animationStepForward();
                    }, LATENCY)
                );
            }

            // If in Stop => perform simulation then go to Run
            else if (animationState == "Stop" && runnable) {

                // Begin animation
                setAnimationState("Run");

                setLoop(
                    setInterval(() => {
                        animationStepForward();
                    }, LATENCY)
                );

            }
        } else {

            // Stop
            clearInterval(loop); // kill the timer
            setAnimationState("Stop");
            setAnimationFrame((_) => 0);

        }
    }

    const animationStepForward = () => {
        setAnimationFrame((prev) => {
            if (prev == N_FRAMES-1) {
                return 0;
            } else {
                return prev + 1;
            }
        });
    };

    function handleLoadTestJson (event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event){
        const loadedJsonString = JSON.parse(event.target.result);
        const loadedJson = JSON.parse(loadedJsonString)
        console.log('loaded json:', loadedJson)
        setTestJson ((_) => loadedJson);
    }

    function handleClickPreloadedTestJson (testJson) {
        const preloadedJson = JSON.parse(testJson)
        console.log ('preloaded json:', preloadedJson)
        setTestJson ((_) => preloadedJson);
    }

    function handleAddMentalState(new_state: string){
        addMentalState((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy.push(new_state);
            return prev_copy;
        });
    }

    function handleRemoveMentalState(index: number){
        addMentalState((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy.splice(index, 1);
            return prev_copy;
        });
    }

    // Render
    return (
        <div className={styles.container}>
                <Head>
                    <title>Shoshin Tooling</title>
                    <meta name="shoshin-tooling" content="Generated by create next app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <ThemeProvider theme={theme}>
                    <Grid container spacing={1}>
                        {/* <Grid item xs={2}></Grid> */}
                        <Grid item xs={8} className={styles.main}>
                            {
                                !testJson ? <></> :
                                <>
                                    <Simulator
                                        characterType0={testJson.agent_0.type}
                                        characterType1={testJson.agent_1.type}
                                        agentFrame0={testJson.agent_0.frames[animationFrame]}
                                        agentFrame1={testJson.agent_1.frames[animationFrame]}
                                        showDebug={checkedShowDebugInfo}
                                    />

                                    <MidScreenControl
                                        runnable = {true}
                                        animationFrame = {animationFrame}
                                        n_cycles = {N_FRAMES}
                                        animationState = {animationState}
                                        handleClick = {handleMidScreenControlClick}
                                        handleSlideChange = {
                                            evt => {
                                                if (animationState == "Run") return;
                                                const slide_val: number = parseInt(evt.target.value);
                                                setAnimationFrame(slide_val);
                                            }
                                        }
                                        checkedShowDebugInfo = {checkedShowDebugInfo}
                                        handleChangeDebugInfo = {() => setCheckedShowDebugInfo(
                                            (_) => !checkedShowDebugInfo
                                        )}
                                    />
                                </>
                            }
                            <LoadTestJson
                                handleLoadTestJson={handleLoadTestJson}
                                handleClickPreloadedTestJson={handleClickPreloadedTestJson}
                            />
                        </Grid>
                        <Grid item xs={4} className={styles.panel}>
                            <SidePanel 
                                workingTab={workingTab} 
                                handleClickTab={setWorkingTab}
                                mentalStates={mentalStates}
                                handleAddMentalState={handleAddMentalState}
                                handleRemoveMentalState={handleRemoveMentalState}
                            />
                        </Grid>
                    </Grid>
                </ThemeProvider>
        </div>
    )
}
