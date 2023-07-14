import React, { useEffect, useRef, useState } from 'react';
import styles from './CardCarousel3D.module.css';
import { config } from 'react-spring';
import dynamic from 'next/dynamic';
import { Card, CardContent, Typography } from '@mui/material';

const Carousel = dynamic(() => import('react-spring-3d-carousel'), {
    ssr: false,
});

interface CardCarousel3DProps {
    cards: any[];
    offset: number;
    showArrows: boolean;
    currentIndex: number;
    selectIndex: (index: number) => void;
}

const CardCarousel3D = (props: CardCarousel3DProps) => {
    const table = props.cards.map((element, index) => {
        return {
            key: index,
            content: element,
            onClick: () => props.selectIndex(index),
        };
    });

    const [offsetRadius, setOffsetRadius] = useState(2);
    const [showArrows, setShowArrows] = useState(false);
    const [cards] = useState(table);

    useEffect(() => {
        setOffsetRadius(props.offset);
        setShowArrows(props.showArrows);
    }, [props.offset, props.showArrows]);

    return (
        <Carousel
            slides={cards}
            goToSlide={props.currentIndex}
            offsetRadius={offsetRadius}
            showNavigation={showArrows}
            animationConfig={config.default}
            goToSlideDelay={0}
        />
    );
};

export default CardCarousel3D;
