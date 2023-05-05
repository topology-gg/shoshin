import { TestJson } from "./Frame";
import Agent from './Agent'

export interface PhaserGameProps {
    testJson: TestJson;
    animationFrame: number;
    animationState: string;
    showDebug: boolean;
    gameMode : GameModes
    realTimeOptions : RealTimeOptions
}
export interface SimulatorProps {
    testJson: TestJson;
    animationFrame: number;
    animationState: string;
    showDebug: boolean;
}


interface RealTimeOptions {
    playerCharacter : number,
    agentOpponent : Agent
}

// enum currently name after game scenes, feel free to change
export enum GameModes{
    simulation = 'simulator',
    realtime = 'realtime'
}