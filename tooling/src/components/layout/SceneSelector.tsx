import React, { useEffect, useState } from 'react';
//SceneSingle was throwing an error when I started to put scene components as children
import SceneSingle from './SceneSingle';
import { Box } from '@mui/material';
import TitleMenu from '../TitleMenu/menu';
import MainMenu from '../MainMenu/MainMenu';
import ChooseCharacter from '../ChooseCharacter/ChooseCharacter';
import ChooseOpponent from '../ChooseOpponent/ChooseOpponent';
import MainScene from '../SimulationScene/MainScene';

const Scenes = {
    LOGO: 'logo',
    WALLET_CONNECT: 'wallet_connect',
    MAIN_MENU: 'main_menu',
    CHOOSE_CHARACTER: 'choose_character',
    CHOOSE_OPPONENT: 'choose_opponent',
    MAIN_SCENE: 'main_scene',
} as const;

type Scene = (typeof Scenes)[keyof typeof Scenes];

const SceneSelector = () => {
    const [scene, setScene] = useState<Scene>(Scenes.MAIN_SCENE);

    useEffect(() => {
        setTimeout(() => {
            //setScene('wallet_connect');
        }, 2000);
    }, []);

    return (
        <Box sx={{ position: 'relative' }}>
            {scene === Scenes.WALLET_CONNECT ? <TitleMenu /> : null}
            {scene === Scenes.MAIN_MENU ? <MainMenu /> : null}
            {scene === Scenes.CHOOSE_CHARACTER ? <ChooseCharacter /> : null}
            {scene === Scenes.CHOOSE_OPPONENT ? <ChooseOpponent /> : null}
            {scene === Scenes.MAIN_SCENE ? <MainScene /> : null}
        </Box>
    );
};

export default SceneSelector;
