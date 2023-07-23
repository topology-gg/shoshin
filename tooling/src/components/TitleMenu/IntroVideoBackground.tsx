import React, {
    MouseEventHandler,
    ReactEventHandler,
    useEffect,
    useRef,
} from 'react';
import s from './IntroVideoBackground.module.css';

const IntroVideoBackground = ({
    onClick,
    onEnded,
    onLoad,
    playing,
}: {
    onClick?: MouseEventHandler<HTMLVideoElement>;
    onEnded?: ReactEventHandler<HTMLVideoElement>;
    onLoad?: ReactEventHandler<HTMLVideoElement>;
    playing?: boolean;
}) => {
    const videoRef = useRef<HTMLVideoElement>();

    useEffect(() => {
        if (playing && videoRef) videoRef.current.play();
    }, [playing]);

    return (
        <video
            poster="/images/bg/shoshin-menu-bg.jpg"
            className={s.video}
            playsInline
            muted
            onEnded={onEnded}
            ref={videoRef}
            onClick={onClick}
            onLoadedData={onLoad}
            preload="auto"
        >
            <source src="/media/logo-animation.mp4" type="video/mp4"></source>
        </video>
    );
};

export default IntroVideoBackground;
