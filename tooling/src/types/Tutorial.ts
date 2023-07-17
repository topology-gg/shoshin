import { GambitFeatures } from '../components/sidePanelComponents/Gambit/Gambit';
import Agent, { PlayerAgent } from './Agent';

export enum HighlightZone {
    SIMULATOR = 'simulator',
    MIND = 'mind',
    DIALOGUE = 'dialogue',
    LAYER_ADD = 'layerAdd',
    SHOSHIN = 'shoshin',
    Combos = 'Combos',
    NONE = 'none',
}

export interface LessonSlide {
    content: string;
    highlightZone: HighlightZone;
    highlightLayer: number;
    continueText: string;
}

enum Features {
    LayerAddAndDelete = 'LayerAddAndDelete',
    ConditionAnd = 'ConditionAnd',
    Combos = 'Combos',
}

//disables, debug, add layer, append conditions, delete condition
//action choices, condition choices

export interface Lesson {
    title: string;
    slides: LessonSlide[];
    player: PlayerAgent;
    opponent: Agent;
    features: GambitFeatures;
}
