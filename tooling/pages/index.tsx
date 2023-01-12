import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { Box, createTheme, ThemeProvider, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import MidScreenControl from '../src/components/MidScreenControl';
import LoadTestJson from '../src/components/LoadTestJson';
import Simulator from '../src/components/Simulator';
import SidePanel from '../src/components/SidePanel';
import { TestJson } from '../src/types/Frame';
import { Tree, Direction} from '../src/types/Tree'
import { Function, FunctionElement, ElementType } from '../src/types/Function'
import { prepareSelector } from 'starknet/dist/utils/typedData';

const theme = createTheme({
    typography: {
        fontFamily: "Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;"
    },
    palette: {
        primary: {
            main: "#000000",
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
    const [mentalStates, setMentalStates] = useState<string[]>([]);
    const [treeEditor, setTreeEditor] = useState<number>(0);
    const [trees, setTrees] = useState<Tree[]>([])
    const [functions, setFunctions] = useState<Function[]>([])
    const [functionsIndex, setFunctionsIndex] = useState<number>(0)
    const [isWarningTextOn, setWarningText] = useState<boolean>(false)
    // TODO add start new Function button in order to add a empty function inside the functions

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

    function handleAddMentalState(new_state: string) {
        setMentalStates((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy.push(new_state);
            return prev_copy;
        });
        setTrees((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy.push({ nodes: [] });
            return prev_copy;
        });
    }

    function handleClickRemoveMentalState(index: number) {
        setMentalStates((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy.splice(index, 1);
            return prev_copy;
        });
        setTrees((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy.splice(index, 1);
            return prev_copy;
        });
    }

    function handleUpdateTree(index: number, input: string) {
        let new_tree = {nodes: []}
        let regex_branches = /if *([a-zA-Z0-9_ ]*)\? *([a-zA-Z0-9_ ]*) *\:/g

        let regex_end = /: *\n([a-zA-z0-9_ ]*)/gm
        
        let exp = regex_branches.exec(input)
        while (exp !== null && exp[1] !== '' && exp[2] !== '') {
            new_tree.nodes.push({id: 'if ' + exp[1].trim(), isChild: false }, { id: exp[2].trim(), isChild: true, branch: Direction.Left })
            exp = regex_branches.exec(input)
        }

        let exp_end = regex_end.exec(input)
        let end_node;
        while (exp_end !== null) {
            end_node = {id: exp_end[1].trim(), isChild: true, branch: Direction.Right }
            exp_end = regex_end.exec(input)
        }
        if (end_node !== undefined && end_node.id !== '') {
            new_tree.nodes.push(end_node)
        }

        setTrees((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy[index] = new_tree
            return prev_copy;
        })
    }

    function handleUpdateGeneralFunction(index: number, element: FunctionElement) {
        if (element) {
            setFunctions((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev));
                let length = prev_copy[index]?.elements?.length
                let prevElement = prev_copy[index]?.elements[length - 1]
                switch (element.type) {
                    case ElementType.Operator: {
                        if (prevElement?.type !== ElementType.Perceptible && prevElement?.type !== ElementType.Constant) {
                            setWarningText(true)
                            setTimeout(() => setWarningText(false), 2000)
                            return prev_copy
                        }
                        break
                    }
                    case ElementType.Constant: {
                        if (prevElement?.type !== ElementType.Operator && prevElement !== undefined) {
                            setWarningText(true)
                            setTimeout(() => setWarningText(false), 2000)
                            return prev_copy
                        }
                        break
                    }
                    case ElementType.Perceptible: {
                        if (prevElement?.type !== ElementType.Operator && prevElement !== undefined) {
                            setWarningText(true)
                            setTimeout(() => setWarningText(false), 2000)
                            return prev_copy
                        }
                        break
                    }
                }
                if (index == 0 && !prev_copy[index]) {
                    prev_copy = [{elements: []}]
                }
                prev_copy[index].elements.push(element)
                return prev_copy;
            })
        }
    }

    function handleRemoveElementGeneralFunction(index: number) {
        setFunctions((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev))
            if (!prev_copy[index]) {
                return prev_copy
            }
            let f = prev_copy[index]
            const length = f.elements.length
            if (length) {
                f.elements.splice(length - 1)
                prev_copy[index] = f
            }
            return prev_copy
        })
    }

    function handleConfirmFunction() {
        let length = functions.length
        console.log(functions)
        if (functionsIndex < length - 1){
            setFunctionsIndex(() => {
                return length - 1
            })
            return 
        }
        if (functions[length - 1]?.elements.length > 0) {
            setFunctionsIndex((prev) => {
                return prev + 1
            })
            setFunctions((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev))
                prev_copy.push({elements: []})
                return prev_copy
            })
        }
    }

    function handleClickDeleteFunction(index: number) {
        setFunctionsIndex((prev) => {
            if (index == prev) {
                return prev - 1
            }
            return prev
        })
        setFunctions((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev))
            prev_copy.splice(index, 1)
            return prev_copy
        })
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
                                handleClickRemoveMentalState={handleClickRemoveMentalState}
                                treeEditor={treeEditor}
                                handleClickTreeEditor={setTreeEditor}
                                trees={trees}
                                handleUpdateTree={handleUpdateTree}
                                functions={functions}
                                handleUpdateGeneralFunction={handleUpdateGeneralFunction}
                                handleConfirmFunction={handleConfirmFunction}
                                handleClickDeleteFunction={handleClickDeleteFunction}
                                functionsIndex={functionsIndex}
                                setFunctionsIndex={setFunctionsIndex}
                                isWarningTextOn={isWarningTextOn}
                                handleRemoveElementGeneralFunction={handleRemoveElementGeneralFunction}
                            />
                        </Grid>
                    </Grid>
                </ThemeProvider>
        </div>
    )
}
