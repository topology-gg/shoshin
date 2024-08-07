import React, {
    ForwardedRef,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    Typography,
    Box,
    AccordionDetails,
    Accordion,
    AccordionSummary,
    Grid,
    Fade,
    Snackbar,
    Button,
    IconButton,
} from '@mui/material';
import styles from '../../../styles/Home.module.css';
import { FrameScene, TestJson } from '../../types/Frame';
import Agent, { PlayerAgent, buildAgent } from '../../types/Agent';
import StatusBarPanel, {
    StatusBarPanelProps as PlayerStatuses,
} from '../../../src/components/StatusBar';
import { Action, CHARACTERS_ACTIONS } from '../../types/Action';
import {
    Character,
    DamageType,
    FRAME_COUNT,
    MatchFormat,
    SCORING,
    ScoreMap,
    isDamaged,
    nullScoreMap,
    calculateScoreMap,
    numberToCharacter,
} from '../../constants/constants';
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
import {
    BodystatesAntoc,
    BodystatesJessica,
    Condition,
} from '../../types/Condition';
import SquareOverlayMenu from './SuccessMenu';
import mainSceneStyles from './MainScene.module.css';
import FullArtBackground from '../layout/FullArtBackground';
import GameCard from '../ui/GameCard';
import LoadingFull from '../layout/LoadingFull';
import {
    Medal,
    OnlineOpponent,
    Opponent,
    achievedBetterPerformance,
    achievedBetterScore,
} from '../../types/Opponent';
import CloseIcon from '@mui/icons-material/Close';

import { buildAgentFromLayers } from '../ChooseOpponent/opponents/util';
import SubmitMindButton from './SubmitOptions/MainSceneSubmit';
import useAnimationControls, {
    AnimationState,
} from '../../hooks/useAnimationControls';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';
import SubmitOptions from './SubmitOptions/SubmitOptions';
import eventsCenter from '../../Game/EventsCenter';
import { Playable, getNameForPlayable } from '../../types/Playable';
//@ts-ignore
const Game = dynamic(() => import('../../../src/Game/PhaserGame'), {
    ssr: false,
});

interface SimulationProps {
    player: Playable;
    savePlayerAgent: (playerAgent: Playable) => void;
    opponent: Opponent | OnlineOpponent;
    opponentIndex: number;
    submitWin: (playerAgent: PlayerAgent, opponent: Opponent) => void;
    onContinue: () => void;
    onQuit: () => void;
    transitionToActionReference: () => void;
    volume: number;
    pauseMenu: ReactNode;
    showFullReplay: boolean;
    isPreview: boolean;
    matchFormat: MatchFormat;
    isCampaign: boolean;
}
//We need Players agent and opponent
const SimulationScene = React.forwardRef(
    (props: SimulationProps, ref: ForwardedRef<HTMLDivElement>) => {
        const {
            player,
            savePlayerAgent,
            opponent,
            submitWin,
            onContinue,
            volume,
            pauseMenu,
            showFullReplay,
            isPreview,
            matchFormat,
            opponentIndex,
            isCampaign,
        } = props;
        // Constants
        const runnable = true;

        // React states for simulation / animation control
        const [output, setOuput] = useState<FrameScene>();
        const [simulationError, setSimulationError] = useState();
        const [p1, setP1] = useState<Agent>();
        const [reSimulationNeeded, setReSimulationNeeded] =
            useState<boolean>(false);

        let p2: Agent;

        const [lives, setLives] = useState<number[]>([2, 2]);

        if ('layers' in opponent.agent) {
            const { layers, character, combos } = opponent.agent;
            const charIndex = character == Character.Jessica ? 0 : 1;
            p2 = buildAgentFromLayers(layers, charIndex, combos);
        } else {
            p2 = opponent.agent;
        }

        const [testJson, setTestJson] = useState<TestJson>(null);
        const [checkedShowDebugInfo, setCheckedShowDebugInfo] =
            useState<boolean>(false);

        const {
            start,
            pause,
            stop,
            animationFrame,
            setAnimationFrame,
            animationState,
            animationStepForward,
            animationStepBackward,
        } = useAnimationControls(output, p1?.character, p2?.character);

        const [playerStatuses, setPlayerStatuses] = useState<PlayerStatuses>({
            integrity_0: 1000,
            integrity_1: 1000,
            stamina_0: 100,
            stamina_1: 100,
        });

        let playerAgent;
        if ('layers' in player) {
            playerAgent = player;
        } else {
            playerAgent = player.agent;
        }

        // React states for tracking the New Agent being edited in the right panel
        const [combos, setCombos] = useState<Action[][]>(playerAgent.combos);

        const [conditions, setConditions] =
            //@ts-ignore
            useState<Condition[]>(playerAgent.conditions);

        const [character, setCharacter] = useState<Character>(
            playerAgent.character
        );

        const [seed, setSeed] = useState<number>(0);

        const [layers, setLayers] = useState<Layer[]>(playerAgent.layers);

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

        //
        // useEffect hook to update p1
        //
        useEffect(() => {
            let builtAgent = handleBuildAgent();

            if ('agent' in player) {
                savePlayerAgent({
                    ...player,
                    agent: {
                        layers,
                        combos,
                        conditions,
                        character,
                    },
                });
            } else {
                savePlayerAgent({
                    layers,
                    combos,
                    conditions,
                    character,
                });
            }

            setP1(builtAgent);
            setReSimulationNeeded((_) => true);
            stop();
        }, [character, combos, conditions, layers, stop]);

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

        function handleMidScreenControlClick(operation: string) {
            if (
                operation == 'NextFrame' &&
                animationState != AnimationState.RUN
            ) {
                animationStepForward();
            } else if (
                operation == 'PrevFrame' &&
                animationState != AnimationState.RUN
            ) {
                animationStepBackward();
            } else if (operation == 'ToggleRun') {
                // If in Run => go to Pause
                if (animationState == AnimationState.RUN) {
                    pause();
                }

                // If in Pause => resume Run without simulation
                else if (animationState == AnimationState.PAUSE) {
                    start();
                }

                // If in Stop => perform simulation then go to Run
                else if (animationState == AnimationState.STOP && runnable) {
                    const [out, err] = runCairoSimulation();
                    if (err != null) {
                        setSimulationError(err);
                        return;
                    }
                    setOuput(out);

                    start();
                }
            } else {
                stop();
            }
        }

        //
        // Compute flags from the fight
        //
        const beatAgent =
            output !== undefined
                ? output.agent_0[output.agent_1.length - 1].body_state
                      .integrity >
                  output.agent_1[output.agent_1.length - 1].body_state.integrity
                : false;

        //
        // Compute performance (medal earned) from the fight
        //
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

        //
        // Compute score from the fight
        //
        const scoreMap = calculateScoreMap(output, character);
        const score = scoreMap.totalScore;

        const [showVictory, changeShowVictory] = useState<boolean>(false);
        useEffect(() => {
            if (
                beatAgent &&
                'scoreMap' in opponent &&
                achievedBetterScore(scoreMap, opponent.scoreMap) &&
                'layers' in player
            ) {
                submitWin(player, {
                    ...opponent,
                    medal: performance,
                    scoreMap: scoreMap,
                });
            }
        }, [beatAgent]);

        useEffect(() => {
            if (beatAgent && N_FRAMES - 1 === animationFrame) {
                changeShowVictory(true);
                changePlayedWinningReplay(true);
            }

            if (animationFrame == N_FRAMES - 1) {
                pause();
            }
        }, [animationFrame, pause]);

        const [playedWinningReplay, changePlayedWinningReplay] =
            useState<boolean>(false);

        //TODO : When entering scene play the fight by default
        //Maybe win submissions are done on win and continue click only navigates player
        const handleContinueClick = () => {
            onContinue();
        };

        const [hasBeatenOpponent, changeHasBeatenOpponent] =
            useState<boolean>(false);

        useEffect(() => {
            if (!('medal' in opponent)) {
                return;
            }
            changeHasBeatenOpponent(opponent.medal !== Medal.NONE);
        }, []);
        const playOnly =
            !hasBeatenOpponent &&
            showFullReplay &&
            !playedWinningReplay &&
            beatAgent;

        const overlayContainerClassName = playOnly
            ? mainSceneStyles.overlayContainer
            : '';

        //Having this class be conditional on playOnly may not be needed
        const overlayClassName = playOnly ? mainSceneStyles.overlay : '';

        const handleOverlayClick = () => {
            if (playOnly) {
                setAnimationFrame(N_FRAMES - 1);
                changeShowVictory(true);
                changePlayedWinningReplay(true);
                pause();
            }
        };

        const playerOneNameString = getNameForPlayable(player);

        const playerTwoNameString = getNameForPlayable(opponent);

        const backgroundId =
            'backgroundId' in opponent ? opponent.backgroundId : 0;

        const activeMs =
            N_FRAMES > 0
                ? testJson.agent_0.frames[animationFrame].mental_state
                : 0;

        const [showVictorySnackBar, setShowVictorySnackBar] = useState(false);

        //Show Victory Snack Bar if it is a subsequent win, or if they beat the opponent for the first time and showFullReplay is false
        useEffect(() => {
            if (!('medal' in opponent)) {
                return;
            }
            const showVictorySnackBar =
                (!hasBeatenOpponent ||
                    (!showFullReplay &&
                        achievedBetterPerformance(
                            performance,
                            opponent.medal
                        ))) &&
                beatAgent;

            setShowVictorySnackBar(showVictorySnackBar);
        }, [hasBeatenOpponent, showFullReplay, performance, beatAgent]);
        const closeSnackbar = () => {
            setShowVictorySnackBar(false);
        };

        const snackBarAction = (
            <React.Fragment>
                <Button color="secondary" size="small" onClick={onContinue}>
                    Next Opponent
                </Button>
                <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={closeSnackbar}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </React.Fragment>
        );

        const MainSceneSubmitOption = (
            <SubmitOptions
                isPreview={isPreview}
                isCampaign={isCampaign}
                player={player}
                opponentIndex={opponentIndex}
                opponent={opponent}
            />
        );

        return (
            <div id={'mother'} ref={ref}>
                <Fade in={!phaserLoaded} timeout={500}>
                    <LoadingFull />
                </Fade>
                <FullArtBackground useAlt={true}>
                    <div className={styles.container}>
                        <div className={mainSceneStyles.overlayMenu}></div>
                        <div className={styles.main}>
                            <Snackbar
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={showVictorySnackBar}
                                autoHideDuration={6000}
                                onClose={closeSnackbar}
                                message={`Beat ${opponent.mindName} with ${performance}`}
                                action={snackBarAction}
                            />
                            {showVictory ? (
                                <SquareOverlayMenu
                                    opponentName={opponentName}
                                    performance={performance}
                                    scoreMap={scoreMap}
                                    handleContinueClick={handleContinueClick}
                                    closeMenu={() => changeShowVictory(false)}
                                />
                            ) : null}
                            {openPauseMenu ? pauseMenu : null}
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
                                            onClick={() => handleOverlayClick()}
                                        >
                                            <div className={overlayClassName}>
                                                {/* <Box
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
                                                            {playerOneName}
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
                                                        {playerTwoName}
                                                    </Box>
                                                </Box> */}
                                                <Game
                                                    onPhaserLoad={() =>
                                                        setPhaserLoaded(true)
                                                    }
                                                    testJson={testJson}
                                                    animationFrame={
                                                        animationFrame
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
                                                    backgroundId={backgroundId}
                                                    volume={volume}
                                                    lives={lives}
                                                    playerOneName={
                                                        playerOneNameString
                                                    }
                                                    playerTwoName={
                                                        playerTwoNameString
                                                    }
                                                />
                                            </div>
                                            {playOnly && (
                                                <Typography
                                                    color="lightGrey"
                                                    mt="16px"
                                                >
                                                    Click anywhere to skip
                                                    replay
                                                </Typography>
                                            )}
                                        </div>
                                        {playOnly ? (
                                            <div
                                                style={{ height: '400px' }}
                                            ></div>
                                        ) : null}
                                        <MidScreenControl
                                            reSimulationNeeded={
                                                reSimulationNeeded
                                            }
                                            unsetResimulationNeeded={() =>
                                                setReSimulationNeeded(
                                                    (_) => false
                                                )
                                            }
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
                                                if (
                                                    animationState ==
                                                    AnimationState.RUN
                                                )
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
                                            submitOption={MainSceneSubmitOption}
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
                                                isAnimationRunning={
                                                    animationState ==
                                                    AnimationState.RUN
                                                }
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
                                        {score > 0 && (
                                            <Typography>
                                                Score : {score}
                                            </Typography>
                                        )}
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
