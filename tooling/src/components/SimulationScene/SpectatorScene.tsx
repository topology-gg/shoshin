import React, {
    ForwardedRef,
    ReactNode,
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
import { Playable } from '../layout/SceneSelector';
import useAnimationControls, {
    AnimationState,
} from '../../hooks/useAnimationControls';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';
import { ShoshinWASMContext } from '../../context/wasm-shoshin';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
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

interface SimulationProps {
    player: OnlineOpponent;
    savePlayerAgent: (playerAgent: Playable) => void;
    opponent: OnlineOpponent;
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
    PLAYER_1,
    PLAYER_2,
}

enum RoundView {
    FULL,
    ROUND_1,
    ROUND_2,
    ROUND_3,
}

//We need Players agent and opponent
const SpectatorScene = React.forwardRef(
    (props: SimulationProps, ref: ForwardedRef<HTMLDivElement>) => {
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

        let playerAgent;
        if ('layers' in player) {
            playerAgent = player;
        } else {
            playerAgent = player.agent;
        }

        const chosenPlayer =
            pointOfView == PointOfView.PLAYER_1 ? player.agent : opponent.agent;

        // React states for tracking the New Agent being edited in the right panel
        const [combos, setCombos] = useState<Action[][]>(chosenPlayer.combos);

        const [conditions, setConditions] =
            //@ts-ignore
            useState<Condition[]>(chosenPlayer.conditions);

        const [character, setCharacter] = useState<Character>(
            chosenPlayer.character
        );

        const [layers, setLayers] = useState<Layer[]>(chosenPlayer.layers);

        const actions =
            CHARACTERS_ACTIONS[character == Character.Jessica ? 0 : 1];

        const opponentName = opponent.mindName;

        const [openPauseMenu, changePauseMenu] = useState<boolean>(false);

        const [phaserLoaded, setPhaserLoaded] = useState<boolean>(false);

        const handleKeyPress = (ev: KeyboardEvent) => {
            const key = ev.key.toUpperCase();

            if (key.includes('ESCAPE')) {
                changePauseMenu(!openPauseMenu);
            }
        };

        const handleKeyPres2 = (ev: React.KeyboardEvent<HTMLDivElement>) => {
            const key = ev.key.toUpperCase();

            console.log('keybord event', key);
            if (key.includes(' ') && !(p1 == null || p2 == null)) {
                ev.preventDefault();
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
        }, [outputs]);

        const p1 = playerAgentToAgent(player.agent);
        const p2 = playerAgentToAgent(opponent.agent);
        console.log(`p1`, p1);
        console.log(`p2`, p2);

        const ctx = useContext(ShoshinWASMContext);

        useEffect(() => {
            if (phaserLoaded && outputs.length < bestOf) {
                let outputs = [];

                let randSeed = Math.random() * 100;
                for (let i = 0; i < bestOf; i++) {
                    const [output, err] = runCairoSimulation(
                        { ...p1, seed: randSeed + i },
                        { ...p2, seed: randSeed + i },
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

        useEffect(() => {
            console.log(
                'output',
                output,
                'animationFrame',
                animationFrame,
                'fullReplay',
                fullReplay,
                'round',
                round,
                'bestOf',
                bestOf,
                'lives',
                lives
            );
            if (
                output !== undefined &&
                animationFrame == output.agent_0.length - 1 &&
                fullReplay == true &&
                round + 1 < bestOf
            ) {
                console.log('round', round);
                setRound(round + 1);
                setAnimationFrame(0);
                output;

                const p1Hp =
                    output.agent_0[output.agent_0.length - 1].body_state
                        .integrity;
                const p2Hp =
                    output.agent_1[output.agent_1.length - 1].body_state
                        .integrity;

                if (p1Hp < p2Hp) {
                    setLives((lives) => {
                        return [lives[0] - 1, lives[1]];
                    });
                } else if (p1Hp > p2Hp) {
                    setLives((lives) => {
                        return [lives[0], lives[1] - 1];
                    });
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
        const scoreMap = calculateScoreMap(output, character);
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

        const overlayContainerClassName =
            pointOfView == PointOfView.SPECTATOR
                ? spectatorSceneStyles.overlayContainer
                : '';

        //Having this class be conditional on playOnly may not be needed
        const overlayClassName =
            pointOfView == PointOfView.SPECTATOR
                ? spectatorSceneStyles.overlay
                : '';

        let playerOneName = null;

        playerOneName = (
            <Typography>
                {player.mindName} by {player.playerName}
            </Typography>
        );

        let playerTwoName = null;

        playerTwoName = (
            <Typography>
                {opponent.mindName} by {opponent.playerName}
            </Typography>
        );

        const backgroundId =
            'backgroundId' in opponent ? opponent.backgroundId : 0;

        const activeMs =
            N_FRAMES > 0
                ? testJson.agent_0.frames[animationFrame].mental_state
                : 0;

        const [showVictorySnackBar, setShowVictorySnackBar] = useState(false);

        const roundButtons = Array.from({ length: bestOf }, (_, index) => (
            <Button
                variant={round == index ? 'contained' : 'outlined'}
                onClick={() => setRound(index)}
            >
                Round {index + 1}
            </Button>
        ));

        const [isHovered, setIsHovered] = useState(false);

        const handleMouseEnter = () => {
            setIsHovered(true);
        };

        const handleMouseLeave = () => {
            setIsHovered(false);
        };

        const hoveredClass =
            isHovered && pointOfView == PointOfView.SPECTATOR
                ? spectatorSceneStyles.optionsHover
                : '';

        return (
            <div id={'mother'} ref={ref}>
                <Fade in={!phaserLoaded} timeout={500}>
                    <LoadingFull />
                </Fade>
                <FullArtBackground useAlt={true}>
                    <div
                        className={styles.container}
                        onKeyDown={handleKeyPres2}
                    >
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
                                                <Box display={'flex'}>
                                                    <div
                                                        onMouseEnter={
                                                            handleMouseEnter
                                                        }
                                                        onMouseLeave={
                                                            handleMouseLeave
                                                        }
                                                    >
                                                        {!isHovered &&
                                                            pointOfView ==
                                                                PointOfView.SPECTATOR && (
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
                                                            pointOfView !==
                                                                PointOfView.SPECTATOR) && (
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
                                                                >
                                                                    <Typography>
                                                                        Play
                                                                    </Typography>
                                                                    <Box>
                                                                        <Button
                                                                            variant="contained"
                                                                            onClick={() =>
                                                                                setFullReplay(
                                                                                    !fullReplay
                                                                                )
                                                                            }
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
                                                            </Box>
                                                        )}
                                                    </div>
                                                </Box>
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
                                                </Box>
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
                                                    backgroundId={1}
                                                    volume={volume}
                                                    lives={lives}
                                                />
                                            </div>
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
                                            player={player}
                                            isPreview={isPreview}
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
                                <Grid
                                    item
                                    md={6}
                                    lg={5}
                                    xl={5}
                                    visibility={
                                        pointOfView == PointOfView.SPECTATOR
                                            ? 'hidden'
                                            : 'visible'
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

export default SpectatorScene;
