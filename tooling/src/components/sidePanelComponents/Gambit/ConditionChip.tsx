import { Chip } from '@mui/material';
import styles from './Gambit.module.css';

const ConditionChip = ({ isInverted, ...props }) => {
    if (isInverted == true) {
        return (
            <Chip
                {...props}
                className={`${styles.gambitButton} ${styles.invertedConditionButton}`}
                style={{
                    fontFamily: 'Raleway',
                }}
            />
        );
    } else {
        return (
            <Chip
                {...props}
                className={`${styles.gambitButton} ${styles.conditionButton}`}
                style={{
                    fontFamily: 'Raleway',
                }}
            />
        );
    }
};

export default ConditionChip;
