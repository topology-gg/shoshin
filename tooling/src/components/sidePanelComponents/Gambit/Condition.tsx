import React, { ChangeEventHandler } from 'react';
import ConditionContextMenu from './ConditionContextMenu';
import { Box, Chip, Input, Typography } from '@mui/material';
import { LayerCondition } from '../../../types/Layer';
import { LayerProps } from './Gambit';
import {
    Condition as ConditionType,
    conditionTypeToEmojiFile,
} from '../../../types/Condition';
import styles from './Gambit.module.css';
import { SpaRounded } from '@mui/icons-material';

/**
 * Store information about all the conditions that have a value that
 * can be customized. The condition is matched by name.
 * The customizable value is at the specified index.
 */
const customValueConditions = [
    // displayName, element index for custom value
    { displayName: 'My health < X', index: 3 },
];

type ConditionProps = {
    condition: LayerCondition;
    conditionIndex: number;
    layerIndex: number;
    onClick: (
        event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
    ) => void;
    onRemove: (layerIndex: number, conditionIndex: number) => void;
    onInvertCondition: LayerProps['handleInvertCondition'];
    onValueChange: (condition: ConditionType, index: number) => void;
};

export const ConditionLabel = ({
    name,
    type,
    isInverted = false,
    // hasLayer is used for styling from white to black color
    hasLayer = false,
}: {
    name: string;
    type: string;
    isInverted?: boolean;
    hasLayer?: boolean;
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
            }}
        >
            {isInverted && <Chip size="small" color="error" label="NOT" />}
            <ConditionEmojiElement type={type} />
            <span
                style={{
                    color: hasLayer ? 'black' : 'white',
                    fontFamily: 'Eurostile',
                }}
            >
                {name}
            </span>
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
    onValueChange,
    onRemove,
    layerIndex,
}: ConditionProps) => {
    const customValueCondition = customValueConditions.find(
        ({ displayName }) => displayName === condition.displayName
    );

    const conditionCustomValue =
        customValueCondition && condition.elements[customValueCondition.index];

    const onCustomValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newCondition = {
            ...condition,
            elements: condition.elements.map((elem, i) =>
                i === customValueCondition.index
                    ? { ...elem, value: parseInt(e.target.value) }
                    : elem
            ),
        };
        onValueChange(newCondition, conditionIndex);
    };

    const displayName = customValueCondition
        ? condition.displayName.replace(/([<>=]) X/, '$1')
        : condition.displayName;

    return (
        <ConditionContextMenu
            handleInvertCondition={onInvertCondition}
            layerIndex={layerIndex}
            conditionIndex={conditionIndex}
        >
            <Chip
                color="default"
                label={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <ConditionLabel
                            name={displayName}
                            type={condition.type}
                            isInverted={condition.isInverted}
                            hasLayer={true}
                        />
                        {customValueCondition && (
                            <Input
                                type="number"
                                onClick={(e) => e.stopPropagation()}
                                value={conditionCustomValue.value}
                                onChange={onCustomValueChange}
                                sx={{ width: 50 }}
                            />
                        )}
                    </Box>
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
