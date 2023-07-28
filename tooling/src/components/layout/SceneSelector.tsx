import React, { useEffect, useRef, useState } from 'react';
//SceneSingle was throwing an error when I started to put scene components as children
import SceneSingle from './SceneSingle';
import { Box } from '@mui/material';
import TitleMenu from '../TitleMenu/menu';
import MainMenu from '../MainMenu/MainMenu';
import ChooseCharacter from '../ChooseCharacter/ChooseCharacter';
import ChooseOpponent from '../ChooseOpponent/ChooseOpponent';
import MainScene from '../SimulationScene/MainScene';
import { Character, IDLE_AGENT } from '../../constants/constants';
import { INITIAL_AGENT_COMPONENTS } from '../../constants/starter_agent';
import { Action, CHARACTERS_ACTIONS } from '../../types/Action';
import { Layer } from '../../types/Layer';
import Agent, { PlayerAgent } from '../../types/Agent';
import Arcade from '../Arcade/Arcade';
import { GameModes } from '../../types/Simulator';
import { ShoshinWASMContext } from '../../context/wasm-shoshin';
import {
    AntocOpponents,
    JessicaOpponents,
} from '../ChooseOpponent/opponents/opponents';
import MoveTutorial from '../MoveTutorial/MoveTutorial';
import MechanicsTutorialScene from '../GamePlayTutorial/GameplayTutorial';
import useMediaQuery from '@mui/material/useMediaQuery';
import MobileView from '../MobileView';
import ActionReference from '../ActionReference/ActionReference';
import PauseMenu from '../SimulationScene/PauseMenu';
import { Medal, Opponent } from '../../types/Opponent';

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
} as const;

export type Scene = (typeof Scenes)[keyof typeof Scenes];

interface ShoshinPersistedState {
    playerAgents: {
        jessica?: PlayerAgent;
        antoc?: PlayerAgent;
    };
    opponents: {
        jessica: Opponent[];
        antoc: Opponent[];
    };
}

const deafaultState: ShoshinPersistedState = {
    playerAgents: {
        jessica: undefined,
        antoc: undefined,
    },
    opponents: {
        jessica: [],
        antoc: [],
    },
};

const defaultOpponent: Opponent = {
    agent: IDLE_AGENT,
    medal: Medal.NONE,
    id: 0,
    name: '0',
    backgroundId: 0,
};
const StorageKey = 'PersistedGameState';
const SceneSelector = () => {
    const [scene, setScene] = useState<Scene>(Scenes.MAIN_SCENE);

    const [lastScene, setLastScene] = useState<Scene>();
    const musicRef = useRef<HTMLAudioElement>();
    const isProduction = process.env.NODE_ENV === 'production';
    const ctx = React.useContext(ShoshinWASMContext);

    useEffect(() => {
        musicRef.current = new Audio('/music/shoshintitle-audio.wav');
        musicRef.current.onended = function () {
            if (scene == Scenes.MAIN_MENU) {
                musicRef.current.play();
            }
        };
        if (!isProduction) {
            return;
        }
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
            localStorage.getItem('showFullReplay')
        );
        if (newShowFullReplay && newShowFullReplay !== showFullReplay) {
            setShowFullReplay(JSON.parse(newShowFullReplay));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('showFullReplay', JSON.stringify(showFullReplay));
    }, [showFullReplay]);

    const [gameMode, setGameMode] = useState<GameModes>(GameModes.simulation);

    const transitionChooseCharacter = (gameMode: GameModes) => {
        setGameMode(gameMode);
        setScene(Scenes.CHOOSE_CHARACTER);
        pauseMusic();
    };
    3;

    const getLocalState = (): ShoshinPersistedState | null => {
        const storedState = localStorage.getItem(StorageKey);
        if (storedState !== undefined && storedState !== null) {
            const state: ShoshinPersistedState = JSON.parse(storedState);
            return state;
        }

        return null;
    };

    const setLocalState = (state: ShoshinPersistedState) => {
        localStorage.setItem(StorageKey, JSON.stringify(state));
    };

    const onChooseCharacter = (character: Character) => {
        setCharacter((_) => character);
        setScene(Scenes.MOVE_TUTORIAL);
        pauseMusic();

        const state = getLocalState();
        if (!state) {
            return;
        }
        const playerAgent: PlayerAgent =
            state.playerAgents[character.toLowerCase()];

        if (playerAgent) {
            setPlayerAgent(playerAgent);
        }
    };
    const transitionChooseOpponent = () => {
        setScene(Scenes.CHOOSE_OPPONENT);
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
    const [layers, setLayers] = useState<Layer[]>([]);
    const [character, setCharacter] = useState<Character>(Character.Jessica);
    const [conditions, setConditions] =
        //@ts-ignore
        useState<Condition[]>(INITIAL_AGENT_COMPONENTS.conditions);
    const [combos, setCombos] = useState<Action[][]>(
        INITIAL_AGENT_COMPONENTS.combos
    );

    //Prop for action reference when coming from choose opponent, character might not be chosen
    const [referenceCharacter, setReferenceCharacter] = useState<Character>(
        Character.Jessica
    );

    useEffect(() => {
        const state = getLocalState();

        const defaultOpponents = (
            character == Character.Jessica ? JessicaOpponents : AntocOpponents
        ).map(({ agent, mindName, backgroundId }, id) => {
            return {
                agent,
                mindName,
                medal: Medal.NONE,
                id,
                name: id.toString(),
                backgroundId: backgroundId,
            } as Opponent;
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

    const defaultOpponents = (
        character == Character.Jessica ? JessicaOpponents : AntocOpponents
    ).map((agent, id) => {
        return {
            agent: agent,
            medal: Medal.NONE,
            id,
            name: id.toString(),
            backgroundId: 0,
        } as Opponent;
    });
    const [opponentChoices, setOpponentChoices] =
        useState<Opponent[]>(defaultOpponents);

    const [selectedOpponent, setSelectedOpponent] = useState<number>(0);

    const opponent = opponentChoices[selectedOpponent];

    const setPlayerAgent = (playerAgent: PlayerAgent) => {
        setLayers(playerAgent.layers);
        setConditions(playerAgent.conditions);
        setCombos(playerAgent.combos);

        let updatedState = deafaultState;
        const state = getLocalState();
        if (state !== null) {
            updatedState = state;
        }

        updatedState.playerAgents[character.toLocaleLowerCase()] = playerAgent;

        setLocalState(updatedState);
    };

    const playerAgent: PlayerAgent = {
        layers,
        character,
        conditions,
        combos,
    };

    const characterIndex = character == Character.Jessica ? 0 : 1;

    const [jessicaProgress, setJessicaProgress] = useState<number>(0);
    const [antocProgress, setAntocProgress] = useState<number>(0);
    const [jessicaGoldCount, setJessicaGoldCount] = useState<number>(0);
    const [antocGoldCount, setAntocGoldCount] = useState<number>(0);

    const [volume, setVolume] = useState<number>(50);

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

    const transitionFromMainMenu = (scene: Scene, gameMode: GameModes) => {
        pauseMusic();
        if (scene == Scenes.ARCADE || scene == Scenes.MAIN_SCENE) {
            transitionChooseCharacter(gameMode);
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

    const pauseMenu = (
        <PauseMenu
            onQuit={() => onTransition(Scenes.MAIN_MENU)}
            onChooseCharacter={() => onTransition(Scenes.CHOOSE_OPPONENT)}
            transitionToActionReference={transitionToActionReference}
            volume={volume}
            setVolume={setVolume}
            setShowFullReplay={setShowFullReplay}
            showFullReplay={showFullReplay}
        />
    );
    return (
        <Box sx={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <SceneSingle active={scene === Scenes.WALLET_CONNECT}>
                <TitleMenu
                    transitionMainMenu={transitionMainMenu}
                    onPlayVideo={handleTitleVideoPlay}
                />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.MAIN_MENU}>
                <MainMenu transition={transitionFromMainMenu} />
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
                    transitionBack={() => transitionChooseCharacter(gameMode)}
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
                    setPlayerAgent={setPlayerAgent}
                    player={playerAgent}
                    opponent={opponent}
                    submitWin={handleWin}
                    onContinue={() => onTransition(Scenes.CHOOSE_OPPONENT)}
                    onQuit={() => onTransition(Scenes.MAIN_MENU)}
                    transitionToActionReference={transitionToActionReference}
                    volume={volume}
                    pauseMenu={pauseMenu}
                    showFullReplay={showFullReplay}
                />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.ARCADE}>
                <Arcade
                    playerCharacter={characterIndex}
                    opponent={opponent.agent}
                    volume={volume}
                    backgroundId={opponent.backgroundId}
                    pauseMenu={pauseMenu}
                />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.GAMEPLAY_TUTORIAL}>
                <MechanicsTutorialScene
                    onContinue={() => onTransition(Scenes.MAIN_MENU)}
                    onQuit={() => onTransition(Scenes.MAIN_MENU)}
                    volume={volume}
                    setVolume={setVolume}
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
        </Box>
    );
};

export default SceneSelector;
