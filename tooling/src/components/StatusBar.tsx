import React from 'react';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import styles from '../../styles/StatusBar.module.css';
import '../../styles/StatusBar.module.css';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import LinearProgress, {
    linearProgressClasses,
} from '@mui/material/LinearProgress';
import { TestJson } from '../types/Frame';

const StaminaBarHeight = 15;

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47',
    },
});

interface statusBarProps {
    value: number;
    positionedLeft: boolean;
}
const IntegrityBar = (props: statusBarProps) => {
    let { value, positionedLeft } = props;

    const bar = (
        <StyledRating
            name="customized-color"
            readOnly={true}
            getLabelText={(value: number) =>
                `${value} Heart${value !== 1 ? 's' : ''}`
            }
            precision={0.5}
            value={value / 100}
            icon={<FavoriteIcon fontSize="inherit" />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
            max={10}
        />
    );
    const text = <p style={{ margin: '0 6px' }}>{value}</p>;

    if (positionedLeft) {
        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {bar}
                {text}
            </div>
        );
    } else {
        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {text}
                {bar}
            </div>
        );
    }
};

const StaminaBar = (props: statusBarProps) => {
    let { value, positionedLeft } = props;

    let staminaBarValues = [];

    for (let i = 1; i < 10; i++) {
        staminaBarValues.push(
            <div
                style={{
                    position: 'relative',
                    top: -StaminaBarHeight * i,
                    left: 20 * i,
                    zIndex: 200,
                    width: 2,
                    height: StaminaBarHeight,
                    backgroundColor: 'green',
                }}
                key={`status-bar-value-${i}`}
            ></div>
        );
    }

    // Reference
    // https://github.com/topology-gg/shoshin-tooling/pull/50
    // https://www.colorsexplained.com/shades-of-blue-color-names/ - Maya blue
    const CustomLinearProgress = styled(LinearProgress)(({ datatype }) => ({
        height: StaminaBarHeight,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: '#EEE',
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: '#73C2FB',
        },
    }));

    const bar = (
        <>
            <CustomLinearProgress
                datatype="stamina"
                variant="determinate"
                value={value / 10}
                sx={{ width: 206, height: StaminaBarHeight }}
            />
            {/* {staminaBarValues} */}
        </>
    );

    if (positionedLeft) {
        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {bar}
                <p style={{ margin: '0 6px' }}>{value}</p>
            </div>
        );
    } else {
        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <p style={{ margin: '0 6px' }}>{value}</p>
                {bar}
            </div>
        );
    }
};

export interface StatusBarPanelProps {
    integrity_0: number;
    integrity_1: number;
    stamina_0: number;
    stamina_1: number;
}

const StatusBarPanel = ({
    integrity_0,
    integrity_1,
    stamina_0,
    stamina_1,
}: StatusBarPanelProps) => {
    return (
        <div>
            <div className={styles.statusBarRow}>
                <IntegrityBar value={integrity_0} positionedLeft={true} />
                <IntegrityBar value={integrity_1} positionedLeft={false} />
            </div>
            <div className={styles.statusBarRow} style={{ height: '1rem' }}>
                <StaminaBar value={stamina_0} positionedLeft={true} />
                <StaminaBar value={stamina_1} positionedLeft={false} />
            </div>
        </div>
    );
};

export default StatusBarPanel;
