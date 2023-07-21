import { TestJson } from './Frame';
import Agent from './Agent';
import { StatusBarPanelProps as PlayerStatuses } from '../components/StatusBar';

export interface PhaserGameProps {
    testJson: TestJson;
    animationFrame: number;
    animationState: string;
    showDebug: boolean;
    gameMode: GameModes;
    realTimeOptions: RealTimeOptions;
    isInView: boolean;
    backgroundId: number;
    volume: number;
}
export interface SimulatorProps {
    testJson: TestJson;
    animationFrame: number;
    animationState: string;
    showDebug: boolean;
}

interface RealTimeOptions {
    playerCharacter: number;
    agentOpponent: Agent;
    setPlayerStatuses: (playerStatuses: PlayerStatuses) => void;
}

// enum currently name after game scenes, feel free to change
export enum GameModes {
    simulation = 'simulator',
    realtime = 'realtime',
}
