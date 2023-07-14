import React from 'react';
import ConditionContextMenu from './ConditionContextMenu';
import { Box, Chip } from '@mui/material';
import { LayerCondition } from '../../../types/Layer';
import { LayerProps } from './Gambit';
import { conditionTypeToEmojiFile } from '../../../types/Condition';
import styles from './Gambit.module.css';

type ConditionProps = {
    condition: LayerCondition;
    conditionIndex: number;
    layerIndex: number;
    onClick: (
        event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
    ) => void;
    onRemove: (layerIndex: number, conditionIndex: number) => void;
    onInvertCondition: LayerProps['handleInvertCondition'];
};

export const ConditionLabel = ({
    name,
    type,
    isInverted = false,
}: {
    name: string;
    type: string;
    isInverted?: boolean;
}) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isInverted && <Chip size="small" color="error" label="NOT" />}
            <ConditionEmojiElement type={type} />
            <span>{name}</span>
        </Box>
    );
};

export const ConditionEmojiElement = ({ type }: { type: string }) => {
    const filePath = conditionTypeToEmojiFile(type);
    return <img src={filePath} height="15px" />;
};

const Condition = ({
    condition,
    conditionIndex,
    onClick,
    onInvertCondition,
    onRemove,
    layerIndex,
}: ConditionProps) => {
    return (
        <ConditionContextMenu
            handleInvertCondition={onInvertCondition}
            layerIndex={layerIndex}
            conditionIndex={conditionIndex}
        >
            <Chip
                color="default"
                label={
                    <>
                        <ConditionLabel
                            name={condition.displayName}
                            type={condition.type}
                            isInverted={condition.isInverted}
                        />
                    </>
                }
                className={`${styles.gambitButton} ${styles.conditionButton}`}
                id={`condition-btn-${layerIndex}-${conditionIndex}`}
                onClick={onClick}
                onDelete={
                    onRemove && (() => onRemove(layerIndex, conditionIndex))
                }
                style={{
                    fontFamily: 'Raleway',
                    fontSize: '14px',
                    verticalAlign: 'middle',
                    padding: '0',
                }}
            />
        </ConditionContextMenu>
    );
};

export default Condition;
