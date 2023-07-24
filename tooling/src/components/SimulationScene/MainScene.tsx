import React, { ForwardedRef, useEffect, useState } from 'react';
import {
    Typography,
    Box,
    AccordionDetails,
    Accordion,
    AccordionSummary,
    Grid,
    Fade,
} from '@mui/material';
import styles from '../../../styles/Home.module.css';
import { FrameScene, TestJson } from '../../types/Frame';
import Agent, { PlayerAgent, buildAgent } from '../../types/Agent';
import StatusBarPanel, {
    StatusBarPanelProps as PlayerStatuses,
} from '../../../src/components/StatusBar';
import { Action, CHARACTERS_ACTIONS } from '../../types/Action';
import { Character, numberToCharacter } from '../../constants/constants';
import { Layer, layersToAgentComponents } from '../../types/Layer';
import useRunCairoSimulation from '../../hooks/useRunCairoSimulation';
import dynamic from 'next/dynamic';
import { GameModes } from '../../types/Simulator';
import MidScreenControl from '../MidScreenControl';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FrameInspector from '../FrameInspector';
import FrameDecisionPathViewer from '../FrameDecisionPathViewer';
import Gambit, {
    FullGambitFeatures,
} from '../sidePanelComponents/Gambit/Gambit';
import { Condition } from '../../types/Condition';
import SquareOverlayMenu from './SuccessMenu';
import { Medal, Opponent } from '../layout/SceneSelector';
import mainSceneStyles from './MainScene.module.css';
import PauseMenu from './PauseMenu';
import FullArtBackground from '../layout/FullArtBackground';
import GameCard from '../ui/GameCard';
import LoadingFull from '../layout/LoadingFull';
//@ts-ignore
const Game = dynamic(() => import('../../../src/Game/PhaserGame'), {
    ssr: false,
});

interface SimulationProps {
    player: PlayerAgent;
    setPlayerAgent: (playerAgent: PlayerAgent) => void;
    opponent: Opponent;
    submitWin: (playerAgent: PlayerAgent, opponent: Opponent) => void;
    onContinue: () => void;
    onQuit: () => void;
    transitionToActionReference: () => void;
    volume: number;
    setVolume: (volume: number) => void;
}
//We need Players agent and opponent
const SimulationScene = React.forwardRef(
    (props: SimulationProps, ref: ForwardedRef<HTMLDivElement>) => {
        const {
            player,
            setPlayerAgent,
            opponent,
            submitWin,
            onQuit,
            onContinue,
            transitionToActionReference,
            volume,
            setVolume,
        } = props;
        // Constants
        const LATENCY = 70;
        const runnable = true;

        // React states for simulation / animation control
        const [output, setOuput] = useState<FrameScene>();
        const [simulationError, setSimulationError] = useState();
        const [p1, setP1] = useState<Agent>();
        const p2: Agent = opponent.agent;

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

        const actions =
            CHARACTERS_ACTIONS[character == Character.Jessica ? 0 : 1];

        const opponentName =
            opponent.agent.character == 0 ? Character.Jessica : Character.Antoc;

        const [openPauseMenu, changePauseMenu] = useState<boolean>(false);

        const [phaserLoaded, setPhaserLoaded] = useState<boolean>(false);

        const handleKeyPress = (ev: KeyboardEvent) => {
            const key = ev.key.toUpperCase();

            if (key.includes('ESCAPE')) {
                changePauseMenu(!openPauseMenu);
            }
        };
        useEffect(() => {
            document.addEventListener('keydown', handleKeyPress);

            return () => {
                document.removeEventListener('keydown', handleKeyPress);
            };
        }, [openPauseMenu]);

        useEffect(() => {
            let builtAgent = handleBuildAgent();

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

        const beatAgent =
            output !== undefined
                ? output.agent_0[output.agent_1.length - 1].body_state
                      .integrity >
                  output.agent_1[output.agent_1.length - 1].body_state.integrity
                : false;

        let performance = Medal.NONE;
        const hpRemaining =
            output !== undefined
                ? output.agent_0[output.agent_0.length - 1].body_state.integrity
                : 0;

        const opponentHpRemaining =
            output !== undefined
                ? output.agent_1[output.agent_1.length - 1].body_state.integrity
                : 1000;
        if (hpRemaining === 1000 && opponentHpRemaining === 0) {
            performance = Medal.GOLD;
        } else if (hpRemaining >= 500) {
            performance = Medal.SILVER;
        } else {
            performance = Medal.BRONZE;
        }

        const [showVictory, changeShowVictory] = useState<boolean>(false);
        useEffect(() => {
            if (beatAgent) {
                submitWin(player, { ...opponent, medal: performance });
            }
        }, [beatAgent]);

        useEffect(() => {
            if (beatAgent && N_FRAMES - 1 === animationFrame) {
                changeShowVictory(true);
                changePlayedWinningReplay(true);
            }

            if (animationFrame == N_FRAMES - 1) {
                clearInterval(loop); // kill the timer
                setAnimationState('Pause');
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
        const p2Name = numberToCharacter(opponent.agent.character);

        const activeMs =
            N_FRAMES > 0
                ? testJson.agent_0.frames[animationFrame].mental_state
                : 0;
        return (
            <div id={'mother'} ref={ref}>
                <Fade in={!phaserLoaded} timeout={1000}>
                    <LoadingFull />
                </Fade>
                <FullArtBackground useAlt={true}>
                    <div className={styles.container}>
                        <div className={mainSceneStyles.overlayMenu}></div>
                        <div className={styles.main}>
                            {showVictory ? (
                                <SquareOverlayMenu
                                    opponentName={opponentName}
                                    performance={performance}
                                    handleContinueClick={handleContinueClick}
                                />
                            ) : null}
                            {openPauseMenu ? (
                                <PauseMenu
                                    onQuit={onQuit}
                                    onChooseCharacter={onContinue}
                                    transitionToActionReference={
                                        transitionToActionReference
                                    }
                                    volume={volume}
                                    setVolume={setVolume}
                                />
                            ) : null}
                            <Grid container spacing={{ md: 2 }}>
                                <Grid item md={6} lg={7} xl={7}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            width: '100%',
                                        }}
                                    >
                                        <div
                                            className={
                                                overlayContainerClassName
                                            }
                                        >
                                            <div className={overlayClassName}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent:
                                                            'space-between',
                                                    }}
                                                >
                                                    <Box
                                                        display={'flex'}
                                                        flexDirection={'row'}
                                                        sx={{
                                                            // backgroundColor:
                                                            //     '#000',
                                                            // opacity: '0.8',
                                                            paddingLeft: '5px',
                                                            paddingRight: '5px',
                                                        }}
                                                    >
                                                        <Typography
                                                            color={'#ee4942'}
                                                            marginRight={'5px'}
                                                        >
                                                            P1
                                                        </Typography>
                                                        <Typography>
                                                            {p1Name}
                                                        </Typography>
                                                    </Box>
                                                    <Box
                                                        display={'flex'}
                                                        flexDirection={'row'}
                                                        sx={{
                                                            // backgroundColor:
                                                            //     '#000',
                                                            // opacity: '0.8',
                                                            paddingLeft: '5px',
                                                            paddingRight: '5px',
                                                        }}
                                                    >
                                                        <Typography
                                                            color={'#438bee'}
                                                            marginRight={'5px'}
                                                        >
                                                            P2
                                                        </Typography>
                                                        <Typography>
                                                            {p2Name}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Game
                                                    onPhaserLoad={() =>
                                                        setPhaserLoaded(true)
                                                    }
                                                    testJson={testJson}
                                                    animationFrame={
                                                        animationFrame
                                                    }
                                                    animationState={
                                                        animationState
                                                    }
                                                    showDebug={
                                                        checkedShowDebugInfo
                                                    }
                                                    gameMode={
                                                        GameModes.simulation
                                                    }
                                                    realTimeOptions={{
                                                        playerCharacter: 0,
                                                        agentOpponent: p2,
                                                        setPlayerStatuses,
                                                    }}
                                                    isInView={true}
                                                    backgroundId={
                                                        opponent.backgroundId
                                                    }
                                                    volume={volume}
                                                />
                                            </div>
                                        </div>
                                        {playOnly ? (
                                            <div
                                                style={{ height: '400px' }}
                                            ></div>
                                        ) : null}
                                        <MidScreenControl
                                            runnable={
                                                !(p1 == null || p2 == null) &&
                                                !playOnly
                                            }
                                            playOnly={playOnly}
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
                                                if (animationState == 'Run')
                                                    return;
                                                const slide_val: number =
                                                    parseInt(evt.target.value);
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
                                        <Box
                                            sx={{
                                                padding: '10px',
                                                paddingBottom: '13px',
                                                marginBottom: '16px',
                                                border: '1px solid #777',
                                                borderRadius: '20px',
                                                backgroundColor: '#f2f2f2',
                                                opacity: '0.8',
                                            }}
                                        >
                                            <Accordion
                                                key="accordion-frame-data"
                                                style={{
                                                    boxShadow: 'none',
                                                    backgroundColor:
                                                        '#ffffff00',
                                                }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={
                                                        <ExpandMoreIcon />
                                                    }
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
                                                        animationFrame={
                                                            animationFrame
                                                        }
                                                    />
                                                </AccordionDetails>
                                            </Accordion>
                                        </Box>
                                        <Box
                                            sx={{
                                                padding: '10px',
                                                paddingBottom: '13px',
                                                marginBottom: '16px',
                                                border: '1px solid #777',
                                                borderRadius: '20px',
                                                backgroundColor: '#f2f2f2',
                                                opacity: '0.8',
                                            }}
                                        >
                                            <Accordion
                                                key="accordion-agent-decision-logic"
                                                style={{
                                                    boxShadow: 'none',
                                                    backgroundColor:
                                                        '#ffffff00',
                                                }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={
                                                        <ExpandMoreIcon />
                                                    }
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
                                                        animationFrame={
                                                            animationFrame
                                                        }
                                                    />
                                                </AccordionDetails>
                                            </Accordion>
                                        </Box>
                                    </div>
                                </Grid>
                                <Grid item md={6} lg={5} xl={5}>
                                    <GameCard
                                        image={'/images/bg/f2f2f2.png'}
                                        bgOpacity={0.8}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'top',
                                                alignItems: 'left',
                                                borderRadius: '0 0 0 0',
                                                width: '100%',
                                                height: '82vh',
                                                overflowY: 'auto',
                                            }}
                                        >
                                            <Gambit
                                                layers={layers}
                                                setLayers={setLayers}
                                                features={FullGambitFeatures}
                                                character={character}
                                                conditions={conditions}
                                                combos={combos}
                                                setCombos={setCombos}
                                                activeMs={activeMs}
                                                actions={actions}
                                            />
                                        </Box>
                                    </GameCard>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </FullArtBackground>
            </div>
        );
    }
);

export default SimulationScene;
