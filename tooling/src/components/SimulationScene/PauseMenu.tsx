import styles from './PauseMenu.module.css';
import ShoshinMenu, { ShoshinMenuItem } from '../MainMenu/ShoshinMenu';

const PauseMenu = ({ onQuit, onChooseCharacter }) => {
    const items: ShoshinMenuItem[] = [
        {
            title: 'Change Opponent',
            onClick: () => onChooseCharacter(),
        },
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

export default PauseMenu;
