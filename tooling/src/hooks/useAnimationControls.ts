import { useCallback, useEffect, useRef, useState } from 'react';
import {
    bodyStateNumberToName,
    characterTypeToString,
} from '../constants/constants';
import { FrameScene } from '../types/Frame';

export enum AnimationState {
    RUN = 'Run',
    PAUSE = 'Pause',
    STOP = 'Stop',
}

const LATENCY = 70;
const HITSTOP_TIMER = LATENCY * 3;

/** Compute whether hit-stop is needed on the current frame */
const needsHitStop = (
    animFrame: number,
    simulationOutput: FrameScene,
    characterP1: number | undefined,
    characterP2: number | undefined
) => {
    const frames_0 = simulationOutput?.agent_0;
    const frames_1 = simulationOutput?.agent_1;

    if (!frames_0 || !frames_1) {
        return;
    }

    // check if hit-stop timer is required
    // (if any of the character is in counter==1 of HURT / KNOCKED / LAUNCH / CLASHED)
    const bodyStateP1 = frames_0[animFrame]?.body_state;
    const bodyStateP2 = frames_1[animFrame]?.body_state;

    const stateP1: string =
        bodyStateNumberToName[characterTypeToString[characterP1]][
            bodyStateP1.state
        ];
    const stateP2: string =
        bodyStateNumberToName[characterTypeToString[characterP2]][
            bodyStateP2.state
        ];
    const hitstop_strings = ['hurt', 'knocked', 'launched', 'clash'];

    const p1NeedsHitstop =
        hitstop_strings.some(function (s) {
            return stateP1.indexOf(s) >= 0;
        }) && bodyStateP1.counter == 1;
    const p2NeedsHitstop =
        hitstop_strings.some(function (s) {
            return stateP2.indexOf(s) >= 0;
        }) && bodyStateP2.counter == 1;

    return p1NeedsHitstop || p2NeedsHitstop;
};

const useAnimationControls = (
    simulationOutput: FrameScene,
    characterP1: number,
    characterP2: number
) => {
    const mainTimer = useRef<NodeJS.Timer>();
    const hitStopTimer = useRef<NodeJS.Timer>();

    const [animationFrame, setAnimationFrame] = useState<number>(0);
    const [animationState, setAnimationState] = useState<AnimationState>(
        AnimationState.STOP
    );

    // Keep animation length in ref so it can be used in callbacks
    const animationLengthRef = useRef<number>();

    const handleHitStop = useCallback(
        (animationFrame: number, animationStepForward: () => void) => {
            if (
                needsHitStop(
                    animationFrame,
                    simulationOutput,
                    characterP1,
                    characterP2
                )
            ) {
                // 1. kill the simulation timer
                clearInterval(mainTimer.current);
                // 2. launch the hit stop timer
                // Clear any hitstop timer if started
                clearTimeout(hitStopTimer.current);
                hitStopTimer.current = setTimeout(() => {
                    // hit stop timer's callback:
                    // kill itself
                    clearTimeout(hitStopTimer.current);
                    // relaunch simulation timer
                    mainTimer.current = setInterval(() => {
                        animationStepForward();
                    }, LATENCY);
                }, HITSTOP_TIMER);
            }
        },
        [simulationOutput, characterP1, characterP2]
    );

    const animationStepForward = useCallback(() => {
        // Advance the frame, restart if at last frame
        setAnimationFrame((prev) =>
            prev === animationLengthRef.current - 1 ? 0 : prev + 1
        );
    }, []);

    const animationStepBackward = useCallback(() => {
        setAnimationFrame((prev) => (prev > 0 ? prev - 1 : prev));
    }, []);

    const setSpecificFrame = (animFrame: number) => {
        // kill the hit-stop timer so that the animation isn't restarted automatically
        clearTimeout(hitStopTimer.current);
        setAnimationFrame(animFrame);
    };

    const start = useCallback(() => {
        setAnimationState(AnimationState.RUN);

        const newTimer = setInterval(() => {
            animationStepForward();
        }, LATENCY);
        mainTimer.current = newTimer;
    }, [animationStepForward]);

    const pause = useCallback(() => {
        clearInterval(mainTimer.current); // kill the simulation timer
        clearTimeout(hitStopTimer.current); // kill the hit-stop timer
        setAnimationState(AnimationState.PAUSE);
    }, []);

    const stop = useCallback(() => {
        clearInterval(mainTimer.current); // kill the timers
        clearTimeout(hitStopTimer.current); // kill the hit-stop timer
        setAnimationState(AnimationState.STOP);
        setAnimationFrame(0);
    }, []);

    // Handle hit-stop calculation each frame
    useEffect(() => {
        // We're not interested in hit-stop unless we're running the animation
        if (animationState !== AnimationState.RUN) return;

        handleHitStop(animationFrame, animationStepForward);
    }, [animationFrame, handleHitStop, animationStepForward, animationState]);

    // Pause the state on last frame
    useEffect(() => {
        if (!simulationOutput) return;

        animationLengthRef.current = simulationOutput.agent_0.length;

        if (animationFrame === animationLengthRef.current - 1) {
            pause();
        }
    }, [animationFrame, simulationOutput, pause]);

    return {
        animationFrame,
        setAnimationFrame: setSpecificFrame,
        animationState,
        animationStepForward,
        animationStepBackward,
        start,
        pause,
        stop,
    };
};

export default useAnimationControls;
