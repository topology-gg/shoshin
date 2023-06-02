import { Box } from '@mui/material';
import React from 'react';

export const Keyword = ({
    text,
    fontSizeInPixel,
    bgColorInHex,
    textColorInHex,
}: {
    text: String;
    fontSizeInPixel: number;
    bgColorInHex: String;
    textColorInHex: String;
}) => {
    const fontSize = `${fontSizeInPixel}px`;
    const bgColor = `#${bgColorInHex}`;
    const textColor = `#${textColorInHex}`;

    return (
        <span
            style={{
                fontSize: fontSize,
                backgroundColor: bgColor,
                color: textColor,
                padding: '4px',
                borderRadius: '4px',
                height: '24px',
            }}
        >
            {text}
        </span>
    );
};

export const KeywordMentalState = ({ text }: { text: String }) => {
    return (
        <Keyword
            text={text}
            fontSizeInPixel={12}
            bgColorInHex={'ffa0bf'}
            textColorInHex={'222'}
        />
    );
};

export const KeywordBodyState = ({ text }: { text: String }) => {
    return (
        <Keyword
            text={text}
            fontSizeInPixel={12}
            bgColorInHex={'ffdb42'}
            textColorInHex={'222'}
        />
    );
};

export const KeywordCondition = ({ text }: { text: String }) => {
    return (
        <Keyword
            text={text}
            fontSizeInPixel={12}
            bgColorInHex={'bcd3e5'}
            textColorInHex={'222'}
        />
    );
};
