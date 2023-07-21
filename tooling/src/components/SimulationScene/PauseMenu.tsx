import styles from './PauseMenu.module.css';
import ShoshinMenu, { ShoshinMenuItem } from '../MainMenu/ShoshinMenu';

const PauseMenu = ({
    onQuit,
    onChooseCharacter,
    transitionToActionReference,
}) => {
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
            title: 'Action Reference',
            onClick: () => transitionToActionReference(),
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
