import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    AccordionDetails,
    Accordion,
    AccordionSummary,
    Grid,
} from '@mui/material';
import styles from '../../../styles/Home.module.css';
import { FrameScene, TestJson } from '../../types/Frame';
import Agent, { PlayerAgent, buildAgent } from '../../types/Agent';
import StatusBarPanel, {
    StatusBarPanelProps as PlayerStatuses,
} from '../../../src/components/StatusBar';
import { Action } from '../../types/Action';
import { Character, numberToCharacter } from '../../constants/constants';
import { Layer, layersToAgentComponents } from '../../types/Layer';
import useRunCairoSimulation from '../../hooks/useRunCairoSimulation';
import dynamic from 'next/dynamic';
import { GameModes } from '../../types/Simulator';
import MidScreenControl from '../MidScreenControl';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FrameInspector from '../FrameInspector';
import FrameDecisionPathViewer from '../FrameDecisionPathViewer';
import Gambit from '../sidePanelComponents/Gambit/Gambit';
import { Condition } from '../../types/Condition';
import SquareOverlayMenu from './SuccessMenu';
import { Medal, Opponent } from '../layout/SceneSelector';
import mainSceneStyles from './MainScene.module.css';
import PauseMenu from './PauseMenu';
//@ts-ignore
const Game = dynamic(() => import('../../../src/Game/PhaserGame'), {
    ssr: false,
});

interface SimulationProps {
    player: PlayerAgent;
    setPlayerAgent: (playerAgent: PlayerAgent) => void;
    opponent: Agent;
    submitWin: (playerAgent: PlayerAgent, opponent: Opponent) => void;
    onContinue: () => void;
    onQuit: () => void;
}
//We need Players agent and opponent
const SimulationScene = React.forwardRef((props: SimulationProps, ref) => {
    const { player, setPlayerAgent, opponent, submitWin, onQuit, onContinue } =
        props;
    // Constants
    const LATENCY = 70;
    const runnable = true;

    // React states for simulation / animation control
    const [output, setOuput] = useState<FrameScene>();
    const [simulationError, setSimulationError] = useState();
    const [p1, setP1] = useState<Agent>();
    const [p2] = useState<Agent>(opponent);
    const [loop, setLoop] = useState<NodeJS.Timer>();
    const [animationFrame, setAnimationFrame] = useState<number>(0);
    const [animationState, setAnimationState] = useState<string>('Stop');
    const [testJson, setTestJson] = useState<TestJson>(null);
    const [checkedShowDebugInfo, setCheckedShowDebugInfo] =
        useState<boolean>(false);

    const [playerStatuses, setPlayerStatuses] = useState<PlayerStatuses>({
        integrity_0: 1000,
        integrity_1: 1000,
        stamina_0: 100,
        stamina_1: 100,
    });

    // React states for tracking the New Agent being edited in the right panel
    const [combos, setCombos] = useState<Action[][]>(player.combos);

    const [conditions, setConditions] =
        //@ts-ignore
        useState<Condition[]>(player.conditions);

    const [character, setCharacter] = useState<Character>(player.character);

    const [layers, setLayers] = useState<Layer[]>(player.layers);

    const opponentName =
        opponent.character == 0 ? Character.Jessica : Character.Antoc;

    useEffect(() => {
        let builtAgent = handleBuildAgent();
        console.log('built agent', builtAgent);
        setPlayerAgent({
            layers,
            combos,
            conditions,
            character,
        });
        setP1(builtAgent);
    }, [character, combos, conditions, layers]);

    function handleBuildAgent() {
        let char = Object.keys(Character).indexOf(character);

        //given layers
        const {
            mentalStates: generatedMs,
            conditions: generatedConditions,
            trees: generatedTrees,
        } = layersToAgentComponents(layers, char, combos);

        //todo remove trees
        return buildAgent(
            generatedMs,
            combos,
            generatedTrees,
            generatedConditions,
            0,
            char
        );
    }

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

    const { runCairoSimulation } = useRunCairoSimulation(p1, p2);

    useEffect(() => {
        if (!simulationError) return;

        alert(
            'Incorrect agent, please verify. If error persists, please contact us on Discord.'
        );
    }, [simulationError]);

    const N_FRAMES = testJson == null ? 0 : testJson.agent_0.frames.length;

    const animationStepForward = (frames) => {
        setAnimationFrame((prev) => (prev == frames - 1 ? prev : prev + 1));
    };
    const animationStepBackward = () => {
        setAnimationFrame((prev) => (prev > 0 ? prev - 1 : prev));
    };

    function handleMidScreenControlClick(operation: string) {
        if (operation == 'NextFrame' && animationState != 'Run') {
            animationStepForward(N_FRAMES);
        } else if (operation == 'PrevFrame' && animationState != 'Run') {
            animationStepBackward();
        } else if (operation == 'ToggleRun') {
            // If in Run => go to Pause
            if (animationState == 'Run' && !beatAgent) {
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

    function handleValidateCombo(combo: Action[], index: number) {
        console.log('combo', combo);
        console.log('index', index);
        setCombos((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy[index] = combo;
            return prev_copy;
        });
    }

    const beatAgent =
        output !== undefined
            ? output.agent_1[output.agent_1.length - 1].body_state.integrity ==
              0
            : false;

    let performance = Medal.NONE;
    const hpRemaining =
        output !== undefined
            ? output.agent_0[output.agent_0.length - 1].body_state.integrity
            : 0;
    if (hpRemaining === 1000) {
        performance = Medal.GOLD;
    } else if (hpRemaining >= 500) {
        performance = Medal.SILVER;
    } else {
        performance = Medal.BRONZE;
    }

    const [showVictory, changeShowVictory] = useState<boolean>(false);
    useEffect(() => {
        if (beatAgent) {
            submitWin(player, { agent: opponent, medal: performance });
        }
    }, [beatAgent, animationFrame]);

    useEffect(() => {
        console.log('anim', animationFrame, N_FRAMES, beatAgent);
        if (beatAgent && N_FRAMES - 1 === animationFrame) {
            changeShowVictory(true);
            changePlayedWinningReplay(true);
        }
    }, [animationFrame]);

    const [playedWinningReplay, changePlayedWinningReplay] =
        useState<boolean>(false);

    //TODO : When entering scene play the fight by default
    //Maybe win submissions are done on win and continue click only navigates player
    const handleContinueClick = () => {
        onContinue();
    };

    const playOnly = !playedWinningReplay && beatAgent;

    const overlayContainerClassName = playOnly
        ? mainSceneStyles.overlayContainer
        : '';

    //Having this class be conditional on playOnly may not be needed
    const overlayClassName = playOnly ? mainSceneStyles.overlay : '';

    const p1Name = player.character;
    const p2Name = numberToCharacter(opponent.character);
    return (
        <div id={'mother'} className={styles.container} ref={ref}>
            {' '}
            <div className={mainSceneStyles.overlayMenu}></div>
            <div className={styles.main}>
                {showVictory ? (
                    <SquareOverlayMenu
                        opponentName={opponentName}
                        performance={performance}
                        handleContinueClick={handleContinueClick}
                    />
                ) : null}
                {false ? (
                    <PauseMenu onQuit={onQuit} onChooseCharacter={onContinue} />
                ) : null}
                <Grid container spacing={{ md: 0, lg: 2 }}>
                    <Grid item lg={0} xl={1} />
                    <Grid item md={6} lg={6}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                            }}
                        >
                            <div className={overlayContainerClassName}>
                                <div className={overlayClassName}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Typography>{p1Name}</Typography>
                                        <Typography>{p2Name}</Typography>
                                    </Box>

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
                                        gameMode={GameModes.simulation}
                                        realTimeOptions={{
                                            playerCharacter: 0,
                                            agentOpponent: p2,
                                            setPlayerStatuses,
                                        }}
                                        isInView={true}
                                    />
                                </div>
                            </div>
                            {playOnly ? (
                                <div style={{ height: '400px' }}></div>
                            ) : null}
                            <MidScreenControl
                                runnable={
                                    !(p1 == null || p2 == null) && !playOnly
                                }
                                playOnly={playOnly}
                                testJsonAvailable={testJson ? true : false}
                                testJson={testJson}
                                animationFrame={animationFrame}
                                n_cycles={N_FRAMES}
                                animationState={animationState}
                                handleClick={handleMidScreenControlClick}
                                handleSlideChange={(evt) => {
                                    if (animationState == 'Run') return;
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
                    </Grid>
                    <Grid item md={6} lg={5} xl={4}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'top',
                                alignItems: 'left',
                                borderRadius: '0 0 0 0',
                                border: '1px solid #999999',
                                padding: '0.5rem 0.5rem 2rem 0.5rem',
                                width: '100%',
                            }}
                        >
                            <Gambit
                                layers={layers}
                                setLayers={setLayers}
                                isReadOnly={false}
                                character={character}
                                conditions={conditions}
                                combos={combos}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
});

export default SimulationScene;
