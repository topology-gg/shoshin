import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import Grid from '@mui/material/Grid';
import MidScreenControl from '../src/components/MidScreenControl';
import LoadTestJson from '../src/components/LoadTestJson';
import Simulator from '../src/components/Simulator';
import SidePanel from '../src/components/SidePanel';
import { FrameScene, TestJson } from '../src/types/Frame';
import { Tree, Direction} from '../src/types/Tree'
import { Function, FunctionElement, parseFunction, verifyValidFunction } from '../src/types/Function'
import { MentalState, parseMentalState } from '../src/types/MentalState';
import { Character, INITIAL_DECISION_TREES, INITIAL_FUNCTIONS, INITIAL_FUNCTIONS_INDEX, INITIAL_MENTAL_STATES } from '../src/constants/constants';
import Agent from '../src/types/Agent';
import { CairoSimulation } from '../src/components/CairoSimulation';

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
    const LATENCY = 100;
    const runnable = true;

    // React states
    const [loop, setLoop] = useState<NodeJS.Timer>();
    const [animationFrame, setAnimationFrame] = useState<number>(0);
    const [animationState, setAnimationState] = useState<string>('Stop');
    const [testJson, setTestJson] = useState<TestJson>(null);
    const [checkedShowDebugInfo, setCheckedShowDebugInfo] = useState<boolean>(false);
    const [workingTab, setWorkingTab] = useState<number>(0);
    const [combos, setCombos] = useState<number[][]>([])
    const [mentalStates, setMentalStates] = useState<MentalState[]>(INITIAL_MENTAL_STATES);
    const [initialMentalState, setInitialMentalState] = useState<number>(0);
    const [treeEditor, setTreeEditor] = useState<number>(0);
    const [trees, setTrees] = useState<Tree[]>(INITIAL_DECISION_TREES)
    const [functions, setFunctions] = useState<Function[]>(INITIAL_FUNCTIONS)
    const [functionsIndex, setFunctionsIndex] = useState<number>(INITIAL_FUNCTIONS_INDEX)
    const [agent, setAgent] = useState<Agent>({})
    const [character, setCharacter] = useState<Character>(Character.Jessica)

    // Warnings
    const [isGeneralFunctionWarningTextOn, setGeneralFunctionWarningTextOn] = useState<boolean>(false)
    const [generalFunctionWarningText, setGeneralFunctionWarningText] = useState<string>('')
    const [isTreeEditorWarningTextOn, setTreeEditorWarningTextOn] = useState<boolean>(false)
    const [treeEditorWarningText, setTreeEditorWarningText] = useState<string>('')
    const [runCairoSimulationWarning, setCairoSimulationWarning] = useState<string>('')

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

    function handleSetMentalStateAction(index: number, action: number) {
        setMentalStates((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy[index] = { state: prev_copy[index].state, action: action }
            return prev_copy;
        });
    }

    function handleAddMentalState(new_state: string) {
        setMentalStates((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy.push({ state: new_state, action: 0 });
            return prev_copy;
        });
        setTrees((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy.push({ nodes: [] });
            return prev_copy;
        });
    }

    function handleClickRemoveMentalState(index: number) {
        if (index == initialMentalState) {
            setInitialMentalState(0)
        }
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

    function handleClickTreeEditor(index: number) {
        setTreeEditorWarningTextOn(false)
        setTreeEditor(index)
    }

    function handleUpdateTree(index: number, input: string) {
        let new_tree = {nodes: []}
        let regex_branches = /if *([a-zA-Z0-9_ ]*)\? *([a-zA-Z0-9_ ]*) *\:/g

        let regex_end = /: *\n([a-zA-z0-9_ ]*)/gm

        let exp = regex_branches.exec(input)
        let f = functions.slice(0, functions.length - 1).map((_, i) => {return `F${i}`})
        let ms = mentalStates.map((m) => {return m.state})
        while (exp !== null && exp[1] !== '' && exp[2] !== '') {
            let fCondition = f.includes(exp[1].trim())
            let mCondition = ms.includes(exp[2].trim())
            if (fCondition && mCondition) {
                new_tree.nodes.push({id: 'if ' + exp[1].trim(), isChild: false }, { id: exp[2].trim(), isChild: true, branch: Direction.Left })
            } else {
                let text = !fCondition ? !mCondition ?
                                        `Function ${exp[1]} and mental state ${exp[2]} not included in currect build`:
                                        `Function ${exp[1]} not included in current build` :
                            `Mental state ${exp[2]} not included in current build`
                setTreeEditorWarningTextOn(true)
                setTreeEditorWarningText(text)
                return
            }
            exp = regex_branches.exec(input)
        }
        setTreeEditorWarningTextOn(false)

        let exp_end = regex_end.exec(input)
        let end_node;
        while (exp_end !== null) {
            end_node = {id: exp_end[1].trim(), isChild: true, branch: Direction.Right }
            exp_end = regex_end.exec(input)
        }
        if (end_node !== undefined && end_node.id !== '') {
            let mCondition = ms.includes(end_node.id)
            if (mCondition) {
                new_tree.nodes.push(end_node)
            } else {
                setTreeEditorWarningTextOn(true)
                setTreeEditorWarningText(`Mental state ${end_node.id} not included in current build`)
                return
            }
        }
        setTreeEditorWarningTextOn(false)

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
                if (index == 0 && !prev_copy[index]) {
                    prev_copy = [{ elements: [] }]
                }
                prev_copy[index].elements.push(element)
                if (!verifyValidFunction(prev_copy[index], false)) {
                    setGeneralFunctionWarningTextOn(true)
                    setGeneralFunctionWarningText(`Invalid ${element.type}, please try again`)
                    setTimeout(() => setGeneralFunctionWarningTextOn(false), 2000)
                    prev_copy[index].elements.pop()
                    return prev_copy
                }
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
        let f = functions[functionsIndex]
        if(!f?.elements || !verifyValidFunction(f, true)) {
            setGeneralFunctionWarningTextOn(true)
            setGeneralFunctionWarningText(`Invalid function, please update`)
            setTimeout(() => setGeneralFunctionWarningTextOn(false), 2000)
            return
        }
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

    function handleValidateCombo(combo: number[], index: number) {
        if (combo.length > 0) {
            setCombos((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev))
                prev_copy[index] = combo
                return prev_copy
            })
        }
    }

    function handleValidateCharacter(mentalStates: MentalState[], combos: number[][], trees: Tree[], functions: Function[]) {
        let agent: Agent = {}
        agent.combos = combos
        agent.states = mentalStates.map((ms) => ms.state)
        agent.initialState = initialMentalState
        let agentFunctions = []
        functions.slice(0, -1).forEach((f) => {
            agentFunctions.push(parseFunction(f))
        })
        agent.generalPurposeFunctions = agentFunctions

        let agentMentalStates = []
        mentalStates.forEach((_, i) => {
            agentMentalStates.push(parseMentalState(trees[i], mentalStates))
        })
        agent.mentalStates = agentMentalStates
        agent.actions = mentalStates.map((ms) => ms.action)
        agent.character = Object.keys(Character).indexOf(character)
        setAgent((_) => {
            return agent
        })
    }

    function handleClickRunCairoSimulation(output: FrameScene) {
        setTestJson((_) => {
            return { agent_0: { frames: output.agent_0, type: agent.character }, agent_1: { frames: output.agent_1, type: 1 } }
        })
    }

    function handleInputError() {
        setCairoSimulationWarning('Incorrect agent, please verify. If error persists, please contact us on Discord.')
        setTimeout(() => setCairoSimulationWarning(''), 5000)
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
                            <CairoSimulation style={styles.confirm} handleClickRunCairoSimulation={handleClickRunCairoSimulation} handleInputError={handleInputError} warning={runCairoSimulationWarning} input={agent}></CairoSimulation>
                        </Grid>
                        <Grid item xs={4} className={styles.panel}>
                            <SidePanel
                                workingTab={workingTab}
                                handleClickTab={setWorkingTab}
                                character={character}
                                setCharacter={setCharacter}
                                mentalStates={mentalStates}
                                initialMentalState={initialMentalState}
                                handleSetInitialMentalState={setInitialMentalState}
                                combos={combos}
                                handleValidateCombo={handleValidateCombo}
                                handleAddMentalState={handleAddMentalState}
                                handleClickRemoveMentalState={handleClickRemoveMentalState}
                                handleSetMentalStateAction={handleSetMentalStateAction}
                                treeEditor={treeEditor}
                                handleClickTreeEditor={handleClickTreeEditor}
                                trees={trees}
                                handleUpdateTree={handleUpdateTree}
                                functions={functions}
                                handleUpdateGeneralFunction={handleUpdateGeneralFunction}
                                handleConfirmFunction={handleConfirmFunction}
                                handleClickDeleteFunction={handleClickDeleteFunction}
                                functionsIndex={functionsIndex}
                                setFunctionsIndex={setFunctionsIndex}
                                isGeneralFunctionWarningTextOn={isGeneralFunctionWarningTextOn}
                                generalFunctionWarningText={generalFunctionWarningText}
                                isTreeEditorWarningTextOn={isTreeEditorWarningTextOn}
                                treeEditorWarningText={treeEditorWarningText}
                                handleRemoveElementGeneralFunction={handleRemoveElementGeneralFunction}
                                handleValidateCharacter={handleValidateCharacter}
                            />
                        </Grid>
                    </Grid>
                </ThemeProvider>
        </div>
    )
}
