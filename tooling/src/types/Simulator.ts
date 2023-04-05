import { TestJson } from "./Frame";

export interface SimulatorProps {
    testJson: TestJson;
    animationFrame: number;
    animationState: string;
    showDebug: boolean;
}
