import React, { ReactEventHandler } from 'react';
import s from './IntroVideoBackground.module.css';

const IntroVideoBackground = ({
    onEnded,
}: {
    onEnded?: ReactEventHandler<HTMLVideoElement>;
}) => {
    return (
        <video
            poster="/images/bg/shoshin-menu-bg.jpg"
            className={s.video}
            playsInline
            autoPlay
            muted
            onEnded={onEnded}
        >
            <source src="/media/logo-animation.mp4" type="video/mp4"></source>
        </video>
    );
};

export default IntroVideoBackground;
