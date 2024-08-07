import { TestJson } from './Frame';
import Agent from './Agent';
import { StatusBarPanelProps as PlayerStatuses } from '../components/StatusBar';

export interface PhaserGameProps {
    testJson: TestJson;
    animationFrame: number;
    showDebug: boolean;
    gameMode: GameModes;
    realTimeOptions: RealTimeOptions;
    isInView: boolean;
    backgroundId: number;
    onPhaserLoad?: () => void;
    volume: number;
    lives?: number[];
    playerOneName?: string;
    playerTwoName?: string;
}
export interface SimulatorProps {
    testJson: TestJson;
    animationFrame: number;
    showDebug: boolean;
    lives?: number[];
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
