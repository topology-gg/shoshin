import { GameModes } from '../types/Simulator';

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
