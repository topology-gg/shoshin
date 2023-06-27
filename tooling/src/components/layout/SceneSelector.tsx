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
import { Action } from '../../types/Action';
import { Layer } from '../../types/Layer';
import Agent, { PlayerAgent } from '../../types/Agent';
import Arcade from '../Arcade/Arcade';
import { GameModes } from '../../types/Simulator';
import { ShoshinWASMContext } from '../../context/wasm-shoshin';

const Scenes = {
    LOGO: 'logo',
    WALLET_CONNECT: 'wallet_connect',
    MAIN_MENU: 'main_menu',
    CHOOSE_CHARACTER: 'choose_character',
    CHOOSE_OPPONENT: 'choose_opponent',
    MAIN_SCENE: 'main_scene',
    ARCADE: 'arcade',
} as const;

type Scene = (typeof Scenes)[keyof typeof Scenes];

interface Opponent {
    agent: Agent;
    defeated: boolean;
}

interface Medal {
    NONE: 'None';
    GOLD: 'Gold';
    SILVER: 'Silver';
    BRONZE: 'Bronze';
}
interface ShoshinPersistedState {
    playerAgents: {
        jessica?: PlayerAgent;
        antoc?: PlayerAgent;
    };
    opponents: {
        jessica: { agent: Agent; medal: Medal }[];
        antoc: { agent: Agent; medal: Medal }[];
    };
}

const SceneSelector = () => {
    const [scene, setScene] = useState<Scene>(Scenes.WALLET_CONNECT);

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

    const transitionChooseOpponent = (character: Character) => {
        console.log('character', character);
        setCharacter(character);
        const storedState = localStorage.getItem('PersistedGameState');

        if (storedState !== undefined && storedState !== null) {
            const state: ShoshinPersistedState = JSON.parse(storedState);
            const playerAgent: PlayerAgent =
                state.playerAgents[character.toLowerCase()];
            setPlayerAgent(playerAgent);
        }

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

    const [opponent, setOpponent] = useState<Agent>(IDLE_AGENT);

    const setPlayerAgent = (playerAgent: PlayerAgent) => {
        setLayers(playerAgent.layers);
        setConditions(playerAgent.conditions);
        setCombos(playerAgent.combos);
    };

    const playerAgent: PlayerAgent = {
        layers,
        character,
        conditions,
        combos,
    };
    /* 
    useEffect(() => {
        // Restore if any data found in localStorage
        const storedLayers = localStorage.getItem('layers');
        const storedConditions = localStorage.getItem('conditions');
        const storedCombos = localStorage.getItem('combos');

        console.log('stored layers', storedLayers);
        if (storedLayers !== null && storedLayers !== undefined) {
            setLayers(JSON.parse(storedLayers));
            //setAgentInPanelToAgent(JSON.parse(storedAgent));
            const character =
                parseInt(localStorage.getItem('character')) == 0
                    ? Character.Jessica
                    : Character.Antoc;
            setCharacter(character);
            if (storedConditions) {
                setConditions(JSON.parse(storedConditions));
            }
            if (storedCombos) {
                setCombos(JSON.parse(storedCombos));
            }
        }
    }, []); */

    const characterIndex = character == Character.Jessica ? 0 : 1;
    return (
        <Box sx={{ position: 'relative' }}>
            {scene === Scenes.WALLET_CONNECT ? (
                <TitleMenu transitionMainMenu={transitionMainMenu} />
            ) : null}
            {scene === Scenes.MAIN_MENU ? (
                <MainMenu transition={transitionChooseCharacter} />
            ) : null}
            {scene === Scenes.CHOOSE_CHARACTER ? (
                <ChooseCharacter
                    transitionChooseOpponent={transitionChooseOpponent}
                />
            ) : null}
            {scene === Scenes.CHOOSE_OPPONENT ? (
                <ChooseOpponent transitionMainScene={transitionMainScene} />
            ) : null}
            {scene === Scenes.MAIN_SCENE ? (
                <MainScene
                    setPlayerAgent={setPlayerAgent}
                    player={playerAgent}
                    opponent={opponent}
                />
            ) : null}
            {scene === Scenes.ARCADE ? (
                <Arcade playerCharacter={characterIndex} opponent={opponent} />
            ) : null}
        </Box>
    );
};

export default SceneSelector;
