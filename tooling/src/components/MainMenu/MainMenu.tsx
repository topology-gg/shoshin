import React from 'react';

import { GameModes } from '../../types/Simulator';
import ShoshinMenu, { ShoshinMenuItem } from './ShoshinMenu';
import FullArtBackground from '../layout/FullArtBackground';
import { Scene, Scenes } from '../layout/SceneSelector';

const MainMenu = React.forwardRef<
    unknown,
    { transition: (scene: Scene, gameMode: GameModes) => void }
>(({ transition }, ref) => {
    const items: ShoshinMenuItem[] = [
        {
            title: 'Play',
            onClick: () => transition(Scenes.MAIN_SCENE, GameModes.simulation),
        },
        {
            title: 'Online',
            onClick: () => transition(Scenes.ONLINE_MENU, GameModes.simulation),
        },
        {
            title: 'Arcade Mode',
            onClick: () => transition(Scenes.ARCADE, GameModes.realtime),
        },
        {
            title: 'Tutorial',
            onClick: () =>
                transition(Scenes.GAMEPLAY_TUTORIAL, GameModes.simulation),
        },
        {
            title: 'Profile',
        },
        {
            title: 'Settings',
        },
    ];

    const title = 'Shoshin';
    return (
        <FullArtBackground ref={ref}>
            <ShoshinMenu displayLogo={false} menuItems={items} />
        </FullArtBackground>
    );
});

export default MainMenu;
