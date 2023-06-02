import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useEffect, useMemo, useState, useContext, useRef } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Snackbar,
    ThemeProvider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MidScreenControl from '../src/components/MidScreenControl';
import EditorView from '../src/components/sidePanelComponents/EditorView';
import {
    Frame,
    FrameScene,
    TestJson,
    getFlattenedPerceptiblesFromFrame,
    getSizeOfRealTimeInputScene,
} from '../src/types/Frame';
import { Tree, Direction } from '../src/types/Tree';
import {
    Condition,
    ConditionElement,
    ConditionVerificationResult,
    generateConditionKey,
    includeBodyState,
    validateConditionName,
    verifyValidCondition,
} from '../src/types/Condition';
import { MentalState } from '../src/types/MentalState';
import {
    Character,
    CONTRACT_ADDRESS,
    DEFENSIVE_AGENT,
    ENTRYPOINT_AGENT_SUBMISSION,
    IDLE_AGENT,
    OFFENSIVE_AGENT,
    EditorMode,
} from '../src/constants/constants';
import Agent, { agentToCalldata, buildAgent } from '../src/types/Agent';
import StatusBarPanel, {
    StatusBarPanelProps as PlayerStatuses,
} from '../src/components/StatusBar';
import P1P2SettingPanel from '../src/components/settingsPanels/P1P2SettingPanel';
import { AgentOption } from '../src/components/settingsPanels/settingsPanel';
import FrameInspector from '../src/components/FrameInspector';
import useRunCairoSimulation from '../src/hooks/useRunCairoSimulation';
import useEvaluateCondition from '../src/hooks/useEvaluateCondition';
import { useAgents, useLeagueAgents } from '../lib/api';
import { SingleMetadata, splitSingleMetadata } from '../src/types/Metadata';
import {
    useAccount,
    useConnectors,
    useStarknetExecute,
} from '@starknet-react/core';
import { EditorTabName } from '../src/components/sidePanelComponents/EditorTabs';
import Leaf, {
    unwrapLeafToCondition,
    unwrapLeafToTree,
} from '../src/types/Leaf';
import dynamic from 'next/dynamic';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ContractInformationView from '../src/components/sidePanelComponents/ContractInformationView';
import WalletConnectView from '../src/components/sidePanelComponents/WalletConnectView';
import SwipeableContent from '../src/components/layout/SwipeableContent';
import theme from '../src/theme/theme';
import FrameDecisionPathViewer from '../src/components/FrameDecisionPathViewer';
import useMediaQuery from '@mui/material/useMediaQuery';
import MobileView from '../src/components/MobileView';
import { GameModes } from '../src/types/Simulator';
import RealTimeSettingPanel from '../src/components/settingsPanels/RealTimeSettingPanel';
import RegistrationPage from '../src/components/register/Register';
import { ShoshinWASMContext } from '../src/context/wasm-shoshin';
import {
    INITIAL_AGENT_COMPONENTS,
    STARTER_AGENT,
} from '../src/constants/starter_agent';
import MidScreenKeybinding from '../src/components/MidScreenKeybinding';
import { KeyboardShortcut } from '../src/types/UI';

//@ts-ignore
const Game = dynamic(() => import('../src/Game/PhaserGame'), {
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
    const [p1Label, setP1Label] = useState<string>('');
    const [p2, setP2] = useState<Agent>();
    const [p2Label, setP2Label] = useState<string>('');
    const [loop, setLoop] = useState<NodeJS.Timer>();
    const [animationFrame, setAnimationFrame] = useState<number>(0);
    const [animationState, setAnimationState] = useState<string>('Stop');
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
        useState<number>(0);
    const [editorMode, setEditorMode] = useState<EditorMode>(
        EditorMode.ReadOnly
    );

    const [playerStatuses, setPlayerStatuses] = useState<PlayerStatuses>({
        integrity_0: 1000,
        integrity_1: 1000,
        stamina_0: 100,
        stamina_1: 100,
    });

    // React states for tracking the New Agent being edited in the right panel
    const [initialMentalState, setInitialMentalState] = useState<number>(0);
    const [combos, setCombos] = useState<number[][]>(
        INITIAL_AGENT_COMPONENTS.combos
    );
    const [mentalStates, setMentalStates] = useState<MentalState[]>(
        INITIAL_AGENT_COMPONENTS.mentalStates
    );
    const [trees, setTrees] = useState<Tree[]>(INITIAL_AGENT_COMPONENTS.trees);
    const [conditions, setConditions] =
        //@ts-ignore
        useState<Condition[]>(INITIAL_AGENT_COMPONENTS.conditions);
    const [agentName, setAgentName] = useState<string>('');
    const [character, setCharacter] = useState<Character>(Character.Jessica);

    const [gameMode, setGameMode] = useState<GameModes>(GameModes.simulation);
    const [realTimeCharacter, setRealTimeCharacter] = useState<number>(0);

    // React states for warnings
    const [isConditionWarningTextOn, setConditionWarningTextOn] =
        useState<boolean>(false);
    const [conditionWarningText, setConditionWarningText] =
        useState<string>('');
    const [isTreeEditorWarningTextOn, setTreeEditorWarningTextOn] =
        useState<boolean>(false);
    const [treeEditorWarningText, setTreeEditorWarningText] =
        useState<string>('');
    const [runCairoSimulationWarning, setCairoSimulationWarning] =
        useState<string>('');

    // React state for tracking which tab is active in contract information view (Reference tab)
    const [contractInformationTabIndex, setContractInformationTabIndex] = useState<number>(0);

    const [successToastOpen, setToastOpen] = React.useState(false);

    const handleToastClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setToastOpen(false);
    };

    const [keyDownState, setKeyDownState] = useState<{
        [keyName: string]: boolean;
    }>({});

    // Handle key events the React way
    const ref = useRef(null);
    useEffect(() => {
        ref.current.focus();
    }, [ref.current]);

    const handleKeyDown = (e) => {
        // console.log('keydown', e.key);
        setKeyDownState((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy[e.key] = true;
            return prev_copy;
        });

        if (e.key == '[') {
            setSwipeableViewIndex((prev) => {
                if (prev == 0) return prev;
                else return prev - 1;
            });
        } else if (e.key == ']') {
            setSwipeableViewIndex((prev) => {
                if (prev == 3) return prev;
                else return prev + 1;
            });
        } else if (e.key == ';') {
            if (swipeableViewIndex == 1) {
                // in Editor tab
                setWorkingTab((prev) => {
                    if (prev == EditorTabName.Profile) return prev;
                    else if (prev == EditorTabName.Mind)
                        return EditorTabName.Profile;
                    else if (prev == EditorTabName.Combos)
                        return EditorTabName.Mind;
                    else return EditorTabName.Combos;
                });
            }
            else if (swipeableViewIndex == 2) {
                // in Reference tab
                setContractInformationTabIndex((prev) => {
                    if (prev == 0) return prev;
                    else return prev-1;
                })
            }
        } else if (e.key == "'") {
            if (swipeableViewIndex == 0) {
                // in Fight tab
                toggleGameMode()
            }
            else if (swipeableViewIndex == 1) {
                // in Edit tab
                setWorkingTab((prev) => {
                    if (prev == EditorTabName.Conditions) return prev;
                    else if (prev == EditorTabName.Combos)
                        return EditorTabName.Conditions;
                    else if (prev == EditorTabName.Mind)
                        return EditorTabName.Combos;
                    else if (prev == EditorTabName.Profile)
                        return EditorTabName.Mind;
                });
            }
            else if (swipeableViewIndex == 2) {
                // in Reference tab
                setContractInformationTabIndex((prev) => {
                    if (prev == 2) return prev;
                    else return prev+1;
                })
            }
        }
    };
    const handleKeyUp = (e) => {
        // console.log('keyup', e.key);
        setKeyDownState((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy[e.key] = false;
            return prev_copy;
        });
    };

    // Retrieve the last 20 agents submissions from the db
    const { data: data } = useAgents();
    const t: SingleMetadata[] = data?.agents;
    const agents: Agent[] = t?.map(splitSingleMetadata).flat();

    const { data: leagueData } = useLeagueAgents();

    let leagueAgents: Agent[] = leagueData?.agents
        ?.map(splitSingleMetadata)
        .flat();

    const newAgent: Agent = useMemo(() => {
        let builtAgent = handleBuildAgent();
        if (p1Label === 'your agent') {
            setP1(builtAgent);
        }
        if (p2Label === 'your agent') {
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

    const { runCairoSimulation } = useRunCairoSimulation(p1, p2);
    const { runEvaluateCondition } = useEvaluateCondition();
    const ctx = useContext(ShoshinWASMContext);

    getSizeOfRealTimeInputScene();

    const isMobileDisplay = useMediaQuery('(max-width:800px)');

    useEffect(() => {
        if (output) {
            console.log('caught output:', output);
            setTestJson((_) => {
                return {
                    agent_0: { frames: output.agent_0, type: p1.character },
                    agent_1: { frames: output.agent_1, type: p2.character },
                };
            });
        }
    }, [output]);

    useEffect(() => {
        const integrity_0 = testJson
            ? testJson.agent_0.frames[animationFrame].body_state.integrity
            : 0;
        const integrity_1 = testJson
            ? testJson.agent_1.frames[animationFrame].body_state.integrity
            : 0;
        const stamina_0 = testJson
            ? testJson.agent_0.frames[animationFrame].body_state.stamina
            : 0;
        const stamina_1 = testJson
            ? testJson.agent_1.frames[animationFrame].body_state.stamina
            : 0;

        setPlayerStatuses({
            integrity_0,
            integrity_1,
            stamina_0,
            stamina_1,
        });
    }, [testJson, animationFrame]);

    useEffect(() => {
        if (!simulationError) return;

        setCairoSimulationWarning(
            'Incorrect agent, please verify. If error persists, please contact us on Discord.'
        );
        setTimeout(() => setCairoSimulationWarning(''), 5000);
    }, [simulationError]);

    // Starknet states
    const { account, address, status } = useAccount();
    const [isWhiteListed, setIsWhiteListed] = useState<boolean>(false);
    const isProduction = process.env.NODE_ENV === 'production';
    const [txPending, setTxPending] = useState<boolean>(false);
    const [txStatusText, setTxStatusText] = useState<string>();
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
            setTxStatusText('Submission Pending');
            account
                .waitForTransaction(hash, 10000, [
                    'ACCEPTED_ON_L1',
                    'ACCEPTED_ON_L2',
                ])
                .then(() => setTxStatusText('Success!'))
                .catch((err) => {
                    setTxStatusText('Error! Please try again.');
                    console.error(err);
                })
                .finally(() => setTxPending(false));
        }
    }, [hash, account]);

    // Decode from React states
    if (testJson !== null) {
        //console.log("testJson:", testJson);
    }
    const N_FRAMES = testJson == null ? 0 : testJson.agent_0.frames.length;

    function handleMidScreenControlClick(operation: string) {
        if (operation == 'NextFrame' && animationState != 'Run') {
            animationStepForward(N_FRAMES);
        } else if (operation == 'PrevFrame' && animationState != 'Run') {
            animationStepBackward();
        } else if (operation == 'ToggleRun') {
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
                const [out, err] = runCairoSimulation();
                if (err != null) {
                    setSimulationError(err);
                    return;
                }
                setOuput(out);

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
        console.log('loaded json:', loadedJson);
        setTestJson((_) => loadedJson);
    }

    function handleClickPreloadedTestJson(testJson) {
        const preloadedJson = JSON.parse(testJson);
        console.log('preloaded json:', preloadedJson);
        setTestJson((_) => preloadedJson);
    }

    async function handleSubmitAgent() {
        if (!account) {
            console.log('> wallet not connected yet');
            setSettingModalOpen((_) => true);
            return;
        }

        console.log('> connected address:', String(address));

        // submit tx
        console.log('> submitting args:', callData);
        try {
            setTxPending(true);
            setHash('');
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
            } else if (mCondition && match[1] === '_') {
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
    ) {
        setConditions((prev) => {
            let prev_copy: Condition[] = JSON.parse(JSON.stringify(prev));
            if (!prev_copy[index].key) {
                prev_copy[index].key = generateConditionKey();
            }

            prev_copy[index].elements = conditionElements;

            if (prev_copy.length - 1 == index) {
                prev_copy.push({ elements: [] });
            }

            console.log(prev_copy);

            setToastOpen(true);
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

            const excludingSelectedCondition = prev_copy.filter(
                (_, i) => index != i
            );
            const nameError = validateConditionName(
                displayName,
                excludingSelectedCondition
            );
            if (nameError) {
                setConditionWarningTextOn(true);
                setConditionWarningText(nameError);
                setTimeout(() => setConditionWarningTextOn(false), 5000);
                return prev_copy;
            }
            prev_copy[index].displayName = displayName;
            if (!prev_copy[index].key) {
                prev_copy[index].key = generateConditionKey();
            }

            if (element) {
                prev_copy[index].elements.push(element);
                let result: ConditionVerificationResult = verifyValidCondition(
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
        let result: ConditionVerificationResult = verifyValidCondition(f, true);
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
        let condition = conditions[index];
        if (
            trees.some((tree) =>
                tree.nodes.some((node) => node.id === condition.key)
            )
        ) {
            alert(
                'The condition cannot be deleted. It is used in the decision tree'
            );
            return;
        }

        const response = confirm(
            `Are you sure you want to delete the condition '${condition.displayName}'? This action cannot be undone.`
        );

        if (!response) {
            //Cancel delete operation
            return;
        } else {
            alert('Condition deleted');
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
            trees,
            conditions,
            initialMentalState,
            char
        );
    }

    //
    // Function that sets either P1 or P2 to a specified Agent
    //
    function agentChange(whichPlayer: string, value: AgentOption) {
        let setAgent: Agent;

        // if Agent is not specified with the function call, set P1 or P2 to null
        if (!value) {
            if (whichPlayer == 'P1') {
                setP1(() => null);
            } else {
                setP2(() => null);
            }
            return;
        }

        // get agent from value
        if (value.label == 'idle agent') {
            setAgent = IDLE_AGENT;
        }
        if (value.label == 'defensive agent') {
            setAgent = DEFENSIVE_AGENT;
        }
        if (value.label == 'offensive agent') {
            setAgent = OFFENSIVE_AGENT;
        }
        if (value.label == 'your agent') {
            setAgent = newAgent;
        } else if (value.group == 'Registry') {
            setAgent = agents[value.index];
        } else if (value.group == 'League') {
            setAgent = leagueAgents[value.index];
        }

        // setP1 / setP2 depending on whichPlayer
        if (whichPlayer == 'P1') {
            setP1Label(value.label);
            setP1(() => setAgent);
        } else {
            setP2Label(value.label);
            setP2(() => setAgent);
        }
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
                return {
                    nodes: unwrapLeafToTree(
                        x,
                        agent.mentalStatesNames,
                        agent.conditionNames
                    ),
                };
            });
            tree.push({ nodes: [] }); // add an empty tree for editing
            return tree;
        });
        setConditions(() => {
            let cond: Condition[] = agent.conditions.map((x, i) => {
                let conditionName = agent.conditionNames[i]
                    ? agent.conditionNames[i]
                    : `C${i}`;
                return {
                    elements: includeBodyState(unwrapLeafToCondition(x)),
                    key: `${i}`,
                    displayName: conditionName,
                };
            });
            cond.push({ elements: [] }); // add an empty condition for editing
            return cond;
        });
        setAgentName(() => '');
        setCharacter(() =>
            agent.character == 0 ? Character.Jessica : Character.Antoc
        );
        setConditionUnderEditIndex(() => 0);
    }

    function handleEvaluateCondition(
        condition: Leaf,
        selfAgentFrame: Frame,
        opponentAgentFrame: Frame
    ) {
        let perceptiblesSelf =
            getFlattenedPerceptiblesFromFrame(selfAgentFrame);
        let perceptiblesOpponent =
            getFlattenedPerceptiblesFromFrame(opponentAgentFrame);
        let perceptibles = perceptiblesSelf.concat(perceptiblesOpponent);

        let result = runEvaluateCondition(condition, perceptibles);
        return result;
    }

    // Only for testing, can be removed once condition evaluation is integrated
    // useEffect(() => {
    //     if (!output) return
    //     for (const condition of p1.conditions) {
    //         let res = handleEvaluateCondition(condition, output.agent_0[animationFrame], output.agent_1[animationFrame])
    //         console.log('evaluate condition', condition, res[0])
    //     }
    // }, [output, animationFrame])

    const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

    let EditorViewComponent = (
        <EditorView
            editorMode={editorMode}
            settingModalOpen={settingModalOpen}
            setSettingModalOpen={(bool) => setSettingModalOpen(() => bool)}
            studyAgent={(agent: Agent) => {
                setEditorMode(() => EditorMode.ReadOnly);
                setAgentInPanelToAgent(agent);
            }}
            buildNewAgentFromBlank={() => {
                setEditorMode(() => EditorMode.Edit);
                setAgentInPanelToAgent(STARTER_AGENT);
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
                console.log('setCharacter:', value);
                setCharacter(value);
            }}
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
            conditions={conditions}
            handleSaveCondition={saveCondition}
            handleUpdateCondition={handleUpdateCondition}
            handleConfirmCondition={handleConfirmCondition}
            handleClickDeleteCondition={handleClickDeleteCondition}
            conditionUnderEditIndex={conditionUnderEditIndex}
            setConditionUnderEditIndex={setConditionUnderEditIndex}
            isConditionWarningTextOn={isConditionWarningTextOn}
            conditionWarningText={conditionWarningText}
            isTreeEditorWarningTextOn={isTreeEditorWarningTextOn}
            treeEditorWarningText={treeEditorWarningText}
            handleRemoveConditionElement={handleRemoveConditionElement}
            handleSubmitAgent={handleSubmitAgent}
            agents={agents}
            txPending={txPending}
            txHash={hash}
            txStatusText={txStatusText}
        />
    );

    const [swipeableViewIndex, setSwipeableViewIndex] = useState(0);

    // console.log('index.tsx::ctx', ctx)

    const toggleGameMode = () => {
        if (gameMode == GameModes.simulation) {
            handleMidScreenControlClick('stop');
            setGameMode(GameModes.realtime);
        } else {
            setGameMode(GameModes.simulation);
        }
    };

    let FightView = (
        <div className={styles.main}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {ctx.wasm !== undefined ? (
                    <Button variant="text" onClick={() => toggleGameMode()}>
                        {gameMode == GameModes.simulation
                            ? 'Simulation'
                            : 'Real Time'}
                    </Button>
                ) : null}

                {gameMode == GameModes.simulation ? (
                    <P1P2SettingPanel
                        agentsFromRegistry={t}
                        leagueAgents={leagueData?.agents}
                        agentChange={agentChange}
                    />
                ) : (
                    <RealTimeSettingPanel
                        agentsFromRegistry={t}
                        agentChange={agentChange}
                        leagueAgents={leagueData?.agents}
                        changeCharacter={(character) =>
                            setRealTimeCharacter(parseInt(character))
                        }
                    />
                )}

                <StatusBarPanel
                    integrity_0={playerStatuses.integrity_0}
                    integrity_1={playerStatuses.integrity_1}
                    stamina_0={playerStatuses.stamina_0}
                    stamina_1={playerStatuses.stamina_1}
                />

                <Game
                    testJson={testJson}
                    animationFrame={animationFrame}
                    animationState={animationState}
                    showDebug={checkedShowDebugInfo}
                    gameMode={gameMode}
                    realTimeOptions={{
                        playerCharacter: realTimeCharacter,
                        agentOpponent: p2,
                        setPlayerStatuses,
                    }}
                    isInView={swipeableViewIndex == 0}
                />
                {gameMode == GameModes.simulation ? (
                    <MidScreenControl
                        runnable={
                            !(p1 == null || p2 == null) &&
                            gameMode == GameModes.simulation
                        }
                        testJsonAvailable={testJson ? true : false}
                        testJson={testJson}
                        animationFrame={animationFrame}
                        n_cycles={N_FRAMES}
                        animationState={animationState}
                        handleClick={handleMidScreenControlClick}
                        handleSlideChange={(evt) => {
                            if (animationState == 'Run') return;
                            console.log(
                                'handleSlideChange::value',
                                evt.target.value
                            );
                            const slide_val: number = parseInt(
                                evt.target.value
                            );
                            setAnimationFrame(slide_val);
                        }}
                        checkedShowDebugInfo={checkedShowDebugInfo}
                        handleChangeDebugInfo={() =>
                            setCheckedShowDebugInfo(
                                (_) => !checkedShowDebugInfo
                            )
                        }
                    />
                ) : (
                    <MidScreenKeybinding
                        realTimeCharacter={realTimeCharacter}
                        keyDownState={keyDownState}
                    />
                )}

                <div
                    style={{
                        padding: '10px',
                        paddingBottom: '13px',
                        marginBottom: '16px',
                        border: '1px solid #777',
                        borderRadius: '20px',
                    }}
                >
                    <Accordion
                        key="accordion-frame-data"
                        style={{
                            boxShadow: 'none',
                            backgroundColor: '#ffffff00',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{ fontSize: '14px' }}
                        >
                            Frame Data
                        </AccordionSummary>
                        <AccordionDetails>
                            <FrameInspector
                                p1={p1}
                                p2={p2}
                                testJson={testJson}
                                animationFrame={animationFrame}
                            />
                        </AccordionDetails>
                    </Accordion>
                </div>

                <div
                    style={{
                        padding: '10px',
                        paddingBottom: '13px',
                        marginBottom: '16px',
                        border: '1px solid #777',
                        borderRadius: '20px',
                    }}
                >
                    <Accordion
                        key="accordion-agent-decision-logic"
                        style={{
                            boxShadow: 'none',
                            backgroundColor: '#ffffff00',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{ fontSize: '14px' }}
                        >
                            Agent Decision Logic
                        </AccordionSummary>
                        <AccordionDetails>
                            <FrameDecisionPathViewer
                                p1={p1}
                                p2={p2}
                                testJson={testJson}
                                animationFrame={animationFrame}
                            />
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>
        </div>
    );

    if (isMobileDisplay) {
        return (
            <div>
                <MobileView />
            </div>
        );
    }

    if (!isWhiteListed && isProduction) {
        return (
            <RegistrationPage
                setIsWhiteListedTrue={() => {
                    setIsWhiteListed(true);
                }}
            />
        );
    }

    const keyboardShortcuts: KeyboardShortcut[] = [
        {key:'[', keyName:'[', description:'← Mode'},
        {key:']', keyName:']', description:'→ Mode'}
    ].concat(
        (swipeableViewIndex == 0) ? [
            {key:"'", keyName:"'", description:'Toggle Simulation / Real Time'},
        ] : (swipeableViewIndex == 1) ? [
            {key:";", keyName:";", description:'→ Tab'},
            {key:"'", keyName:"'", description:'→ Tab'}
        ] : (swipeableViewIndex == 2) ? [
            {key:";", keyName:";", description:'→ Tab'},
            {key:"'", keyName:"'", description:'→ Tab'}
        ] : []
    );

    //
    // Render
    //
    return (
        <div
            className={styles.container}
            ref={ref}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
        >
            <Head>
                <title>Shoshin Tooling</title>
                <meta
                    name="shoshin-tooling"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Contextual hints for keyboard shortcut */}
            <div style={{
                position:'fixed', bottom:'0px', width:'100%', height:'70px', backgroundColor:'#333333E3', zIndex:'100',
                display:'flex', flexDirection:'row', justifyContent: 'center', verticalAlign:'middle', padding:'20px'
            }}>
                {

                }
                {
                    keyboardShortcuts.map((shortcut: KeyboardShortcut) => {return (
                        <KeyboardShortcutElement shortcut={shortcut} />
                    )})
                }
            </div>

            <Tabs
                value={swipeableViewIndex}
                onChange={(event, newValue) =>
                    setSwipeableViewIndex((_) => newValue)
                }
                aria-label="basic tabs example"
                sx={{ mt: 2 }}
                centered
            >
                <Tab label={'Fight'} sx={{fontFamily:'Raleway'}} />
                <Tab label={'Edit'} sx={{fontFamily:'Raleway'}} />
                <Tab label={'Reference'} sx={{fontFamily:'Raleway'}} />
                <Tab label={'Wallet'} sx={{fontFamily:'Raleway'}} />
            </Tabs>

            <Snackbar
                open={successToastOpen}
                autoHideDuration={6000}
                onClose={handleToastClose}
            >
                <Alert
                    onClose={handleToastClose}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Condition Successfully saved
                </Alert>
            </Snackbar>
            <Box sx={{ flex: 1, pt: 5, pb: 8 }}>
                <ThemeProvider theme={theme}>
                    <SwipeableViews
                        index={swipeableViewIndex}
                        containerStyle={{
                            transition:
                                'transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s',
                        }}
                        // ^reference to this magical fix: https://github.com/oliviertassinari/react-swipeable-views/issues/599#issuecomment-657601754
                        // a fix for the issue: first index change doesn't animate (swipe)
                    >
                        <SwipeableContent>{FightView}</SwipeableContent>
                        <SwipeableContent>
                            {EditorViewComponent}
                        </SwipeableContent>
                        <SwipeableContent
                            sx={{ paddingLeft: '10rem', paddingRight: '10rem' }}
                        >
                            <ContractInformationView
                                contractInformationTabIndex={contractInformationTabIndex}
                                setContractInformationTabIndex={(tabIndex) => setContractInformationTabIndex((_) => tabIndex)}
                            />
                        </SwipeableContent>
                        <SwipeableContent
                            sx={{ paddingLeft: '10rem', paddingRight: '10rem' }}
                        >
                            <WalletConnectView />
                        </SwipeableContent>
                    </SwipeableViews>
                </ThemeProvider>
            </Box>
        </div>
    );
}

const KeyboardShortcutElement = ({shortcut} : {shortcut:KeyboardShortcut}) => {
    const fontSize = shortcut.keyName.length > 1 ? '11px' : '13px'

    return (
        <div style={{marginRight:'48px', display:'flex', flexDirection:'row', verticalAlign:'middle'}}>

            <div style={{
                height: '30px',
                lineHeight: '30px',
                color: '#eee',
                fontFamily:'Raleway',
                textAlign:'center', verticalAlign:'center',
                fontSize:'14px',
                marginRight:'8px',

            }}>
                <span style={{alignSelf:'center'}}> { shortcut.description } </span>
            </div>

            <div style={{
                height: '30px', width: '30px',
                lineHeight: '30px', borderRadius:'5px',
                borderBottom: '3px solid #000',
                marginBottom: '-3px',
                borderRight: '3px solid #000',
                marginRight: '-3px',
                backgroundColor:'#eee',
                color: '#333',
                fontFamily:'Raleway',
                textAlign:'center', verticalAlign:'center',
                fontSize:fontSize,

            }} className={"border_box"}>
                <span style={{alignSelf:'center'}}> { shortcut.keyName } </span>
            </div>
        </div>
    )
}