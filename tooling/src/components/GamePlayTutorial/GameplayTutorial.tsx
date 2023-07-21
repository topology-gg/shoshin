import React, { ForwardedRef, useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Grid,
    Button,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import styles from '../../../styles/Home.module.css';
import { FrameScene, TestJson } from '../../types/Frame';
import Agent, { PlayerAgent, buildAgent } from '../../types/Agent';
import StatusBarPanel, {
    StatusBarPanelProps as PlayerStatuses,
} from '../StatusBar';
import { Action, CHARACTERS_ACTIONS } from '../../types/Action';
import { Character, numberToCharacter } from '../../constants/constants';
import { Layer, layersToAgentComponents } from '../../types/Layer';
import useRunCairoSimulation from '../../hooks/useRunCairoSimulation';
import dynamic from 'next/dynamic';
import { GameModes } from '../../types/Simulator';
import MidScreenControl from '../MidScreenControl';
import Gambit from '../sidePanelComponents/Gambit/Gambit';
import { Condition } from '../../types/Condition';
import SquareOverlayMenu from '../SimulationScene/SuccessMenu';
import { Medal, Opponent } from '../layout/SceneSelector';
import mainSceneStyles from '../SimulationScene/MainScene.module.css';
import PauseMenu from '../SimulationScene/PauseMenu';
import tutorial from './Lessons/Tutorial';
import { HighlightZone, Lesson } from '../../types/Tutorial';
import GameCard from '../ui/GameCard';
import FullArtBackground from '../layout/FullArtBackground';
import GameplayTutorialMenu from './GameplayTutorialMenu';
//@ts-ignore
const Game = dynamic(() => import('../../Game/PhaserGame'), {
    ssr: false,
});

interface MoveTutorialProps {
    onContinue: () => void;
    onQuit: () => void;
}

//We need Players agent and opponent
const GameplayTutorialScene = React.forwardRef(
    (props: MoveTutorialProps, ref: ForwardedRef<HTMLDivElement>) => {
        const { onQuit, onContinue } = props;
        // Constants
        const LATENCY = 70;
        const runnable = true;

        const [lessonIndex, changeLesson] = useState<number>(0);
        const lesson = tutorial[lessonIndex];
        const [slideIndex, changeSlide] = useState<number>(0);

        const currentSlide = lesson.slides[slideIndex];

        const highlightSimulator =
            currentSlide.highlightZone == HighlightZone.SIMULATOR;
        const highlightMind = currentSlide.highlightZone == HighlightZone.MIND;

        const { title } = lesson;

        const hasHighLights =
            currentSlide.highlightZone != HighlightZone.NONE ||
            currentSlide.highlightLayer != -1;

        // React states for simulation / animation control
        const [output, setOuput] = useState<FrameScene>();
        const [simulationError, setSimulationError] = useState();
        const [p1, setP1] = useState<Agent>();
        const p2: Agent = lesson.opponent;

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
        const [combos, setCombos] = useState<Action[][]>(lesson.player.combos);

        const [conditions, setConditions] =
            //@ts-ignore
            useState<Condition[]>(lesson.player.conditions);

        const [character, setCharacter] = useState<Character>(
            lesson.player.character
        );

        const [layers, setLayers] = useState<Layer[]>(lesson.player.layers);

        const initialObjectiveProgess = currentSlide.lessonObjectives?.length
            ? currentSlide.lessonObjectives.map((objective) => {
                  return objective.evaluate(animationFrame, testJson, {
                      layers,
                      character,
                      combos,
                      conditions,
                  });
              })
            : [];

        const [objectiveProgress, setObjectiveProgress] = useState<boolean[]>(
            initialObjectiveProgess
        );
        const canGoToNextSlide = objectiveProgress.every(
            (progress) => progress
        );

        const opponentName =
            lesson.opponent.character == 0
                ? Character.Jessica
                : Character.Antoc;

        const [openPauseMenu, changePauseMenu] = useState<boolean>(false);

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
            const { combos, conditions, layers, character } =
                tutorial[lessonIndex].player;
            setLayers(layers);
            setCombos(combos);
            setConditions(conditions);
            setCharacter(character);
        }, [lessonIndex]);

        useEffect(() => {
            let builtAgent = handleBuildAgent();
            setP1(builtAgent);
        }, [character, combos, conditions, layers]);

        function handleBuildAgent() {
            let char = Object.keys(Character).indexOf(character);

            console.log('layers', layers);
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

        useEffect(() => {
            const updatedObjectiveProgress = currentSlide.lessonObjectives
                ?.length
                ? currentSlide.lessonObjectives.map((objective) => {
                      return objective.evaluate(animationFrame, testJson, {
                          layers,
                          character,
                          combos,
                          conditions,
                      });
                  })
                : [];
            setObjectiveProgress(updatedObjectiveProgress);
        }, [
            currentSlide,
            animationFrame,
            testJson,
            layers,
            character,
            combos,
            conditions,
        ]);

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

        const beatAgent =
            output !== undefined
                ? output.agent_0[output.agent_0.length - 1].body_state
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
            if (beatAgent && N_FRAMES - 1 === animationFrame) {
                //changeShowVictory(true);
                //changePlayedWinningReplay(true);
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

        const handleSlideContinue = () => {
            if (slideIndex + 1 < lesson.slides.length) {
                changeSlide((slideIndex + 1) % lesson.slides.length);
            } else {
                if (lessonIndex + 1 < tutorial.length) {
                    changeLesson(lessonIndex + 1);
                    changeSlide(0);
                    clearInterval(loop); // kill the timer
                    setAnimationState('Stop');
                    setAnimationFrame((_) => 0);
                    setTestJson(null);
                } else {
                    onContinue();
                }
            }
        };
        const playOnly = false && !playedWinningReplay && beatAgent;

        const overlayContainerClassName = playOnly
            ? mainSceneStyles.overlayContainer
            : '';

        //Having this class be conditional on playOnly may not be needed
        const overlayClassName = playOnly
            ? mainSceneStyles.overlay
            : mainSceneStyles.simulatorContainer;

        const p1Name = lesson.player.character;
        const p2Name = numberToCharacter(lesson.opponent.character);

        const activeMs =
            N_FRAMES > 0
                ? testJson.agent_0.frames[animationFrame].mental_state
                : 0;

        const objectives = currentSlide.lessonObjectives?.map(
            (objective, index) => {
                return (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <FormControlLabel
                            sx={{ pointerEvents: 'none' }}
                            key={index}
                            control={
                                <Checkbox
                                    checked={objectiveProgress[index]}
                                    sx={{
                                        color: '#FC5853',
                                        '&.Mui-checked': {
                                            color: '#FC5853',
                                        },
                                    }}
                                    //https://stackoverflow.com/a/63126124
                                    key={Math.random()}
                                />
                            }
                            label={objective.description}
                        />
                    </Box>
                );
            }
        );

        return (
            <FullArtBackground useAlt={true}>
                <div id={'mother'} className={styles.container} ref={ref}>
                    {' '}
                    <div className={mainSceneStyles.overlayMenu}></div>
                    <div className={styles.main}>
                        {hasHighLights ? (
                            <div className={'overlay-menu'}> </div>
                        ) : null}
                        {showVictory ? (
                            <SquareOverlayMenu
                                opponentName={opponentName}
                                performance={performance}
                                handleContinueClick={handleContinueClick}
                            />
                        ) : null}
                        {openPauseMenu ? (
                            <GameplayTutorialMenu onQuit={onQuit} />
                        ) : null}
                        <Grid
                            container
                            spacing={{ xs: 1 }}
                            sx={{ width: '100%' }}
                        >
                            <Grid item lg={1} />
                            <Grid
                                item
                                xs={12}
                                lg={10}
                                className={hasHighLights ? 'elevated' : ''}
                            >
                                <GameCard image={'/images/bg/f2f2f2.png'}>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        width="100%"
                                    >
                                        <Typography variant="h6" align="center">
                                            {title}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            align="center"
                                        >
                                            {currentSlide.content}
                                        </Typography>
                                        {objectives}
                                        <Typography
                                            variant="body1"
                                            align="center"
                                            style={{ opacity: 0.5 }}
                                        >
                                            {slideIndex + 1} /{' '}
                                            {lesson.slides.length}
                                        </Typography>
                                        <Box
                                            display="flex"
                                            justifyContent="flex-end"
                                            width="100%"
                                            mt={2}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                disabled={!canGoToNextSlide}
                                                onClick={() =>
                                                    handleSlideContinue()
                                                }
                                            >
                                                {currentSlide.continueText}
                                            </Button>
                                        </Box>
                                    </Box>
                                </GameCard>
                            </Grid>

                            <Grid item xs={12} md={12} lg={6}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                    }}
                                    className={
                                        highlightSimulator ? 'elevated' : ''
                                    }
                                >
                                    <div className={overlayContainerClassName}>
                                        <div className={overlayClassName}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                <Typography>
                                                    {p1Name}
                                                </Typography>
                                                <Typography>
                                                    {p2Name}
                                                </Typography>
                                            </Box>
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
                                                backgroundId={0}
                                            />
                                        </div>
                                    </div>
                                    {playOnly ? (
                                        <div style={{ height: '400px' }}></div>
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
                                            if (animationState == 'Run') return;
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
                                </div>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={6}
                                className={highlightMind ? 'elevated' : ''}
                            >
                                <GameCard
                                    image={'/images/bg/f2f2f2.png'}
                                    height={'95%'}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'top',
                                            alignItems: 'left',
                                            borderRadius: '0 0 0 0',
                                        }}
                                    >
                                        <Gambit
                                            layers={layers}
                                            setLayers={setLayers}
                                            features={lesson.features}
                                            character={character}
                                            conditions={conditions}
                                            combos={combos}
                                            setCombos={setCombos}
                                            activeMs={activeMs}
                                            actions={lesson.actions}
                                        />
                                    </Box>
                                </GameCard>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </FullArtBackground>
        );
    }
);

export default GameplayTutorialScene;
