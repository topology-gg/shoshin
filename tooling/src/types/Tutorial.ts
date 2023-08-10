import { GambitFeatures } from '../components/sidePanelComponents/Gambit/Gambit';
import { Action } from './Action';
import Agent, { PlayerAgent } from './Agent';
import { TestJson } from './Frame';

export enum HighlightZone {
    SIMULATOR = 'simulator',
    MIND = 'mind',
    DIALOGUE = 'dialogue',
    LAYER_ADD = 'layerAdd',
    SHOSHIN = 'shoshin',
    Combos = 'Combos',
    NONE = 'none',
}

export interface LessonObjective {
    description: string;
    evaluate: (
        animationFrame: number,
        testJson: TestJson,
        playerAgent: PlayerAgent
    ) => boolean;
}
export interface LessonSlide {
    content: string;
    highlightZone: HighlightZone;
    highlightLayer: number;
    continueText: string;
    lessonObjectives?: LessonObjective[];
}

//disables, debug, add layer, append conditions, delete condition
//action choices, condition choices

export interface Lesson {
    title: string;
    slides: LessonSlide[];
    player: PlayerAgent;
    opponent: Agent;
    features: GambitFeatures;
    actions: Action[];
    initialSelectedCombo?: number;
}
