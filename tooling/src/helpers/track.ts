import { GameModes } from '../types/Simulator';
import * as amplitude from '@amplitude/analytics-browser';
import mixpanel from 'mixpanel-browser';
import { Medal } from '../types/Opponent';

export const track = (event: GamePlayEvent) => {
    mixpanel.track(event.name, event.data);
    amplitude.track(event.name, event.data);
};

export type GamePlayEvent = {
    name: 'GamePlayTrack';
    data: {
        play_time: number;
        mode: GameModes;
        role: string;
        start_time: number;
        end_time: number;
    };
};

export class GamePlayTimer {
    private startTime: number;
    private endTime: number;
    private mode: GameModes;
    private role: string;
    private running: boolean = false;

    constructor(mode: GameModes, role = '') {
        this.mode = mode;
        this.role = role;
    }

    isRunning() {
        return this.running;
    }

    start() {
        this.startTime = Date.now();
        this.running = true;
    }

    stop() {
        this.endTime = Date.now();
        this.running = false;
    }

    getEvent(): GamePlayEvent {
        return {
            name: 'GamePlayTrack',
            data: {
                play_time: this.endTime - this.startTime,
                mode: this.mode,
                role: this.role,
                start_time: this.startTime,
                end_time: this.endTime,
            },
        };
    }
}

export const track_lesson_complete = (
    lessonIndex: number,
    lessonTitle: string
) => {
    amplitude.track('Complete Lesson', {
        lessonIndex: lessonIndex,
        lessonTitle: lessonTitle,
    });
};

export const track_scene_change = (currentScene, incomingScene: string) => {
    amplitude.track('Change Scene', {
        currentScene,
        incomingScene,
    });
};

export const track_character_select = (character: string) => {
    amplitude.track('Select Character', {
        character,
    });
};

export const track_beat_opponent = (
    opponentName: string,
    opponentIndex: number,
    performance: Medal,
    layerCount: number
) => {
    amplitude.track('Beat Opponent', {
        opponentName,
        opponentIndex,
        performance,
        layerCount,
    });
};
