import styles from '../SimulationScene/PauseMenu.module.css';
import ShoshinMenu, { ShoshinMenuItem } from '../MainMenu/ShoshinMenu';

const GameplayTutorialMenu = ({ onQuit }) => {
    const items: ShoshinMenuItem[] = [
        {
            title: 'Exit to Main Menu',
            onClick: () => onQuit(),
        },
        {
            title: 'Settings',
        },
    ];

    const title = 'Pause';
    return (
        <div className={styles.overlayContainer}>
            <ShoshinMenu menuItems={items} displayLogo={true} />
        </div>
    );
};

export default GameplayTutorialMenu;
