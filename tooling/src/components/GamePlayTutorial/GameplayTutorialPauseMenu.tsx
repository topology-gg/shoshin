import styles from '../SimulationScene/PauseMenu.module.css';
import ShoshinMenu, { ShoshinMenuItem } from '../MainMenu/ShoshinMenu';

const GameplayTutorialPauseMenu = ({ onQuit }) => {
    const items: ShoshinMenuItem[] = [
        {
            title: 'Exit to Main Menu',
            onClick: () => onQuit(),
        },
    ];

    const title = 'Pause';
    return (
        <div className={styles.overlayContainer}>
            <ShoshinMenu menuTitle={title} menuItems={items} />
        </div>
    );
};

export default GameplayTutorialPauseMenu;
