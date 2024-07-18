import styles from '../SimulationScene/PauseMenu.module.css';
import ShoshinMenu, { ShoshinMenuItem } from '../MainMenu/ShoshinMenu';

const GameplayTutorialMenu = ({ onQuit, volume, setVolume }) => {
    const items: ShoshinMenuItem[] = [
        {
            title: 'Exit to Main Menu',
            onClick: () => onQuit(),
        },
    ];

    return (
        <div className={styles.overlayContainer}>
            <ShoshinMenu
                menuItems={items}
                displayLogo={true}
                volume={volume}
                setVolume={setVolume}
            />
        </div>
    );
};

export default GameplayTutorialMenu;
