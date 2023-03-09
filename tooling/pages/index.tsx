import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, createTheme, ThemeProvider } from '@mui/material';
import Grid from '@mui/material/Grid';
import MidScreenControl from '../src/components/MidScreenControl';
import Simulator from '../src/components/Simulator';
import SidePanel from '../src/components/sidePanelComponents/SidePanel';
import { FrameScene, TestJson } from '../src/types/Frame';
import { Tree, Direction} from '../src/types/Tree'
import { Function, FunctionElement, verifyValidFunction } from '../src/types/Function'
import { MentalState } from '../src/types/MentalState';
import { Character, CONTRACT_ADDRESS, DEFENSIVE_AGENT, ENTRYPOINT, IDLE_AGENT, INITIAL_COMBOS, INITIAL_DECISION_TREES, INITIAL_FUNCTIONS, INITIAL_FUNCTIONS_INDEX, INITIAL_MENTAL_STATES, OFFENSIVE_AGENT } from '../src/constants/constants';
import Agent, { agentsToCalldata, buildAgent } from '../src/types/Agent';
import ImagePreloader from '../src/components/ImagePreloader';
import StatusBarPanel from '../src/components/StatusBar';
import P1P2SettingPanel, { AgentOption } from '../src/components/P1P2SettingPanel';
import FrameInspector from '../src/components/FrameInspector';
import useRunCairoSimulation from '../src/hooks/useRunCairoSimulation';
import { useAgents } from '../lib/api'
import { Metadata, splitAgents } from '../src/types/Metadata';
import { useAccount, useConnectors, useStarknetExecute } from '@starknet-react/core';
import ConnectWallet from '../src/components/ConnectWallet';
import { EditorTabName } from '../src/components/sidePanelComponents/Tabs';

const theme = createTheme({
    typography: {
        fontFamily: 'Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;',
        fontSize: 12,
    },
    palette: {
        primary: {
            main: '#000000',
        },
        secondary: {
            main: '#2d4249',
        },
        info: {
            main: '#848f98',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                outlinedPrimary: {
                    color: 'black',
                    backgroundColor: 'white',
                    ':hover': {
                      backgroundColor: '#2EE59D',
                    //   boxShadow: '0px 15px 20px rgba(46, 229, 157, 0.4)',
                      color: '#fff',
                      transition: 'background 0.2s, color 0.2s',
                    }
                }
            }
        }
    }
});

export default function Home() {

    // Constants
    const LATENCY = 100;
    const runnable = true;

    // React states for simulation / animation control
    const [output, setOuput] = useState<FrameScene>();
    const [simulationError, setSimulationError] = useState();
    const [p1, setP1] = useState<Agent>();
    const [p2, setP2] = useState<Agent>();
    const [loop, setLoop] = useState<NodeJS.Timer>();
    const [animationFrame, setAnimationFrame] = useState<number>(0);
    const [animationState, setAnimationState] = useState<string>('Stop');
    const [testJson, setTestJson] = useState<TestJson>(null);
    const [checkedShowDebugInfo, setCheckedShowDebugInfo] = useState<boolean>(false);

    // React states for UI
    const [workingTab, setWorkingTab] = useState<EditorTabName>(EditorTabName.Profile);
    const [walletSelectOpen, setWalletSelectOpen] = useState<boolean>(false);
    const [treeEditor, setTreeEditor] = useState<number>(0);
    const [functionUnderEditIndex, setFunctionUnderEditIndex] = useState<number>(INITIAL_FUNCTIONS_INDEX)

    // React states for tracking the New Agent being edited in the right panel
    const [initialMentalState, setInitialMentalState] = useState<number>(0);
    const [combos, setCombos] = useState<number[][]>(INITIAL_COMBOS)
    const [mentalStates, setMentalStates] = useState<MentalState[]>(INITIAL_MENTAL_STATES);
    const [trees, setTrees] = useState<Tree[]>(INITIAL_DECISION_TREES)
    const [functions, setFunctions] = useState<Function[]>(INITIAL_FUNCTIONS)
    const [agentName, setAgentName] = useState<String>('')
    const [character, setCharacter] = useState<Character>(Character.Jessica)
    const [fighterSelection, setFighterSelection] = useState<string>('opponent')
    const [adversaryCombo, setAdversaryCombo] = useState<number[]>([])

    // React states for warnings
    const [isGeneralFunctionWarningTextOn, setGeneralFunctionWarningTextOn] = useState<boolean>(false)
    const [generalFunctionWarningText, setGeneralFunctionWarningText] = useState<string>('')
    const [isTreeEditorWarningTextOn, setTreeEditorWarningTextOn] = useState<boolean>(false)
    const [treeEditorWarningText, setTreeEditorWarningText] = useState<string>('')
    const [runCairoSimulationWarning, setCairoSimulationWarning] = useState<string>('')

    // Retrieve the last 20 agents submissions from the db
    const { data: data } = useAgents()
    const t: Metadata[] = data?.agents;
    const agents: Agent[] = t?.map(splitAgents).flat()


    const newAgent: Agent = useMemo(() => {
        return handleBuildAgent()
    }, [character, mentalStates, combos, trees, functions, initialMentalState])

    const { runCairoSimulation, wasmReady } = useRunCairoSimulation(p1, p2)

    useEffect(() => {
        if (output) {
            setTestJson((_) => {
                return { agent_0: { frames: output.agent_0, type: p1.character }, agent_1: { frames: output.agent_1, type: p2.character } }
            })
        }
    }, [output])

    useEffect(() => {
        if (!simulationError) return

        setCairoSimulationWarning('Incorrect agent, please verify. If error persists, please contact us on Discord.')
        setTimeout(() => setCairoSimulationWarning(''), 5000)
    }, [simulationError])

    // Starknet states
    const { account, address, status } = useAccount();
    const [hash, setHash] = useState<string>();
    // const callData = useMemo(() => {
    //     let args = agentsToCalldata(agent, opponent)
    //     // add the frame duration
    //     args = ["120"].concat(args)
    //     const tx = {
    //         contractAddress: CONTRACT_ADDRESS,
    //         entrypoint: ENTRYPOINT,
    //         calldata: args,
    //     };
    //     return [tx]
    // }, [agent, opponent])
    const callData = []
    const { execute } = useStarknetExecute({ calls: callData });
    const { available, connect } = useConnectors()
    const [connectors, setConnectors] = useState([])
    // Connectors are not available server-side therefore we
    // set the state in a useEffect hook
    useEffect(() => {
        if (available) setConnectors(available)
    }, [available])

    useEffect(() => {
        if (hash) {
            account
                .waitForTransaction(hash)
                .then(() => console.log("Success!"))
                .catch((err) => {
                    console.log("Error! Please try again.");
                    console.error(err);
                })
        }
    }, [hash]);



    // Decode from React states
    if (testJson !== null) { console.log('testJson:',testJson); }
    const N_FRAMES = testJson == null ? 0 : testJson.agent_0.frames.length

    function handleMidScreenControlClick (operation: string) {

        if (operation == 'NextFrame' && animationState != 'Run') {
            animationStepForward (N_FRAMES)

        } else if (operation == 'PrevFrame' && animationState != 'Run') {
            animationStepBackward ()
        }

        else if (operation == 'ToggleRun') {

            // If in Run => go to Pause
            if (animationState == 'Run') {
                clearInterval(loop); // kill the timer
                setAnimationState('Pause');
            }

            // If in Pause => resume Run without simulation
            else if (animationState == 'Pause') {
                // Begin animation
                setAnimationState('Run');
                setLoop(
                    setInterval(() => {
                        animationStepForward(N_FRAMES);
                    }, LATENCY)
                );
            }

            // If in Stop => perform simulation then go to Run
            else if (animationState == 'Stop' && runnable) {

                const [out, err] = runCairoSimulation()
                if (err != null) {
                    setSimulationError(err)
                    return
                }
                setOuput(out)

                // Begin animation
                setAnimationState('Run');

                setLoop(
                    setInterval(() => {
                        animationStepForward(out.agent_0.length);
                    }, LATENCY)
                );

            }
        } else {

            // Stop
            clearInterval(loop); // kill the timer
            setAnimationState('Stop');
            setAnimationFrame((_) => 0);

        }
    }

    const animationStepForward = (frames) => {
        setAnimationFrame((prev) => (prev == frames-1 ? prev : prev + 1));
    };
    const animationStepBackward = () => {
        setAnimationFrame((prev) => (prev > 0 ? prev - 1 : prev));
    }

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

    // async function handleClickSubmit() {
    //     if (!account) {
    //         console.log('> wallet not connected yet');
    //         alert('Wallet not connected yet, please reload page and select connector')
    //         return
    //     }

    //     console.log('> connected address:', String(address));

    //     // submit tx
    //     console.log('> submitting args to loop() on StarkNet:', callData);
    //     try {
    //         setHash('');

    //         const response = await execute();
    //         setHash(response.transaction_hash);
    //     } catch (err) {
    //         console.error(err);
    //     }
    //     return;
    // }

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

    // TODO: comment
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
        let f = functions[functionUnderEditIndex]
        if(!f?.elements || !verifyValidFunction(f, true)) {
            setGeneralFunctionWarningTextOn(true)
            setGeneralFunctionWarningText(`Invalid function, please update`)
            setTimeout(() => setGeneralFunctionWarningTextOn(false), 2000)
            return
        }
        if (functionUnderEditIndex < length - 1){
            setFunctionUnderEditIndex(() => {
                return length - 1
            })
            return
        }
        if (functions[length - 1]?.elements.length > 0) {
            setFunctionUnderEditIndex((prev) => {
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
        setFunctionUnderEditIndex((prev) => {
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
            if (index === null) {
                setCombos((prev) => {
                    let prev_copy: number[][] = JSON.parse(JSON.stringify(prev))
                    prev_copy.push(combo)
                    return prev_copy
                })
                return
            }
            setCombos((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev))
                prev_copy[index] = combo
                return prev_copy
            })
        }
    }

    function handleBuildAgent() {
        let char = Object.keys(Character).indexOf(character)
        return buildAgent(mentalStates, combos, trees, functions, initialMentalState, char)
    }

    //
    // Function that sets either P1 or P2 to a specified Agent
    //
    function agentChange (whichPlayer: string, event: object, value: AgentOption) {
        let setAgent: Agent

        // if Agent is not specified with the function call, set P1 or P2 to null
        if (!value) {
            if (whichPlayer == 'P1') {
                setP1(() => null)
            }
            else {
                setP2(() => null)
            }
            return;
        }

        // get agent from value
        if (value.label == 'idle agent') {
            setAgent = IDLE_AGENT
        }
        if (value.label == 'defensive agent') {
            setAgent = DEFENSIVE_AGENT
        }
        if (value.label == 'offensive agent') {
            setAgent = OFFENSIVE_AGENT
        }
        if (value.label == 'new agent') {
            setAgent = newAgent;
        }
        else if (value.group == 'Registry') {
            setAgent = agents[value.index]
        }

        // setP1 / setP2 depending on whichPlayer
        if (whichPlayer == 'P1') {
            setP1(() => setAgent)
        }
        else {
            setP2(() => setAgent)
        }
    }

    //
    // Set Agent in the side panel to blank agent
    //
    function setAgentInPanelToBlank () {
        setCombos(() => []);
        setMentalStates(() => []);
        setTrees(() => []);
        setFunctions(() => []);
        setAgentName(() => '');
        setCharacter(() => Character.Jessica);
        setFunctionUnderEditIndex(() => null);
    }

    //
    // Render
    //
    return (
        <div className={styles.container}>
                <Head>
                    <title>Shoshin Tooling</title>
                    <meta name='shoshin-tooling' content='Generated by create next app' />
                    <link rel='icon' href='/favicon.ico' />
                </Head>

                <ThemeProvider theme={theme}>
                    <Grid container spacing={1}>
                        {/* <Grid item xs={2}></Grid> */}
                        <Grid item xs={8}>
                            <div className={styles.main} style={{display:'flex', flexDirection:'column'}}>
                                <ImagePreloader
                                    onComplete={() => {
                                        console.log('completed images');
                                    }}
                                />
                                {
                                    // !testJson ? (wasmReady && <Button onClick={runCairoSimulation} variant='outlined' disabled={JSON.stringify(agent) === '{}'}>FIGHT</Button>) :
                                    <div style={{display:'flex', flexDirection:'column'}}>

                                        <P1P2SettingPanel
                                            agentsFromRegistry={agents}
                                            agentChange={agentChange}
                                        />

                                        <StatusBarPanel
                                            testJson={testJson}
                                            animationFrame={animationFrame}
                                        />
                                        <Simulator
                                            testJson={testJson}
                                            animationFrame={animationFrame}
                                            showDebug={checkedShowDebugInfo}
                                        />

                                        <MidScreenControl
                                            runnable={!(p1 == null || p2 == null)}
                                            testJsonAvailable={testJson ? true : false}
                                            animationFrame = {animationFrame}
                                            n_cycles = {N_FRAMES}
                                            animationState = {animationState}
                                            handleClick = {handleMidScreenControlClick}
                                            handleSlideChange = {
                                                evt => {
                                                    if (animationState == 'Run') return;
                                                    const slide_val: number = parseInt(evt.target.value);
                                                    setAnimationFrame(slide_val);
                                                }
                                            }
                                            checkedShowDebugInfo = {checkedShowDebugInfo}
                                            handleChangeDebugInfo = {() => setCheckedShowDebugInfo(
                                                (_) => !checkedShowDebugInfo
                                            )}
                                        />
                                        <FrameInspector
                                            testJson={testJson}
                                            animationFrame={animationFrame}
                                        />
                                    </div>
                                }
                                <ConnectWallet open={walletSelectOpen} setSettingOpen={setWalletSelectOpen}/>
                                {/* <LoadTestJson
                                    handleLoadTestJson={handleLoadTestJson}
                                    handleClickPreloadedTestJson={handleClickPreloadedTestJson}
                                /> */}
                            </div>
                        </Grid>
                        <Grid item xs={4} sx={{ bgcolor: 'grey.50' }}>
                            <SidePanel
                                isReadOnly={true}
                                createNewAgentFromBlank={setAgentInPanelToBlank}
                                agentName={agentName}
                                setAgentName={setAgentName}
                                workingTab={workingTab}
                                handleClickTab={setWorkingTab}
                                character={character}
                                setCharacter={(value) => {
                                    console.log('setCharacter:', value)
                                    setCharacter(value)
                                }}
                                mentalStates={mentalStates}
                                setMentalStates={setMentalStates}
                                initialMentalState={initialMentalState}
                                handleSetInitialMentalState={setInitialMentalState}
                                combos={combos}
                                setCombos={setCombos}
                                handleValidateCombo={handleValidateCombo}
                                handleAddMentalState={handleAddMentalState}
                                handleClickRemoveMentalState={handleClickRemoveMentalState}
                                handleSetMentalStateAction={handleSetMentalStateAction}
                                treeEditor={treeEditor}
                                handleClickTreeEditor={handleClickTreeEditor}
                                trees={trees}
                                setTrees={setTrees}
                                handleUpdateTree={handleUpdateTree}
                                functions={functions}
                                setFunctions={setFunctions}
                                handleUpdateGeneralFunction={handleUpdateGeneralFunction}
                                handleConfirmFunction={handleConfirmFunction}
                                handleClickDeleteFunction={handleClickDeleteFunction}
                                functionUnderEditIndex={functionUnderEditIndex}
                                setFunctionUnderEditIndex={setFunctionUnderEditIndex}
                                isGeneralFunctionWarningTextOn={isGeneralFunctionWarningTextOn}
                                generalFunctionWarningText={generalFunctionWarningText}
                                isTreeEditorWarningTextOn={isTreeEditorWarningTextOn}
                                treeEditorWarningText={treeEditorWarningText}
                                handleRemoveElementGeneralFunction={handleRemoveElementGeneralFunction}
                                runCairoSimulationWarning={runCairoSimulationWarning}
                                onComboChange={setAdversaryCombo}
                                fighterSelection={fighterSelection}
                                setFighterSelection={setFighterSelection}
                                agents={agents}
                            />
                        </Grid>
                    </Grid>
                </ThemeProvider>
        </div>
    )
}
