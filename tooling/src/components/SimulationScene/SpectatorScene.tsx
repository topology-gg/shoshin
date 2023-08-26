import React, {
    ForwardedRef,
    ReactNode,
    SyntheticEvent,
    useContext,
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
    CircularProgress,
    ButtonGroup,
    Drawer,
    TextField,
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
    numberToCharacter,
} from '../../constants/constants';
import { Layer, layersToAgentComponents } from '../../types/Layer';
import useRunCairoSimulation, {
    runCairoSimulation,
} from '../../hooks/useRunCairoSimulation';
import dynamic from 'next/dynamic';
import { GameModes } from '../../types/Simulator';
import MidScreenControl from '../MidScreenControl';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FrameInspector from '../FrameInspector';
import FrameDecisionPathViewer from '../FrameDecisionPathViewer';
import Gambit, {
    FullGambitFeatures,
    GambitFeatures,
} from '../sidePanelComponents/Gambit/Gambit';
import {
    BodystatesAntoc,
    BodystatesJessica,
    Condition,
} from '../../types/Condition';
import SquareOverlayMenu from './SuccessMenu';
import spectatorSceneStyles from './SpectatorScene.module.css';
import FullArtBackground from '../layout/FullArtBackground';
import GameCard from '../ui/GameCard';
import LoadingFull from '../layout/LoadingFull';
import {
    Medal,
    OnlineOpponent,
    Opponent,
    achievedBetterPerformance,
} from '../../types/Opponent';
import CloseIcon from '@mui/icons-material/Close';

import { buildAgentFromLayers } from '../ChooseOpponent/opponents/util';
import { Spectatable } from '../layout/SceneSelector';
import useAnimationControls, {
    AnimationState,
} from '../../hooks/useAnimationControls';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';
import { ShoshinWASMContext } from '../../context/wasm-shoshin';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Playable, getNameForPlayable } from '../../types/Playable';
//@ts-ignore
const Game = dynamic(() => import('../../../src/Game/PhaserGame'), {
    ssr: false,
});

export const calculateScoreMap = (
    play: FrameScene,
    character: Character
): ScoreMap => {
    if (play == null) return nullScoreMap;

    //
    // Score calculation
    //

    // Labor points
    // (player would get these regardless player wins the fight or not)
    // - each hurt inflicted on opponent gives S_HURT points
    // - each knock inflicted on opponent gives S_KNOCK points
    // - each launch inflicted on opponent gives S_LAUNCH points
    // - each KO (one at most) inflicted on opponent gives S_KO points

    // Health Bonus
    // (only when player wins the fight)
    // - player gets (player HP - opponent HP) * M_HEALTH points as bonus

    // Full Health Bonus
    // (only when player wins the fight)
    // - players gets S_FULL_HEALTH as bonus

    // Time Bonus
    // (only when player wins the fight)
    // - player gets (MAX_TIME - time spent to win) * M_TIME points as bonus

    let scoreHurts = 0;
    let scoreKnocks = 0;
    let scoreLaunches = 0;
    let scoreKO = 0;
    play.agent_1.forEach((frame, _) => {
        const counter = frame.body_state.counter;
        const state = frame.body_state.state;

        if (
            counter == 0 &&
            isDamaged(
                [BodystatesJessica.Hurt, BodystatesAntoc.Hurt],
                state,
                character
            )
        )
            scoreHurts += 1;
        if (
            counter == 0 &&
            isDamaged(
                [BodystatesJessica.Knocked, BodystatesAntoc.Knocked],
                state,
                character
            )
        )
            scoreKnocks += 1;
        if (
            counter == 0 &&
            isDamaged(
                [BodystatesJessica.Launched, BodystatesAntoc.Launched],
                state,
                character
            )
        )
            scoreLaunches += 1;
        if (
            counter == 0 &&
            isDamaged(
                [BodystatesJessica.KO, BodystatesAntoc.KO],
                state,
                character
            )
        )
            scoreKO = 1;
    });

    const frameSpent = play.agent_0.length;

    const healthDifference =
        play.agent_0[play.agent_0.length - 1].body_state.integrity -
        play.agent_1[play.agent_1.length - 1].body_state.integrity;

    const hasFullHealthAtTheEnd: boolean =
        play.agent_0[play.agent_0.length - 1].body_state.integrity == 1000;

    const scoreLaborPoints =
        scoreHurts * SCORING.S_HURT +
        scoreKnocks * SCORING.S_KNOCK +
        scoreLaunches * SCORING.S_LAUNCH +
        scoreKO * SCORING.S_KO;
    const scoreHealthBonus = healthDifference * SCORING.M_HEALTH;
    const scoreFullHealthBonus = hasFullHealthAtTheEnd
        ? SCORING.S_FULL_HEALTH
        : 0;
    const scoreTimeBonus = (FRAME_COUNT - frameSpent) * SCORING.M_TIME;
    const scoreMap: ScoreMap = {
        labor: {
            hurt: scoreHurts * SCORING.S_HURT,
            knocked: scoreKnocks * SCORING.S_KNOCK,
            launched: scoreLaunches * SCORING.S_LAUNCH,
            ko: scoreKO * SCORING.S_KO,
        },
        healthBonus: scoreHealthBonus,
        fullHealthBonus: scoreFullHealthBonus,
        timeBonus: scoreTimeBonus,
        totalScore:
            scoreLaborPoints +
            scoreHealthBonus +
            scoreFullHealthBonus +
            scoreTimeBonus,
    };

    return scoreMap;
};

interface SpectatorProps {
    player: Spectatable;
    savePlayerAgent: (playerAgent: Playable) => void;
    opponent: Spectatable;
    onContinue: () => void;
    onQuit: () => void;
    transitionToActionReference: () => void;
    volume: number;
    pauseMenu: ReactNode;
    showFullReplay: boolean;
    isPreview: boolean;
    matchFormat: MatchFormat;
    bestOf: number;
}

enum PointOfView {
    SPECTATOR,
    ANALYSIS,
    PLAYER_1,
    PLAYER_2,
}

enum RoundView {
    FULL,
    ROUND_1,
    ROUND_2,
    ROUND_3,
}

const SpectatorFeatures: GambitFeatures = {
    layerAddAndDelete: false,
    conditionAnd: false,
    combos: true,
    sui: true,
    actionRandomness: true,
};

//We need Players agent and opponent
const SpectatorScene = React.forwardRef(
    (props: SpectatorProps, ref: ForwardedRef<HTMLDivElement>) => {
        const {
            player,
            savePlayerAgent,
            opponent,
            onContinue,
            volume,
            pauseMenu,
            showFullReplay,
            isPreview,
            matchFormat,
            bestOf,
        } = props;
        // Constants
        const runnable = true;

        const [round, setRound] = useState<number>(0);
        const [fullReplay, setFullReplay] = useState<boolean>(true);
        // React states for simulation / animation control
        const [outputs, setOutputs] = useState<FrameScene[]>([]);
        console.log('outputs', outputs);

        const [simulationError, setSimulationError] = useState();
        const [reSimulationNeeded, setReSimulationNeeded] =
            useState<boolean>(false);

        const [pointOfView, setPointOfView] = useState<PointOfView>(
            PointOfView.SPECTATOR
        );

        const [roundView, setRoundView] = useState<RoundView>(RoundView.FULL);

        const [lives, setLives] =
            matchFormat == MatchFormat.BO3
                ? useState<number[]>([2, 2])
                : useState<number[]>([-1, -1]);

        const [testJson, setTestJson] = useState<TestJson>(null);
        const [checkedShowDebugInfo, setCheckedShowDebugInfo] =
            useState<boolean>(false);

        const [playerStatuses, setPlayerStatuses] = useState<PlayerStatuses>({
            integrity_0: 1000,
            integrity_1: 1000,
            stamina_0: 100,
            stamina_1: 100,
        });

        const [chosenPlayer, setChosenPlayer] = useState<PlayerAgent>(
            pointOfView == PointOfView.PLAYER_1 ? player.agent : opponent.agent
        );

        useEffect(() => {
            if (pointOfView == PointOfView.PLAYER_1) {
                setChosenPlayer(player.agent);
            } else if (pointOfView == PointOfView.PLAYER_2) {
                setChosenPlayer(opponent.agent);
            }
        }, [pointOfView]);

        const actions =
            CHARACTERS_ACTIONS[
                chosenPlayer.character == Character.Jessica ? 0 : 1
            ];

        const opponentName = opponent.mindName;

        const [openPauseMenu, changePauseMenu] = useState<boolean>(false);

        const [phaserLoaded, setPhaserLoaded] = useState<boolean>(false);

        const handleKeyPress = (ev: KeyboardEvent) => {
            const key = ev.key.toUpperCase();

            if (key.includes('ESCAPE')) {
                changePauseMenu(!openPauseMenu);
            }
        };

        const handleOverlayPress = () => {
            if (isObserver) {
                handleMidScreenControlClick('ToggleRun');
            }
        };
        useEffect(() => {
            document.addEventListener('keydown', handleKeyPress);

            return () => {
                document.removeEventListener('keydown', handleKeyPress);
            };
        }, [openPauseMenu]);

        const char1 = player.agent.character === Character.Jessica ? 0 : 1;
        const char2 = opponent.agent.character === Character.Jessica ? 0 : 1;
        const {
            start,
            pause,
            stop,
            animationFrame,
            setAnimationFrame,
            animationState,
            animationStepForward,
            animationStepBackward,
        } = useAnimationControls(outputs[round], char1, char2);

        function playerAgentToAgent(playerAgent: PlayerAgent): Agent {
            const { layers, combos } = playerAgent;
            let char = Object.keys(Character).indexOf(playerAgent.character);

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
            if (outputs[round]) {
                console.log('caught output:', outputs[round]);
                setTestJson((_) => {
                    return {
                        agent_0: {
                            frames: outputs[round].agent_0,
                            type: p1.character,
                        },
                        agent_1: {
                            frames: outputs[round].agent_1,
                            type: p2.character,
                        },
                    };
                });
            }
        }, [outputs, round]);

        const p1 = playerAgentToAgent(player.agent);
        const p2 = playerAgentToAgent(opponent.agent);
        console.log(`p1`, p1);
        console.log(`p2`, p2);

        const ctx = useContext(ShoshinWASMContext);

        const [seed, setSeed] = useState<number>(
            Math.floor(Math.random() * 1000)
        );

        const handleSeedChange = (event) => {
            if (/^\d*$/.test(event.target.value)) {
                setSeed(parseInt(event.target.value));
            }
        };

        useEffect(() => {
            if (phaserLoaded && outputs.length < bestOf) {
                let outputs = [];

                for (let i = 0; i < bestOf; i++) {
                    const [output, err] = runCairoSimulation(
                        { ...p1, seed: seed + i },
                        { ...p2, seed: seed + i },
                        ctx
                    );
                    outputs.push(output);
                }

                setOutputs(outputs);
            }
        }, [phaserLoaded]);

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
                    start();
                }
            } else {
                stop();
            }
        }

        const output = outputs.length >= round ? outputs[round] : undefined;

        const handleFullReplayClick = () => {
            setFullReplay(true);
            setRound(0);
            setAnimationFrame(0);
            setLives([2, 2]);
        };

        const getLivesPerRound = (outputs) => {
            let lives = [2, 2];

            return outputs.map((output) => {
                const p1Hp =
                    output.agent_0[output.agent_0.length - 1].body_state
                        .integrity;
                const p2Hp =
                    output.agent_1[output.agent_1.length - 1].body_state
                        .integrity;

                if (p1Hp < p2Hp) {
                    lives = [lives[0] - 1, lives[1]];
                    return lives;
                } else if (p1Hp > p2Hp) {
                    lives = [lives[0], lives[1] - 1];
                    return lives;
                } else if (p1Hp == p2Hp) {
                    lives = [lives[0] - 1, lives[1] - 1];
                    return lives;
                }
            });
        };

        const nextRound = () => {
            setRound(round + 1);
            setAnimationFrame(0);
        };

        useEffect(() => {
            if (
                output !== undefined &&
                animationFrame == output.agent_0.length - 1 &&
                fullReplay == true &&
                round + 1 < bestOf
            ) {
                const livePerRound = getLivesPerRound(outputs);
                setLives(livePerRound[round]);

                if (
                    fullReplay &&
                    livePerRound[round][0] > 0 &&
                    livePerRound[round][1] > 0
                ) {
                    setTimeout(() => {
                        nextRound();
                    }, 5000);
                }
            }
        }, [output, animationFrame]);

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
        const scoreMap = calculateScoreMap(output, chosenPlayer.character);
        const score = scoreMap.totalScore;

        const [showVictory, changeShowVictory] = useState<boolean>(false);

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

        const playOnly =
            !hasBeatenOpponent &&
            showFullReplay &&
            !playedWinningReplay &&
            beatAgent;

        const isObserver =
            pointOfView == PointOfView.SPECTATOR ||
            pointOfView == PointOfView.ANALYSIS;

        const overlayContainerClassName = isObserver
            ? spectatorSceneStyles.overlayContainer
            : '';

        //Having this class be conditional on playOnly may not be needed
        const overlayClassName = isObserver ? spectatorSceneStyles.overlay : '';

        const playerOneNameString = getNameForPlayable(player);
        const playerTwoNameString = getNameForPlayable(opponent);

        let activeMs = 0;

        if (
            testJson !== null &&
            testJson.agent_0.frames.length > 0 &&
            PointOfView.PLAYER_1 == pointOfView
        ) {
            activeMs =
                N_FRAMES > 0
                    ? testJson.agent_0.frames[animationFrame].mental_state
                    : 0;
        } else {
            activeMs =
                N_FRAMES > 0
                    ? testJson.agent_1.frames[animationFrame].mental_state
                    : 0;
        }

        const [showVictorySnackBar, setShowVictorySnackBar] = useState(false);

        const roundButtons = Array.from({ length: bestOf }, (_, index) => {
            const livesPerRound = getLivesPerRound(outputs);

            const handleRoundOneClick = (e: SyntheticEvent) => {
                e.preventDefault();
                if (index == 0) {
                    setLives([2, 2]);
                } else {
                    setLives(livesPerRound[index - 1]);
                }

                if (
                    index !== 0 &&
                    (livesPerRound[index - 1][0] == 0 ||
                        livesPerRound[index - 1][1] == 0)
                ) {
                    return;
                }

                setRound(index);
                setAnimationFrame(0);
                setFullReplay(false);
            };

            return (
                <Button
                    variant={round == index ? 'contained' : 'outlined'}
                    onClick={handleRoundOneClick}
                >
                    Round {index + 1}
                </Button>
            );
        });

        const [isHovered, setIsHovered] = useState(false);
        const [isTimelineHovered, setIsTimelineHovered] = useState(false);

        const handleMouseEnter = (isTimeline = false) => {
            if (isTimeline) {
                setIsTimelineHovered(true);
            } else {
                setIsHovered(true);
            }
        };

        const handleMouseLeave = (isTimeline = false) => {
            if (isTimeline) {
                setIsTimelineHovered(false);
            } else {
                setIsHovered(false);
            }
        };

        const hoveredClass =
            isHovered && isObserver ? spectatorSceneStyles.optionsHover : '';

        const midscreenClassnames =
            isTimelineHovered && pointOfView == PointOfView.ANALYSIS
                ? spectatorSceneStyles.timeline
                : '';

        return (
            <div id={'mother'} ref={ref}>
                <Fade in={!phaserLoaded} timeout={500}>
                    <LoadingFull />
                </Fade>
                <FullArtBackground useAlt={true}>
                    <div className={styles.container}>
                        <div className={styles.main}>
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
                                        >
                                            <div className={overlayClassName}>
                                                <div
                                                    onMouseEnter={() =>
                                                        handleMouseEnter(true)
                                                    }
                                                    onMouseLeave={() =>
                                                        handleMouseLeave(true)
                                                    }
                                                >
                                                    {!isTimelineHovered &&
                                                        pointOfView ==
                                                            PointOfView.ANALYSIS && (
                                                            <Box
                                                                className={
                                                                    spectatorSceneStyles.timelineHover
                                                                }
                                                            >
                                                                <Button variant="text">
                                                                    <ArrowDropUpIcon />
                                                                </Button>
                                                            </Box>
                                                        )}
                                                </div>
                                                <Box display={'flex'}>
                                                    <div
                                                        onMouseEnter={() =>
                                                            handleMouseEnter()
                                                        }
                                                        onMouseLeave={() =>
                                                            handleMouseLeave()
                                                        }
                                                    >
                                                        {!isHovered &&
                                                            isObserver && (
                                                                <Box
                                                                    className={
                                                                        spectatorSceneStyles.optionsHover
                                                                    }
                                                                >
                                                                    <Button variant="text">
                                                                        <ArrowDropDownIcon />
                                                                    </Button>
                                                                </Box>
                                                            )}

                                                        {(isHovered ||
                                                            !isObserver) && (
                                                            <Box
                                                                display={'flex'}
                                                                className={
                                                                    hoveredClass
                                                                }
                                                            >
                                                                <Box
                                                                    display={
                                                                        'flex'
                                                                    }
                                                                    flexDirection={
                                                                        'column'
                                                                    }
                                                                    alignContent={
                                                                        'left'
                                                                    }
                                                                    marginRight={
                                                                        '20px'
                                                                    }
                                                                >
                                                                    <Typography>
                                                                        Point of
                                                                        View
                                                                    </Typography>
                                                                    <ButtonGroup
                                                                        variant="contained"
                                                                        aria-label="outlined primary button group"
                                                                    >
                                                                        <Button
                                                                            variant={
                                                                                pointOfView ==
                                                                                PointOfView.SPECTATOR
                                                                                    ? 'contained'
                                                                                    : 'outlined'
                                                                            }
                                                                            onClick={() =>
                                                                                setPointOfView(
                                                                                    PointOfView.SPECTATOR
                                                                                )
                                                                            }
                                                                        >
                                                                            Spectator
                                                                        </Button>
                                                                        <Button
                                                                            variant={
                                                                                pointOfView ==
                                                                                PointOfView.ANALYSIS
                                                                                    ? 'contained'
                                                                                    : 'outlined'
                                                                            }
                                                                            onClick={() =>
                                                                                setPointOfView(
                                                                                    PointOfView.ANALYSIS
                                                                                )
                                                                            }
                                                                        >
                                                                            Analysis
                                                                        </Button>
                                                                        <Button
                                                                            variant={
                                                                                pointOfView ==
                                                                                PointOfView.PLAYER_1
                                                                                    ? 'contained'
                                                                                    : 'outlined'
                                                                            }
                                                                            onClick={() =>
                                                                                setPointOfView(
                                                                                    PointOfView.PLAYER_1
                                                                                )
                                                                            }
                                                                        >
                                                                            Player
                                                                            1
                                                                        </Button>
                                                                        <Button
                                                                            variant={
                                                                                pointOfView ==
                                                                                PointOfView.PLAYER_2
                                                                                    ? 'contained'
                                                                                    : 'outlined'
                                                                            }
                                                                            onClick={() =>
                                                                                setPointOfView(
                                                                                    PointOfView.PLAYER_2
                                                                                )
                                                                            }
                                                                        >
                                                                            Player
                                                                            2
                                                                        </Button>
                                                                    </ButtonGroup>
                                                                </Box>
                                                                <Box
                                                                    display={
                                                                        'flex'
                                                                    }
                                                                    flexDirection={
                                                                        'column'
                                                                    }
                                                                    alignContent={
                                                                        'left'
                                                                    }
                                                                    marginRight={
                                                                        '20px'
                                                                    }
                                                                >
                                                                    <Typography>
                                                                        Play
                                                                    </Typography>
                                                                    <Box>
                                                                        <Button
                                                                            variant={
                                                                                fullReplay
                                                                                    ? 'contained'
                                                                                    : 'outlined'
                                                                            }
                                                                            onClick={
                                                                                handleFullReplayClick
                                                                            }
                                                                            sx={{
                                                                                marginRight:
                                                                                    '10px',
                                                                            }}
                                                                        >
                                                                            Full
                                                                            Match
                                                                        </Button>
                                                                        <ButtonGroup
                                                                            variant="contained"
                                                                            aria-label="outlined primary button group"
                                                                        >
                                                                            {
                                                                                roundButtons
                                                                            }
                                                                        </ButtonGroup>
                                                                    </Box>
                                                                </Box>
                                                                <Box
                                                                    display={
                                                                        'flex'
                                                                    }
                                                                    flexDirection={
                                                                        'column'
                                                                    }
                                                                    alignContent={
                                                                        'left'
                                                                    }
                                                                    marginRight={
                                                                        '20px'
                                                                    }
                                                                >
                                                                    <Typography>
                                                                        Seed
                                                                    </Typography>
                                                                    <Typography>
                                                                        {seed}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        )}
                                                    </div>
                                                </Box>
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
                                                <Box
                                                    onClick={handleOverlayPress}
                                                >
                                                    <Game
                                                        onPhaserLoad={() =>
                                                            setPhaserLoaded(
                                                                true
                                                            )
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
                                                        backgroundId={1}
                                                        volume={volume}
                                                        lives={lives}
                                                        playerOneName={
                                                            playerOneNameString
                                                        }
                                                        playerTwoName={
                                                            playerTwoNameString
                                                        }
                                                    />
                                                </Box>
                                            </div>
                                        </div>
                                        {playOnly ? (
                                            <div
                                                style={{ height: '400px' }}
                                            ></div>
                                        ) : null}
                                        <Box
                                            className={midscreenClassnames}
                                            onMouseLeave={() =>
                                                handleMouseLeave(true)
                                            }
                                        >
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
                                                    !(
                                                        p1 == null || p2 == null
                                                    ) && !playOnly
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
                                                        parseInt(
                                                            evt.target.value
                                                        );
                                                    setAnimationFrame(
                                                        slide_val
                                                    );
                                                }}
                                                checkedShowDebugInfo={
                                                    checkedShowDebugInfo
                                                }
                                                handleChangeDebugInfo={() =>
                                                    setCheckedShowDebugInfo(
                                                        (_) =>
                                                            !checkedShowDebugInfo
                                                    )
                                                }
                                                submitOption={undefined}
                                            />
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
                                <Grid
                                    item
                                    md={6}
                                    lg={5}
                                    xl={5}
                                    visibility={
                                        isObserver ? 'hidden' : 'visible'
                                    }
                                >
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
                                                layers={chosenPlayer.layers}
                                                setLayers={() => {}}
                                                features={SpectatorFeatures}
                                                character={
                                                    chosenPlayer.character
                                                }
                                                conditions={
                                                    chosenPlayer.conditions
                                                }
                                                combos={chosenPlayer.combos}
                                                setCombos={() => {}}
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

export default SpectatorScene;
