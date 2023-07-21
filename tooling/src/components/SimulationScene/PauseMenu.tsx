import styles from './PauseMenu.module.css';
import ShoshinMenu, { ShoshinMenuItem } from '../MainMenu/ShoshinMenu';

const PauseMenu = ({ onQuit, onChooseCharacter, volume, setVolume }) => {
    const items: ShoshinMenuItem[] = [
        {
            title: 'Change Opponent',
            onClick: () => onChooseCharacter(),
        },
        {
            title: 'Exit to Main Menu',
            onClick: () => onQuit(),
        },
    ];

    const title = 'Pause';
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

export default PauseMenu;
