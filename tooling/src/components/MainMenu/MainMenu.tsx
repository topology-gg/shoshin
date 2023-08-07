import React from 'react';

import { GameModes } from '../../types/Simulator';
import ShoshinMenu, { ShoshinMenuItem } from './ShoshinMenu';
import FullArtBackground from '../layout/FullArtBackground';
import { Scene, Scenes } from '../layout/SceneSelector';
import { Button } from '@mui/material';

const MainMenu = React.forwardRef<
    unknown,
    {
        transition: (scene: Scene, gameMode: GameModes) => void;
        completedTutorial: boolean;
        onSkipTutorial: () => void;
    }
>(({ transition, completedTutorial = true, onSkipTutorial }, ref) => {
    const items: ShoshinMenuItem[] = [
        {
            title: 'Play',
            onClick: () => transition(Scenes.MAIN_SCENE, GameModes.simulation),
        },
        /* {
            title: 'Online',
            onClick: () => transition(Scenes.ONLINE_MENU, GameModes.simulation),
        }, */
        {
            title: 'Arcade Mode',
            onClick: () => transition(Scenes.ARCADE, GameModes.realtime),
        },
        {
            title: 'Tutorial',
            onClick: () =>
                transition(Scenes.GAMEPLAY_TUTORIAL, GameModes.simulation),
        },
        /*         {
            title: 'Minds',
            onClick: () => transition(Scenes.MINDS, GameModes.simulation),
        }, */
        {
            title: 'Settings',
        },
    ];

    const newPlayerItems: ShoshinMenuItem[] = [
        {
            title: 'Tutorial',
            onClick: () =>
                transition(Scenes.GAMEPLAY_TUTORIAL, GameModes.simulation),
        },
    ];

    const title = 'Shoshin';
    return (
        <FullArtBackground ref={ref}>
            <ShoshinMenu
                displayLogo={false}
                menuItems={completedTutorial ? items : newPlayerItems}
            >
                {!completedTutorial && (
                    <Button onClick={onSkipTutorial}> Skip Tutorial </Button>
                )}
            </ShoshinMenu>
        </FullArtBackground>
    );
});

export default MainMenu;
