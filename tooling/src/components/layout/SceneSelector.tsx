import React, { useEffect, useState } from 'react';
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

const Scenes = {
    LOGO: 'logo',
    WALLET_CONNECT: 'wallet_connect',
    MAIN_MENU: 'main_menu',
    CHOOSE_CHARACTER: 'choose_character',
    CHOOSE_OPPONENT: 'choose_opponent',
    MAIN_SCENE: 'main_scene',
    ARCADE: 'arcade',
    MOVE_TUTORIAL: 'move_tutorial',
} as const;

type Scene = (typeof Scenes)[keyof typeof Scenes];

export interface Opponent {
    agent: Agent;
    medal: Medal;
}

export enum Medal {
    NONE = 'None',
    GOLD = 'Gold',
    SILVER = 'Silver',
    BRONZE = 'Bronze',
}

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

const StorageKey = 'PersistedGameState';
const SceneSelector = () => {
    const [scene, setScene] = useState<Scene>(Scenes.ARCADE);

    const ctx = React.useContext(ShoshinWASMContext);

    useEffect(() => {
        setTimeout(() => {
            //setScene('wallet_connect');
        }, 2000);
    }, []);

    const transitionMainMenu = () => {
        setScene(Scenes.MAIN_MENU);
    };

    const [gameMode, setGameMode] = useState<GameModes>(GameModes.simulation);

    const transitionChooseCharacter = (gameMode: GameModes) => {
        setGameMode(gameMode);
        setScene(Scenes.CHOOSE_CHARACTER);
    };

    const getLocalState = (): ShoshinPersistedState | null => {
        const storedState = localStorage.getItem(StorageKey);
        if (storedState !== undefined && storedState !== null) {
            const state: ShoshinPersistedState = JSON.parse(storedState);
        }

        return null;
    };

    const setLocalState = (state: ShoshinPersistedState) => {
        localStorage.setItem(StorageKey, JSON.stringify(state));
    };

    const onChooseCharacter = (character: Character) => {
        setCharacter(character);
        setScene(Scenes.MOVE_TUTORIAL);

        const state = getLocalState();
        if (!state) {
            return;
        }
        const playerAgent: PlayerAgent =
            state.playerAgents[character.toLowerCase()];
        setPlayerAgent(playerAgent);
    };
    const transitionChooseOpponent = () => {
        setScene(Scenes.CHOOSE_OPPONENT);
    };

    const transitionMainScene = (opponent: Agent) => {
        console.log('opponent', opponent);
        setOpponent(opponent);
        if (gameMode == GameModes.simulation) {
            setScene(Scenes.MAIN_SCENE);
        } else {
            setScene(Scenes.ARCADE);
        }
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

    useEffect(() => {
        const state = getLocalState();
        if (!state) {
            const opponents =
                character == Character.Jessica
                    ? JessicaOpponents
                    : AntocOpponents;
            const addMedals = opponents.map((agent) => {
                return { agent: agent, medal: Medal.NONE };
            });
            setOpponentChoices(addMedals);
            return;
        }

        const opponentChoices = state.opponents[character.toLocaleLowerCase()];
        if (opponentChoices) {
            setOpponentChoices(opponentChoices);
        }
    }, [character]);

    const [opponentChoices, setOpponentChoices] = useState<Opponent[]>([]);

    const [opponent, setOpponent] = useState<Agent>(IDLE_AGENT);

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

    const defeatedOpponents = opponentChoices.reduce(
        (acc, opp) => acc + (opp.medal == Medal.NONE ? 0 : 1),
        0
    );
    const characterProgress =
        (100 * defeatedOpponents) / opponentChoices.length;

    const handleWin = (player: PlayerAgent, opponent: Opponent) => {
        let updatedState = deafaultState;
        const state = getLocalState();
        if (state !== null) {
            updatedState = state;
        }

        if (updatedState.opponents[character.toLocaleLowerCase()]) {
            updatedState.opponents = updatedState.opponents[
                character.toLocaleLowerCase()
            ].map((opp: Opponent) => {
                if (opp.agent === opponent.agent) {
                    return opponent;
                }
                return opp;
            });
        }

        updatedState.playerAgents[character.toLocaleLowerCase()] = player;

        setLocalState(updatedState);
    };

    const onTransition = (scene: Scene) => {
        setScene(scene);
    };

    return (
        <Box sx={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <SceneSingle active={scene === Scenes.WALLET_CONNECT}>
                <TitleMenu transitionMainMenu={transitionMainMenu} />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.MAIN_MENU}>
                <MainMenu transition={transitionChooseCharacter} />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.CHOOSE_CHARACTER}>
                <ChooseCharacter transitionChooseOpponent={onChooseCharacter} />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.CHOOSE_OPPONENT}>
                <ChooseOpponent
                    transitionMainScene={transitionMainScene}
                    opponents={opponentChoices}
                    playerCharacter={character}
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
                />
            </SceneSingle>
            <SceneSingle active={scene === Scenes.ARCADE}>
                <Arcade playerCharacter={characterIndex} opponent={opponent} />
            </SceneSingle>
            {/* {scene === Scenes.ARCADE ? (
                <Arcade playerCharacter={characterIndex} opponent={opponent} />
            ) : null} */}
        </Box>
    );
};

export default SceneSelector;
