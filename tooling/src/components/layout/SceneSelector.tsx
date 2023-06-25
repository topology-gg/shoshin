import React, { useEffect, useState } from 'react';
import SceneSingle from './SceneSingle';
import { Box, Button } from '@mui/material';

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
    const [scene, setScene] = useState<Scene>('logo');

    useEffect(() => {
        setTimeout(() => {
            setScene('wallet_connect');
        }, 2000);
    }, []);

    return (
        <Box sx={{ position: 'relative' }}>
            <SceneSingle active={scene === Scenes.LOGO}>
                <div>Logo</div>
            </SceneSingle>
            <SceneSingle active={scene === Scenes.WALLET_CONNECT}>
                <div>
                    <div>Logo</div>
                    <Button onClick={() => setScene(Scenes.MAIN_MENU)}>
                        Connect wallet
                    </Button>
                </div>
            </SceneSingle>
            <SceneSingle active={scene === Scenes.MAIN_MENU}>
                <div>
                    <div>Main menu</div>
                    <Button onClick={() => setScene(Scenes.CHOOSE_CHARACTER)}>
                        Play
                    </Button>
                </div>
            </SceneSingle>
            <SceneSingle active={scene === Scenes.CHOOSE_CHARACTER}>
                <div>
                    <div>
                        Character 1
                        <Button
                            onClick={() => setScene(Scenes.CHOOSE_OPPONENT)}
                        >
                            Choose
                        </Button>
                    </div>
                    <div>
                        Character 2
                        <Button
                            onClick={() => setScene(Scenes.CHOOSE_OPPONENT)}
                        >
                            Choose
                        </Button>
                    </div>
                </div>
            </SceneSingle>
            <SceneSingle active={scene === Scenes.CHOOSE_OPPONENT}>
                <div>
                    <div>
                        Opponent 1
                        <Button onClick={() => setScene(Scenes.MAIN_SCENE)}>
                            Choose
                        </Button>
                    </div>
                    <div>
                        Opponent 2
                        <Button onClick={() => setScene(Scenes.MAIN_SCENE)}>
                            Choose
                        </Button>
                    </div>
                </div>
            </SceneSingle>
            <SceneSingle active={scene === Scenes.MAIN_SCENE}>
                <div>
                    <div>Main scene</div>
                </div>
            </SceneSingle>
        </Box>
    );
};

export default SceneSelector;
