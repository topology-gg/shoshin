import React, { useEffect, useRef, useState } from 'react';
//SceneSingle was throwing an error when I started to put scene components as children
import SceneSingle from './SceneSingle';
import { Box } from '@mui/material';
import TitleMenu from '../TitleMenu/menu';
import MainMenu from '../MainMenu/MainMenu';
import ChooseCharacter from '../ChooseCharacter/ChooseCharacter';
import ChooseOpponent from '../ChooseOpponent/ChooseOpponent';
import MainScene from '../SimulationScene/MainScene';
import {
    Character,
    IDLE_AGENT,
    MatchFormat,
    nullScoreMap,
} from '../../constants/constants';
import { INITIAL_AGENT_COMPONENTS } from '../../constants/starter_agent';
import { Action, CHARACTERS_ACTIONS } from '../../types/Action';
import { Layer } from '../../types/Layer';
import Agent, { PlayerAgent } from '../../types/Agent';
import Arcade from '../Arcade/Arcade';
import { GameModes } from '../../types/Simulator';
import { ShoshinWASMContext } from '../../context/wasm-shoshin';
import {
    AntocOnlineOpponents,
    AntocOpponents,
    JessicaOnlineOpponents,
    JessicaOpponents,
} from '../ChooseOpponent/opponents/opponents';
import MoveTutorial from '../MoveTutorial/MoveTutorial';
import MechanicsTutorialScene from '../GamePlayTutorial/GameplayTutorial';
import useMediaQuery from '@mui/material/useMediaQuery';
import MobileView from '../MobileView';
import ActionReference from '../ActionReference/ActionReference';
import PauseMenu from '../SimulationScene/PauseMenu';
import {
    Medal,
    Opponent,
    OnlineOpponent,
    SavedMind,
} from '../../types/Opponent';
import OnlineMenu from '../OnlineMenu/OnlineMenu';
import { onlineOpponentAdam } from '../ChooseOpponent/opponents/Adam';
import {
    ShoshinPersistedState,
    getLocalState,
    setLocalState,
} from '../../helpers/localState';
import MindMenu from '../MindScene/MindMenu';

export const Scenes = {
    LOGO: 'logo',
    WALLET_CONNECT: 'wallet_connect',
    MAIN_MENU: 'main_menu',
    CHOOSE_CHARACTER: 'choose_character',
    CHOOSE_OPPONENT: 'choose_opponent',
    MAIN_SCENE: 'main_scene',
    ARCADE: 'arcade',
    MOVE_TUTORIAL: 'move_tutorial',
    GAMEPLAY_TUTORIAL: 'gameplay_tutorial',
    ACTION_REFERENCE: 'action_reference',
    ONLINE_MENU: 'online_menu',
    MINDS: 'minds',
    LEADERBOARD: 'leaderboard',
    SPECTATE: 'spectate',
} as const;
import {
    track_character_select,
    track_scene_change,
    track_beat_opponent,
} from '../../helpers/track';
import LeadboardScene from '../Leaderboard/LeaderboardScene';
import SpectatorScene from '../SimulationScene/SpectatorScene';
import { Playable } from '../../types/Playable';

export type Scene = (typeof Scenes)[keyof typeof Scenes];

const deafaultState: ShoshinPersistedState = {
    playerAgents: {
        jessica: undefined,
        antoc: undefined,
    },
    opponents: {
        jessica: [],
        antoc: [],
    },
    minds: [],
};

const defaultOpponent: Opponent = {
    agent: IDLE_AGENT,
    medal: Medal.NONE,
    id: 0,
    name: '0',
    backgroundId: 0,
    scoreMap: nullScoreMap,
};

export type Spectatable = SavedMind | OnlineOpponent;

const ShowFullReplayStorageKey = 'showFullReplay';
const CompletedTutorialStorageKey = 'CompletedTutorial';

enum MainSceneMode {
    CAMPAIGN,
    ONLINE,
    PREVIEW,
    REPLAY,
}

const SceneSelector = () => {
    const [scene, setScene] = useState<Scene>();

    const [lastScene, setLastScene] = useState<Scene>(Scenes.MAIN_MENU);

    const [mainSceneMode, setMainSceneMode] = useState<MainSceneMode>(
        MainSceneMode.CAMPAIGN
    );

    const [completedTutorial, setCompletedTutorial] = useState<boolean>(true);

    const [format, setFormat] = useState<MatchFormat>(MatchFormat.BO3);

    const musicRef = useRef<HTMLAudioElement>();
    const ctx = React.useContext(ShoshinWASMContext);

    /*     const callUpdateMind = async () => {
        console.log('updating mind');
        const res = useUpdateMind({});
        console.log(res);
    };

    callUpdateMind().catch((e) => {
        console.log(e);
    });
 */
    useEffect(() => {
        track_scene_change(scene);
    }, [scene]);
    useEffect(() => {
        musicRef.current = new Audio('/music/shoshintitle-audio.wav');
        musicRef.current.onended = function () {
            if (scene == Scenes.MAIN_MENU) {
                musicRef.current.play();
            }
        };
        setTimeout(() => {
            setScene(Scenes.WALLET_CONNECT);
        }, 500);
    }, []);

    const pauseMusic = () => {
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
    };

    const transitionMainMenu = () => {
        setScene(Scenes.MAIN_MENU);

        if (musicRef.current.pause) {
            musicRef.current.play();
        }
    };

    const [showFullReplay, setShowFullReplay] = useState<boolean>(true);

    useEffect(() => {
        const newShowFullReplay = JSON.parse(
            localStorage.getItem(ShowFullReplayStorageKey)
        );
        if (newShowFullReplay && newShowFullReplay !== showFullReplay) {
            setShowFullReplay(JSON.parse(newShowFullReplay));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            ShowFullReplayStorageKey,
            JSON.stringify(showFullReplay)
        );
    }, [showFullReplay]);

    const [gameMode, setGameMode] = useState<GameModes>(GameModes.simulation);

    const transitionChooseCharacter = () => {
        setScene(Scenes.CHOOSE_CHARACTER);
        pauseMusic();
    };

    const onChooseCharacter = (character: Character) => {
        track_character_select(character);
        setPlayerAgent((playerAgent) => {
            return {
                ...playerAgent,
                character: character,
            };
        });

        pauseMusic();

        const state = getLocalState();
        if (!state) {
            setScene(Scenes.MOVE_TUTORIAL);
            return;
        }
        const playerAgent: PlayerAgent =
            state.playerAgents[character.toLowerCase()];

        if (playerAgent) {
            //Combine missing conditions with initial conditions
            setPlayerAgent({
                ...playerAgent,
                conditions: INITIAL_AGENT_COMPONENTS.conditions,
            });
        }

        if (!playerAgent) {
            setScene(Scenes.MOVE_TUTORIAL);
        } else {
            transitionChooseOpponent();
        }
    };
    const transitionChooseOpponent = () => {
        if (mainSceneMode == MainSceneMode.PREVIEW) {
            setScene(Scenes.MINDS);
        } else if (mainSceneMode == MainSceneMode.ONLINE) {
            setScene(Scenes.ONLINE_MENU);
        } else if (mainSceneMode == MainSceneMode.REPLAY) {
            setScene(Scenes.LEADERBOARD);
        } else {
            setScene(Scenes.CHOOSE_OPPONENT);
        }

        pauseMusic();
    };

    const transitionMainScene = (opponentIndex: number) => {
        if (gameMode == GameModes.simulation) {
            setScene(Scenes.MAIN_SCENE);
        } else {
            setScene(Scenes.ARCADE);
        }
        setSelectedOpponent(opponentIndex);
        pauseMusic();
    };

    //Play state

    const initialPlayerAgent: PlayerAgent = {
        layers: [],
        character: Character.Jessica,
        conditions: INITIAL_AGENT_COMPONENTS.conditions,
        combos: [],
    };

    const [playerAgent, setPlayerAgent] =
        useState<Playable>(initialPlayerAgent);

    let character;
    if (!('character' in playerAgent)) {
        character = playerAgent.agent.character;
    } else {
        character = playerAgent.character;
    }

    //Prop for action reference when coming from choose opponent, character might not be chosen
    const [referenceCharacter, setReferenceCharacter] = useState<Character>(
        Character.Jessica
    );

    useEffect(() => {
        const state = getLocalState();

        const defaultOpponents: Opponent[] = (
            character == Character.Jessica ? JessicaOpponents : AntocOpponents
        ).map(({ agent, mindName, backgroundId }, id) => {
            return {
                agent,
                mindName,
                medal: Medal.NONE,
                id,
                name: id.toString(),
                backgroundId: backgroundId,
                scoreMap: nullScoreMap,
            };
        });
        if (!state) {
            setOpponentChoices(defaultOpponents);
            return;
        }

        const opponentChoices = state.opponents[character.toLocaleLowerCase()];
        if (opponentChoices && opponentChoices.length > 0) {
            setOpponentChoices(opponentChoices);
        } else {
            setOpponentChoices(defaultOpponents);
        }
    }, [character]);

    useEffect(() => {
        const state = getLocalState();
        if (!state || !state.minds) {
            return;
        }
        setMinds(state.minds);
    }, []);

    useEffect(() => {
        const state = JSON.parse(
            localStorage.getItem(CompletedTutorialStorageKey)
        );
        if (state === undefined || state === null) {
            setCompletedTutorial(false);
            return;
        }
        setCompletedTutorial(state);
    }, []);

    const defaultOpponents = (
        character == Character.Jessica ? JessicaOpponents : AntocOpponents
    ).map((agent, id) => {
        return {
            agent: agent,
            medal: Medal.NONE,
            id,
            name: id.toString(),
            backgroundId: 0,
            scoreMap: nullScoreMap,
        } as Opponent;
    });
    const [opponentChoices, setOpponentChoices] =
        useState<Opponent[]>(defaultOpponents);

    const defaultSpectatableOpponents =
        character == Character.Jessica
            ? JessicaOnlineOpponents
            : AntocOnlineOpponents;

    const [spectatableOpponentChoices, setSpectatableOpponentChoices] =
        useState<any[]>(defaultSpectatableOpponents);

    const [onlineOpponentChoice, setOnlineOpponentChoice] =
        useState<OnlineOpponent>(onlineOpponentAdam);

    const [selectedOpponent, setSelectedOpponent] = useState<number>(0);

    const getOpponent = () => {
        if (
            mainSceneMode == MainSceneMode.PREVIEW ||
            mainSceneMode == MainSceneMode.ONLINE
        ) {
            return onlineOpponentChoice;
        }
        console.log('mainSceneMode', mainSceneMode, spectatableOpponentChoices);
        if (mainSceneMode == MainSceneMode.REPLAY) {
            return spectatableOpponentChoices[selectedOpponent];
        }
        return opponentChoices[selectedOpponent];
    };
    const opponent = getOpponent();

    console.log('opponent', opponent);

    const backgroundId = 'backgroundId' in opponent ? opponent.backgroundId : 0;

    const savePlayerAgent = (playerAgent: Playable) => {
        setPlayerAgent(playerAgent);
        let updatedState = deafaultState;
        const state = getLocalState();
        if (state !== null) {
            updatedState = state;
        }

        if (
            'mindName' in playerAgent &&
            mainSceneMode !== MainSceneMode.PREVIEW
        ) {
            const newMinds = minds.map((mind) => {
                if (
                    mind.mindName == playerAgent.mindName &&
                    mind.agent.character == playerAgent.agent.character &&
                    mind.playerName == playerAgent.playerName
                ) {
                    return {
                        ...mind,
                        agent: playerAgent.agent,
                        lastUpdatedDate: Date.now().toString(),
                    };
                }
                return mind;
            });

            updatedState.minds = newMinds;
            setMinds(newMinds);
        }

        if ('layers' in playerAgent) {
            console.log('saving player agent:', playerAgent);
            updatedState.playerAgents[character.toLocaleLowerCase()] =
                playerAgent;
        }

        setLocalState(updatedState);
    };

    const characterIndex = character == Character.Jessica ? 0 : 1;

    const [jessicaProgress, setJessicaProgress] = useState<number>(0);
    const [antocProgress, setAntocProgress] = useState<number>(0);
    const [jessicaGoldCount, setJessicaGoldCount] = useState<number>(0);
    const [antocGoldCount, setAntocGoldCount] = useState<number>(0);

    const [volume, setVolume] = useState<number>(50);

    const [minds, setMinds] = useState<SavedMind[]>([]);

    const getProgressForCharacter = (character: Character) => {
        let updatedState = deafaultState;
        const state = getLocalState();
        if (state !== null) {
            updatedState = state;
        }

        const opponents = updatedState.opponents[character.toLocaleLowerCase()];
        const defeatedOpponents = opponents
            ? updatedState.opponents[character.toLocaleLowerCase()].reduce(
                  (acc, opp) => acc + (opp.medal == Medal.NONE ? 0 : 1),
                  0
              )
            : 0;
        return Math.floor((100 * defeatedOpponents) / opponentChoices.length);
    };

    const getGoldCountForCharacter = (character: Character) => {
        let updatedState = deafaultState;
        const state = getLocalState();
        if (state !== null) {
            updatedState = state;
        }

        const opponents = updatedState.opponents[character.toLocaleLowerCase()];
        const golds = opponents
            ? updatedState.opponents[character.toLocaleLowerCase()].reduce(
                  (acc, opp) => acc + (opp.medal == Medal.GOLD ? 0 : 1),
                  0
              )
            : 0;
        return golds;
    };

    useEffect(() => {
        setJessicaProgress(getProgressForCharacter(Character.Jessica));
        setAntocProgress(getProgressForCharacter(Character.Antoc));
        setJessicaGoldCount(getGoldCountForCharacter(Character.Jessica));
        setAntocGoldCount(getGoldCountForCharacter(Character.Antoc));
    }, [opponentChoices]);

    const handleWin = (player: PlayerAgent, opponent: Opponent) => {
        track_beat_opponent(
            opponent.name,
            selectedOpponent,
            opponent.medal,
            player.layers.length
        );

        let updatedState = deafaultState;
        const state = getLocalState();
        if (state !== null) {
            updatedState = state;
        }
        let updatedOpponents = [];
        if (updatedState.opponents[character.toLocaleLowerCase()].length > 0) {
            updatedOpponents =
                updatedState.opponents[character.toLocaleLowerCase()];
        } else {
            updatedOpponents = opponentChoices;
        }
        updatedOpponents[selectedOpponent] = opponent;

        updatedState.playerAgents[character.toLocaleLowerCase()] = player;
        updatedState.opponents = {
            ...updatedState.opponents,
            [character.toLocaleLowerCase()]: updatedOpponents,
        };

        setOpponentChoices(updatedOpponents);

        setLocalState(updatedState);
    };

    const onTransition = (scene: Scene) => {
        setScene(scene);
        if (scene == Scenes.MAIN_MENU) {
            musicRef.current.play();
        } else {
            pauseMusic();
        }
    };

    const transitionFromMainMenu = (scene: Scene) => {
        pauseMusic();
        if (scene == Scenes.ARCADE) {
            setGameMode(GameModes.realtime);
            transitionChooseCharacter();

            setMainSceneMode(MainSceneMode.CAMPAIGN);
        } else if (scene == Scenes.MAIN_SCENE) {
            setGameMode(GameModes.simulation);
            transitionChooseCharacter();
            setMainSceneMode(MainSceneMode.CAMPAIGN);
        } else if (scene == Scenes.ONLINE_MENU) {
            setGameMode(GameModes.simulation);
            setMainSceneMode(MainSceneMode.ONLINE);
            setScene(scene);
        } else if (scene == Scenes.MINDS) {
            setGameMode(GameModes.simulation);
            setMainSceneMode(MainSceneMode.CAMPAIGN);
            setScene(scene);
        } else {
            setScene(scene);
        }
    };
    const isMobileDisplay = useMediaQuery('(max-width:800px)');
    if (isMobileDisplay) {
        return (
            <div>
                <MobileView />
            </div>
        );
    }

    const transitionToActionReference = (character?: Character) => {
        setLastScene(scene);
        setScene(Scenes.ACTION_REFERENCE);
        setReferenceCharacter(character);
        pauseMusic();
    };

    const transtionFromActionReference = () => {
        setScene(lastScene);
        pauseMusic();
    };

    const handleTitleVideoPlay = () => {
        // We can only play audio when the user has interacted with the dom
        musicRef.current.play();
    };

    const transitionFromOnlineMenu = (
        playerOneMind: SavedMind | OnlineOpponent,
        opponent: OnlineOpponent,
        isSpectate: boolean
    ) => {
        setMainSceneMode(MainSceneMode.ONLINE);
        setScene(Scenes.MAIN_SCENE);
        if (isSpectate == true) {
            setScene(Scenes.SPECTATE);
        } else {
            setScene(Scenes.MAIN_SCENE);
        }

        pauseMusic();
        setPlayerAgent(playerOneMind);
        setOnlineOpponentChoice(opponent);
        setFormat(format);
    };

    const handleQuit = () => {
        if (mainSceneMode == MainSceneMode.ONLINE) {
            setScene(Scenes.ONLINE_MENU);
        } else if (mainSceneMode == MainSceneMode.PREVIEW) {
            setScene(Scenes.MINDS);
        } else if (mainSceneMode == MainSceneMode.REPLAY) {
            setScene(Scenes.LEADERBOARD);
        } else {
            setScene(Scenes.MAIN_MENU);
        }
    };

    const handleContinue = () => {
        if (mainSceneMode == MainSceneMode.ONLINE) {
            setScene(Scenes.ONLINE_MENU);
        } else if (mainSceneMode == MainSceneMode.PREVIEW) {
            setScene(Scenes.MINDS);
        } else if (mainSceneMode == MainSceneMode.REPLAY) {
            setScene(Scenes.LEADERBOARD);
        } else {
            setScene(Scenes.CHOOSE_OPPONENT);
        }
    };

    const handleSelectReplay = (
        mind: OnlineOpponent,
        opponentIndex: number
    ) => {
        setPlayerAgent(mind);
        setSelectedOpponent(opponentIndex);

        setMainSceneMode(MainSceneMode.REPLAY);

        const spectatableOpponents =
            character == Character.Jessica
                ? JessicaOnlineOpponents
                : AntocOnlineOpponents;

        setSpectatableOpponentChoices(spectatableOpponents);
        setScene(Scenes.SPECTATE);
    };

    const pauseMenu = (
        <PauseMenu
            onQuit={handleQuit}
            onChooseCharacter={handleContinue}
            transitionToActionReference={transitionToActionReference}
            volume={volume}
            setVolume={setVolume}
            setShowFullReplay={setShowFullReplay}
            showFullReplay={showFullReplay}
        />
    );

    const transitionToPreview = (
        player: SavedMind | OnlineOpponent,
        opponent: SavedMind | OnlineOpponent
    ) => {
        setOnlineOpponentChoice(opponent as OnlineOpponent);
        setPlayerAgent(player);
        setScene(Scenes.MAIN_SCENE);
        setMainSceneMode(MainSceneMode.PREVIEW);
    };

    const onSaveMinds = (minds: SavedMind[]) => {
        setMinds(minds);

        let updatedState = deafaultState;
        const state = getLocalState();
        if (state !== null) {
            updatedState = state;
        }

        updatedState.minds = minds;

        setLocalState(updatedState);
    };

    const handleCompleteTutorial = () => {
        setCompletedTutorial(true);
        localStorage.setItem(CompletedTutorialStorageKey, JSON.stringify(true));
        onTransition(Scenes.MAIN_MENU);
    };

    const handleSkipTutorial = () => {
        setCompletedTutorial(true);
        localStorage.setItem(CompletedTutorialStorageKey, JSON.stringify(true));
    };

    const isCampaign =
        GameModes.simulation == gameMode &&
        mainSceneMode == MainSceneMode.CAMPAIGN;
    return (
        <Box sx={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <SceneSingle active={scene === Scenes.WALLET_CONNECT}>
                <TitleMenu
                    transitionMainMenu={transitionMainMenu}
                    onPlayVideo={handleTitleVideoPlay}
                />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.MAIN_MENU}>
                <MainMenu
                    transition={transitionFromMainMenu}
                    completedTutorial={completedTutorial}
                    onSkipTutorial={handleSkipTutorial}
                />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.CHOOSE_CHARACTER}>
                <ChooseCharacter
                    transitionChooseOpponent={onChooseCharacter}
                    transitionBack={transitionMainMenu}
                    transitionToActionReference={transitionToActionReference}
                    jessicaProgress={jessicaProgress}
                    antocProgress={antocProgress}
                    antocGoldCount={antocGoldCount}
                    jessicaGoldCount={jessicaGoldCount}
                    opponentCount={opponentChoices.length}
                />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.CHOOSE_OPPONENT}>
                <ChooseOpponent
                    transitionMainScene={transitionMainScene}
                    opponents={opponentChoices}
                    playerCharacter={character}
                    transitionBack={() => transitionChooseCharacter()}
                />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.MOVE_TUTORIAL}>
                <MoveTutorial
                    character={character}
                    firstVisit={true}
                    onContinue={transitionChooseOpponent}
                />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.MAIN_SCENE}>
                <MainScene
                    savePlayerAgent={savePlayerAgent}
                    player={playerAgent}
                    opponent={opponent}
                    submitWin={handleWin}
                    onContinue={handleContinue}
                    onQuit={handleQuit}
                    transitionToActionReference={transitionToActionReference}
                    volume={volume}
                    pauseMenu={pauseMenu}
                    showFullReplay={
                        showFullReplay &&
                        mainSceneMode !== MainSceneMode.PREVIEW
                    }
                    isPreview={mainSceneMode == MainSceneMode.PREVIEW}
                    matchFormat={format}
                    isCampaign={isCampaign}
                    opponentIndex={selectedOpponent}
                />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.SPECTATE}>
                <SpectatorScene
                    savePlayerAgent={savePlayerAgent}
                    player={playerAgent as Spectatable}
                    opponent={opponent as Spectatable}
                    onContinue={handleContinue}
                    onQuit={handleQuit}
                    transitionToActionReference={transitionToActionReference}
                    volume={volume}
                    pauseMenu={pauseMenu}
                    showFullReplay={
                        showFullReplay &&
                        mainSceneMode !== MainSceneMode.PREVIEW
                    }
                    isPreview={mainSceneMode == MainSceneMode.PREVIEW}
                    matchFormat={format}
                    bestOf={3}
                />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.ARCADE}>
                <Arcade
                    playerCharacter={characterIndex}
                    opponent={opponent}
                    volume={volume}
                    pauseMenu={pauseMenu}
                />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.GAMEPLAY_TUTORIAL}>
                <MechanicsTutorialScene
                    onContinue={() => onTransition(Scenes.MAIN_MENU)}
                    onQuit={() => onTransition(Scenes.MAIN_MENU)}
                    volume={volume}
                    setVolume={setVolume}
                    onCompleteTutorial={handleCompleteTutorial}
                />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.ACTION_REFERENCE}>
                <ActionReference
                    character={
                        referenceCharacter ? referenceCharacter : character
                    }
                    onContinue={() => transtionFromActionReference()}
                />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.ONLINE_MENU}>
                <OnlineMenu
                    transitionFromOnlineMenu={transitionFromOnlineMenu}
                    transitionBack={() => onTransition(Scenes.MAIN_MENU)}
                    savedMinds={minds}
                    saveMinds={onSaveMinds}
                />
            </SceneSingle>

            <SceneSingle active={scene === Scenes.MINDS}>
                <MindMenu
                    minds={minds}
                    saveMinds={onSaveMinds}
                    transitionToPreview={transitionToPreview}
                    transitionBack={() => onTransition(Scenes.MAIN_MENU)}
                />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.LEADERBOARD}>
                <LeadboardScene
                    handleSelectReplay={handleSelectReplay}
                    transitionBack={() => onTransition(Scenes.MAIN_MENU)}
                />
            </SceneSingle>
        </Box>
    );
};

export default SceneSelector;
