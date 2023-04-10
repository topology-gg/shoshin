import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useEffect, useMemo, useState } from "react";
import { Box, ThemeProvider } from "@mui/material";
import MidScreenControl from "../src/components/MidScreenControl";
import EditorView from "../src/components/sidePanelComponents/EditorView";
import { FrameScene, TestJson } from "../src/types/Frame";
import { Tree, Direction } from "../src/types/Tree";
import {
    Condition,
    ConditionElement,
    ConditionVerificationResult,
    includeBodyState,
    validateConditionName,
    verifyValidCondition,
} from "../src/types/Condition";
import { MentalState } from "../src/types/MentalState";
import {
    Character,
    CONTRACT_ADDRESS,
    DEFENSIVE_AGENT,
    ENTRYPOINT_AGENT_SUBMISSION,
    IDLE_AGENT,
    INITIAL_COMBOS,
    INITIAL_DECISION_TREES,
    INITIAL_CONDITIONS,
    INITIAL_CONDITION_INDEX,
    INITIAL_MENTAL_STATES,
    OFFENSIVE_AGENT,
    EditorMode,
    BLANK_AGENT,
} from "../src/constants/constants";
import Agent, { agentToCalldata, buildAgent } from "../src/types/Agent";
import StatusBarPanel from "../src/components/StatusBar";
import P1P2SettingPanel, {
    AgentOption,
} from "../src/components/P1P2SettingPanel";
import FrameInspector from "../src/components/FrameInspector";
import useRunCairoSimulation from "../src/hooks/useRunCairoSimulation";
import { useAgents } from "../lib/api";
import {
    Metadata,
    SingleMetadata,
    splitMetadata,
    splitSingleMetadata,
} from "../src/types/Metadata";
import {
    useAccount,
    useConnectors,
    useStarknetExecute,
} from "@starknet-react/core";
import ConnectWallet from "../src/components/ConnectWallet";
import { EditorTabName } from "../src/components/sidePanelComponents/EditorTabs";
import { unwrapLeafToCondition, unwrapLeafToTree } from "../src/types/Leaf";
import dynamic from "next/dynamic";
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ContractInformationView from "../src/components/sidePanelComponents/ContractInformationView"
import WalletConnectView from "../src/components/sidePanelComponents/WalletConnectView"
import crypto from "crypto";
import SwipeableContent from "../src/components/layout/SwipeableContent";
import theme from "../src/theme/theme";

//@ts-ignore
const Game = dynamic(() => import("../src/Game/PhaserGame"), {
    ssr: false,
});

export default function Home() {
    // Constants
    const LATENCY = 100;
    const runnable = true;

    // React states for simulation / animation control
    const [output, setOuput] = useState<FrameScene>();
    const [simulationError, setSimulationError] = useState();
    const [p1, setP1] = useState<Agent>();
    const [p1Label, setP1Label] = useState<string>("");
    const [p2, setP2] = useState<Agent>();
    const [p2Label, setP2Label] = useState<string>("");
    const [loop, setLoop] = useState<NodeJS.Timer>();
    const [animationFrame, setAnimationFrame] = useState<number>(0);
    const [animationState, setAnimationState] = useState<string>("Stop");
    const [testJson, setTestJson] = useState<TestJson>(null);
    const [checkedShowDebugInfo, setCheckedShowDebugInfo] =
        useState<boolean>(false);

    // React states for UI
    const [workingTab, setWorkingTab] = useState<EditorTabName>(
        EditorTabName.Profile
    );
    const [settingModalOpen, setSettingModalOpen] = useState<boolean>(false);
    const [treeEditor, setTreeEditor] = useState<number>(0);
    const [conditionUnderEditIndex, setConditionUnderEditIndex] =
        useState<number>(INITIAL_CONDITION_INDEX);
    const [editorMode, setEditorMode] = useState<EditorMode>(
        EditorMode.ReadOnly
    );

    // React states for tracking the New Agent being edited in the right panel
    const [initialMentalState, setInitialMentalState] = useState<number>(0);
    const [combos, setCombos] = useState<number[][]>(INITIAL_COMBOS);
    const [mentalStates, setMentalStates] = useState<MentalState[]>(
        INITIAL_MENTAL_STATES
    );
    const [trees, setTrees] = useState<Tree[]>(INITIAL_DECISION_TREES);
    const [conditions, setConditions] =
        useState<Condition[]>(INITIAL_CONDITIONS);
    const [agentName, setAgentName] = useState<string>("");
    const [character, setCharacter] = useState<Character>(Character.Jessica);

    // React states for warnings
    const [isConditionWarningTextOn, setConditionWarningTextOn] =
        useState<boolean>(false);
    const [conditionWarningText, setConditionWarningText] =
        useState<string>("");
    const [isTreeEditorWarningTextOn, setTreeEditorWarningTextOn] =
        useState<boolean>(false);
    const [treeEditorWarningText, setTreeEditorWarningText] =
        useState<string>("");
    const [runCairoSimulationWarning, setCairoSimulationWarning] =
        useState<string>("");

    // Retrieve the last 20 agents submissions from the db
    const { data: data } = useAgents();
    const t: SingleMetadata[] = data?.agents;
    const agents: Agent[] = t?.map(splitSingleMetadata).flat();

    const newAgent: Agent = useMemo(() => {
        let builtAgent = handleBuildAgent();
        if (p1Label === "new agent") {
            setP1(builtAgent);
        }
        if (p2Label === "new agent") {
            setP2(builtAgent);
        }
        return builtAgent;
    }, [
        character,
        mentalStates,
        combos,
        trees,
        conditions,
        initialMentalState,
    ]);

    const { runCairoSimulation, wasmReady } = useRunCairoSimulation(p1, p2);

    useEffect(() => {
        if (output) {
            console.log('caught output:', output)
            setTestJson((_) => {
                return {
                    agent_0: { frames: output.agent_0, type: p1.character },
                    agent_1: { frames: output.agent_1, type: p2.character },
                };
            });
        }
    }, [output]);

    useEffect(() => {
        if (!simulationError) return;

        setCairoSimulationWarning(
            "Incorrect agent, please verify. If error persists, please contact us on Discord."
        );
        setTimeout(() => setCairoSimulationWarning(""), 5000);
    }, [simulationError]);

    // Starknet states
    const { account, address, status } = useAccount();
    const [hash, setHash] = useState<string>();
    const callData = useMemo(() => {
        let args = agentToCalldata(newAgent);
        const tx = {
            contractAddress: CONTRACT_ADDRESS,
            entrypoint: ENTRYPOINT_AGENT_SUBMISSION,
            calldata: args,
        };
        return [tx];
    }, [newAgent]);
    const { execute } = useStarknetExecute({ calls: callData });
    const { available, connect } = useConnectors();
    const [connectors, setConnectors] = useState([]);
    // Connectors are not available server-side therefore we
    // set the state in a useEffect hook
    useEffect(() => {
        if (available) setConnectors(available);
    }, [available]);

    useEffect(() => {
        if (hash) {
            account
                .waitForTransaction(hash)
                .then(() => console.log("Success!"))
                .catch((err) => {
                    console.log("Error! Please try again.");
                    console.error(err);
                });
        }
    }, [hash]);

    // Decode from React states
    if (testJson !== null) {
        //console.log("testJson:", testJson);
    }
    const N_FRAMES = testJson == null ? 0 : testJson.agent_0.frames.length;

    function handleMidScreenControlClick(operation: string) {
        if (operation == "NextFrame" && animationState != "Run") {
            animationStepForward(N_FRAMES);
        } else if (operation == "PrevFrame" && animationState != "Run") {
            animationStepBackward();
        } else if (operation == "ToggleRun") {
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
                        animationStepForward(N_FRAMES);
                    }, LATENCY)
                );
            }

            // If in Stop => perform simulation then go to Run
            else if (animationState == "Stop" && runnable) {
                const [out, err] = runCairoSimulation();
                if (err != null) {
                    setSimulationError(err);
                    return;
                }
                setOuput(out);

                // Begin animation
                setAnimationState("Run");

                setLoop(
                    setInterval(() => {
                        animationStepForward(out.agent_0.length);
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

    const animationStepForward = (frames) => {
        setAnimationFrame((prev) => (prev == frames - 1 ? prev : prev + 1));
    };
    const animationStepBackward = () => {
        setAnimationFrame((prev) => (prev > 0 ? prev - 1 : prev));
    };

    function handleLoadTestJson(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event) {
        const loadedJsonString = JSON.parse(event.target.result);
        const loadedJson = JSON.parse(loadedJsonString);
        console.log("loaded json:", loadedJson);
        setTestJson((_) => loadedJson);
    }

    function handleClickPreloadedTestJson(testJson) {
        const preloadedJson = JSON.parse(testJson);
        console.log("preloaded json:", preloadedJson);
        setTestJson((_) => preloadedJson);
    }

    async function handleSubmitAgent() {
        if (!account) {
            console.log("> wallet not connected yet");
            setSettingModalOpen((_) => true);
            return;
        }

        console.log("> connected address:", String(address));

        // submit tx
        console.log("> submitting args:", callData);
        try {
            setHash("");
            const response = await execute();
            setHash(response.transaction_hash);
        } catch (err) {
            console.error(err);
        }
        return;
    }

    function handleSetMentalStateAction(index: number, action: number) {
        setMentalStates((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy[index] = {
                state: prev_copy[index].state,
                action: action,
            };
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
            setInitialMentalState(0);
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
        setTreeEditorWarningTextOn(false);
        setTreeEditor(index);
    }

    // Parses the user input into a tree. If the input is invalid,
    // the warning text is displayed and the tree is not updated.
    function handleUpdateTree(index: number, input: string) {
        let new_tree = { nodes: [] };
        // regexp string for matching pattern matching expressions
        let pattern = /^(\S+)\s*=>\s*(.+?)(?:\n|$)/gm;

        let f = conditions.slice(0, conditions.length - 1).map((f, _) => {
            return f;
        });
        let ms = mentalStates.map((m) => {
            return m.state;
        });
        let match;
        // match condition and mental state: add the node to the tree
        // match mental state and _ : add the node to the tree
        // otherwise display warning text
        while ((match = pattern.exec(input))) {
            let fCondition = f.find(
                (condition) => condition.displayName == match[1]
            );

            let mCondition = ms.includes(match[2]);
            if (fCondition && mCondition) {
                new_tree.nodes.push(
                    { id: fCondition.key, isChild: false },
                    { id: match[2], isChild: true, branch: Direction.Left }
                );
            } else if (mCondition && match[1] === "_") {
                new_tree.nodes.push({
                    id: match[2],
                    isChild: true,
                    branch: Direction.Right,
                });
            } else {
                let text = !fCondition
                    ? !mCondition
                        ? `Condition ${match[1]} and mental state ${match[2]} not included in currect build`
                        : `Condition ${match[1]} not included in current build`
                    : `Mental state ${match[2]} not included in current build`;
                setTreeEditorWarningTextOn(true);
                setTreeEditorWarningText(text);
                return;
            }
        }
        setTreeEditorWarningTextOn(false);

        setTrees((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy[index] = new_tree;
            return prev_copy;
        });
    }

    function saveCondition(
        index: number,
        conditionElements: ConditionElement[]
    ){
        setConditions((prev) => {
        let prev_copy: Condition[] = JSON.parse(JSON.stringify(prev));
        if (!prev_copy[index].key) {
            prev_copy[index].key = crypto
                .createHash("sha256")
                .update(Date.now().toString())
                .digest("hex")
                .toString();
        }

            prev_copy[index].elements = conditionElements

            if(prev_copy.length - 1 == index)
            {
                prev_copy.push({ elements: [] });
            }
            

            console.log(prev_copy)


            return prev_copy;

        });

    }

    function handleUpdateCondition(
        index: number,
        element: ConditionElement,
        displayName: string
    ) {
        setConditions((prev) => {
            let prev_copy: Condition[] = JSON.parse(JSON.stringify(prev));
            if (index == 0 && !prev_copy[index]) {
                prev_copy = [{ elements: [] }];
            }

            const excludingSelectedCondition = prev_copy.filter((_, i) => index != i)
            const nameError = validateConditionName(displayName, excludingSelectedCondition);
            if (nameError) {
                setConditionWarningTextOn(true);
                setConditionWarningText(nameError);
                setTimeout(() => setConditionWarningTextOn(false), 5000);
                return prev_copy;
            }
            prev_copy[index].displayName = displayName;
            if (!prev_copy[index].key) {
                prev_copy[index].key = crypto
                    .createHash("sha256")
                    .update(Date.now().toString())
                    .digest("hex")
                    .toString();
            }

            if (element) {
                prev_copy[index].elements.push(element);
                let result : ConditionVerificationResult = verifyValidCondition(
                    prev_copy[index],
                    false
                );
                if (!result.isValid) {
                    setConditionWarningTextOn(true);
                    setConditionWarningText(
                        `Invalid ${element.type}, got: ${result.message}`
                    );
                    setTimeout(() => setConditionWarningTextOn(false), 5000);
                    prev_copy[index].elements.pop();
                }
            }
            return prev_copy;
        });
    }

    function handleRemoveConditionElement(index: number) {
        setConditions((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            if (!prev_copy[index]) {
                return prev_copy;
            }
            let f = prev_copy[index];
            const length = f.elements.length;
            if (length) {
                f.elements.splice(length - 1);
                prev_copy[index] = f;
            }
            return prev_copy;
        });
    }

    function handleConfirmCondition() {
        let length = conditions.length;
        let f = conditions[conditionUnderEditIndex];
        let result : ConditionVerificationResult = verifyValidCondition(f, true);
        if (!f?.elements || !result.isValid) {
            setConditionWarningTextOn(true);
            setConditionWarningText(`Invalid function, got: ${result.message}`);
            setTimeout(() => setConditionWarningTextOn(false), 5000);
            return;
        }
        if (conditionUnderEditIndex < length - 1) {
            setConditionUnderEditIndex(() => {
                return length - 1;
            });
            return;
        }
        if (conditions[length - 1]?.elements.length > 0) {
            setConditionUnderEditIndex((prev) => {
                return prev + 1;
            });
            setConditions((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev));
                prev_copy.push({ elements: [] });
                return prev_copy;
            });
        }
    }

    function handleClickDeleteCondition(index: number) {
        if (
            trees.some((tree) =>
                tree.nodes.some((node) => node.id === `F${index}`)
            )
        ) {
            alert(
                "The condition cannot be deleted. It is used in the decision tree"
            );
            return;
        }
        setConditionUnderEditIndex((prev) => {
            if (index !== 0 && index === prev) {
                return prev - 1;
            }
            return prev;
        });
        setConditions((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy.splice(index, 1);
            return prev_copy;
        });
    }

    function handleValidateCombo(combo: number[], index: number) {
        if (combo.length > 0) {
            if (index === null) {
                setCombos((prev) => {
                    let prev_copy: number[][] = JSON.parse(
                        JSON.stringify(prev)
                    );
                    prev_copy.push(combo);
                    return prev_copy;
                });
                return;
            }
            setCombos((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev));
                prev_copy[index] = combo;
                return prev_copy;
            });
        }
    }

    function handleBuildAgent() {
        let char = Object.keys(Character).indexOf(character);
        return buildAgent(
            mentalStates,
            combos,
            trees.slice(0, -1),
            conditions.slice(0, -1),
            initialMentalState,
            char
        );
    }

    //
    // Function that sets either P1 or P2 to a specified Agent
    //
    function agentChange(
        whichPlayer: string,
        event: object,
        value: AgentOption
    ) {
        let setAgent: Agent;

        // if Agent is not specified with the function call, set P1 or P2 to null
        if (!value) {
            if (whichPlayer == "P1") {
                setP1(() => null);
            } else {
                setP2(() => null);
            }
            return;
        }

        // get agent from value
        if (value.label == "idle agent") {
            setAgent = IDLE_AGENT;
        }
        if (value.label == "defensive agent") {
            setAgent = DEFENSIVE_AGENT;
        }
        if (value.label == "offensive agent") {
            setAgent = OFFENSIVE_AGENT;
        }
        if (value.label == "new agent") {
            setAgent = newAgent;
        } else if (value.group == "Registry") {
            setAgent = agents[value.index];
        }

        // setP1 / setP2 depending on whichPlayer
        if (whichPlayer == "P1") {
            setP1Label(value.label);
            setP1(() => setAgent);
        } else {
            setP2Label(value.label);
            setP2(() => setAgent);
        }
    }

    //
    // Set Agent in the side panel to blank agent
    //
    function setAgentInPanelToBlank() {
        setInitialMentalState(() => 0);
        setCombos(() => []);
        setMentalStates(() => []);
        setTrees(() => []);
        setConditions(() => []);
        setAgentName(() => "");
        setCharacter(() => Character.Jessica);
        setConditionUnderEditIndex(() => 0);
    }
    function setAgentInPanelToAgent(agent: Agent) {
        // parse the given agent into new values for the React states
        setInitialMentalState(() => agent.initialState);
        setCombos(() => agent.combos);
        setMentalStates(
            agent.mentalStatesNames
                .map((s, i) => [s, agent.actions[i]] as [string, number])
                .map((x) => {
                    return { state: x[0], action: x[1] };
                })
        );
        setTrees(() => {
            let tree = agent.mentalStates.map((x) => {
                return { nodes: unwrapLeafToTree(x, agent.mentalStatesNames) };
            });
            tree.push({ nodes: [] }); // add an empty tree for editing
            return tree;
        });
        setConditions(() => {

            let cond: Condition[] = agent.conditions.map((x, i) => {
                let conditionName = agent.conditionNames[i] ? agent.conditionNames[i] : `F${i}`
                return {
                    elements: includeBodyState(unwrapLeafToCondition(x)),
                    key: `F${i}`,
                    displayName: conditionName,
                };
            });
            cond.push({ elements: [] }); // add an empty condition for editing
            return cond;
        });
        setAgentName(() => "");
        setCharacter(() =>
            agent.character == 0 ? Character.Jessica : Character.Antoc
        );
        setConditionUnderEditIndex(() => 0);
    }

    const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

    let EditorViewComponent = (
        <EditorView
            editorMode={editorMode}
            settingModalOpen={settingModalOpen}
            setSettingModalOpen={(bool) =>
                setSettingModalOpen(() => bool)
            }
            studyAgent={(agent: Agent) => {
                setEditorMode(() => EditorMode.ReadOnly);
                setAgentInPanelToAgent(agent);
            }}
            buildNewAgentFromBlank={() => {
                setEditorMode(() => EditorMode.Edit);
                setAgentInPanelToAgent(BLANK_AGENT);
            }}
            buildNewAgentFromAgent={(agent: Agent) => {
                setEditorMode(() => EditorMode.Edit);
                setAgentInPanelToAgent(agent);
            }}
            agentName={agentName}
            setAgentName={setAgentName}
            workingTab={workingTab}
            handleClickTab={setWorkingTab}
            character={character}
            setCharacter={(value) => {
                console.log("setCharacter:", value);
                setCharacter(value);
            }}
            mentalStates={mentalStates}
            initialMentalState={initialMentalState}
            handleSetInitialMentalState={setInitialMentalState}
            combos={combos}
            handleValidateCombo={handleValidateCombo}
            handleAddMentalState={handleAddMentalState}
            handleClickRemoveMentalState={
                handleClickRemoveMentalState
            }
            handleSetMentalStateAction={
                handleSetMentalStateAction
            }
            treeEditor={treeEditor}
            handleClickTreeEditor={handleClickTreeEditor}
            trees={trees}
            handleUpdateTree={handleUpdateTree}
            conditions={conditions}
            handleSaveCondition={saveCondition}
            handleUpdateCondition={handleUpdateCondition}
            handleConfirmCondition={handleConfirmCondition}
            handleClickDeleteCondition={
                handleClickDeleteCondition
            }
            conditionUnderEditIndex={conditionUnderEditIndex}
            setConditionUnderEditIndex={
                setConditionUnderEditIndex
            }
            isConditionWarningTextOn={isConditionWarningTextOn}
            conditionWarningText={conditionWarningText}
            isTreeEditorWarningTextOn={
                isTreeEditorWarningTextOn
            }
            treeEditorWarningText={treeEditorWarningText}
            handleRemoveConditionElement={
                handleRemoveConditionElement
            }
            handleSubmitAgent={handleSubmitAgent}
            agents={agents}
        />
    )

    let FightView = (
        <div className={styles.main}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <P1P2SettingPanel
                    agentsFromRegistry={t}
                    agentChange={agentChange}
                />

                <StatusBarPanel
                    testJson={testJson}
                    animationFrame={animationFrame}
                />

                <Game
                    testJson={testJson}
                    animationFrame={animationFrame}
                    animationState={animationState}
                    showDebug={checkedShowDebugInfo}
                />

                <MidScreenControl
                    runnable={!(p1 == null || p2 == null)}
                    testJsonAvailable={
                        testJson ? true : false
                    }
                    testJson={testJson}
                    animationFrame={animationFrame}
                    n_cycles={N_FRAMES}
                    animationState={animationState}
                    handleClick={
                        handleMidScreenControlClick
                    }
                    handleSlideChange={(evt) => {
                        if (animationState == "Run") return;
                        console.log('handleSlideChange::value', evt.target.value)
                        const slide_val: number = parseInt(
                            evt.target.value
                        );
                        setAnimationFrame(slide_val);
                    }}
                    checkedShowDebugInfo={
                        checkedShowDebugInfo
                    }
                    handleChangeDebugInfo={() =>
                        setCheckedShowDebugInfo(
                            (_) => !checkedShowDebugInfo
                        )
                    }
                />
                <FrameInspector
                    testJson={testJson}
                    animationFrame={animationFrame}
                />
            </div>
        </div>
    )

    const [swipeableViewIndex, setSwipeableViewIndex] = useState(0);
    //
    // Render
    //
    return (
        <div className={styles.container}>
            <Head>
                <title>Shoshin Tooling</title>
                <meta
                    name="shoshin-tooling"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>


                <Tabs
                    value={swipeableViewIndex}
                    onChange={(event, newValue) => setSwipeableViewIndex((_) => newValue)}
                    aria-label="basic tabs example"
                    sx={{mt:2}}
                    centered
                >
                    <Tab label={'Fight'}/>
                    <Tab label={'Edit'}/>
                    <Tab label={'Reference'}/>
                    <Tab label={'Wallet'}/>
                </Tabs>

                <Box sx={{flex: 1, pt: 5}}>
                    <ThemeProvider theme={theme}>
                        <SwipeableViews
                            index={swipeableViewIndex}
                            containerStyle={{
                                transition: 'transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s'
                            }}
                            // ^reference to this magical fix: https://github.com/oliviertassinari/react-swipeable-views/issues/599#issuecomment-657601754
                            // a fix for the issue: first index change doesn't animate (swipe)
                        >
                            <SwipeableContent>{ FightView }</SwipeableContent>
                            <SwipeableContent>{ EditorViewComponent }</SwipeableContent>
                            <SwipeableContent sx={{ paddingLeft: '10rem', paddingRight: '10rem' }}><ContractInformationView /></SwipeableContent>
                            <SwipeableContent sx={{ paddingLeft: '10rem', paddingRight: '10rem' }}><WalletConnectView /></SwipeableContent>
                        </SwipeableViews>
                    </ThemeProvider>
                </Box>

        </div>
    );
}
