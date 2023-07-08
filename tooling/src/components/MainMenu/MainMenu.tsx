import React from 'react';

import { GameModes } from '../../types/Simulator';
import ShoshinMenu, { ShoshinMenuItem } from './ShoshinMenu';
import FullArtBackground from '../layout/FullArtBackground';

const MainMenu = React.forwardRef<
    unknown,
    { transition: (gameMode: GameModes) => void }
>(({ transition }, ref) => {
    const items: ShoshinMenuItem[] = [
        {
            title: 'Play',
            onClick: () => transition(GameModes.simulation),
        },
        {
            title: 'Arcade Mode',
            onClick: () => transition(GameModes.realtime),
        },
        {
            title: 'About Shoshin',
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
            <ShoshinMenu menuTitle={title} menuItems={items} />
        </FullArtBackground>
    );
});

export default MainMenu;
