import { Character } from '../../../constants/constants';
import { PlayerAgent } from '../../../types/Agent';
import { TestJson } from '../../../types/Frame';
import { HighlightZone, Lesson, LessonSlide } from '../../../types/Tutorial';
import { opponent0Jessica } from '../../ChooseOpponent/opponents/opponent-0';
import {
    DefeatOpponentObjective,
    defeatOpponentObjective,
} from './CommonObjectives';

const slide0: LessonSlide = {
    content: 'Layers are evaluated from top to bottom',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.DIALOGUE,
};

const slide1: LessonSlide = {
    content: 'Layers can be reordered by dragging one above the other',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.MIND,
};

const reorderLayers = {
    description: 'Reordered the layers',
    evaluate: (
        animationFrame: number,
        testJson: TestJson,
        playerAgent: PlayerAgent
    ) => {
        console.log(playerAgent.layers);
        if (playerAgent.layers && playerAgent.layers[0].action.id == 0) {
            return false;
        }
        return true;
    },
};

const slide2: LessonSlide = {
    content: 'Reoreder the layers to beat the opponent',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.NONE,
    lessonObjectives: [reorderLayers, defeatOpponentObjective],
};

const layers = [
    {
        conditions: [
            {
                elements: [
                    {
                        value: '(',
                        type: 'Operator',
                    },
                    {
                        value: 'Abs(',
                        type: 'Operator',
                    },
                    {
                        value: '(',
                        type: 'Operator',
                    },
                    {
                        value: 1,
                        type: 'Perceptible',
                    },
                    {
                        value: '-',
                        type: 'Operator',
                    },
                    {
                        value: 101,
                        type: 'Perceptible',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                    {
                        value: '|',
                        type: 'Operator',
                    },
                    {
                        value: '<=',
                        type: 'Operator',
                    },
                    {
                        value: 100,
                        type: 'Constant',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Within 100',
                type: 'spacing',
                key: -1638791590,
            },
        ],
        action: {
            id: 0,
            isCombo: false,
        },
    },
    {
        conditions: [
            {
                elements: [
                    {
                        value: '(',
                        type: 'Operator',
                    },
                    {
                        value: 'Abs(',
                        type: 'Operator',
                    },
                    {
                        value: '(',
                        type: 'Operator',
                    },
                    {
                        value: 1,
                        type: 'Perceptible',
                    },
                    {
                        value: '-',
                        type: 'Operator',
                    },
                    {
                        value: 101,
                        type: 'Perceptible',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                    {
                        value: '|',
                        type: 'Operator',
                    },
                    {
                        value: '<=',
                        type: 'Operator',
                    },
                    {
                        value: 100,
                        type: 'Constant',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Within 100',
                type: 'spacing',
                key: -1638791590,
            },
        ],
        action: {
            id: 1,
            isCombo: false,
        },
    },
    {
        conditions: [
            {
                elements: [
                    {
                        value: '(',
                        type: 'Operator',
                    },
                    {
                        value: 'Abs(',
                        type: 'Operator',
                    },
                    {
                        value: '(',
                        type: 'Operator',
                    },
                    {
                        value: 1,
                        type: 'Perceptible',
                    },
                    {
                        value: '-',
                        type: 'Operator',
                    },
                    {
                        value: 101,
                        type: 'Perceptible',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                    {
                        value: '|',
                        type: 'Operator',
                    },
                    {
                        value: '<=',
                        type: 'Operator',
                    },
                    {
                        value: 100,
                        type: 'Constant',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Within 100',
                type: 'spacing',
                key: -1638791590,
                isInverted: true,
            },
        ],
        action: {
            id: 5,
            isCombo: false,
        },
    },
];

const LessonTwo: Lesson = {
    title: 'Layers',
    opponent: opponent0Jessica,
    slides: [slide0, slide1, slide2],
    features: {
        layerAddAndDelete: false,
        conditionAnd: false,
        combos: false,
    },
    player: {
        //@ts-ignore
        layers,
        character: Character.Jessica,
        combos: [],
        conditions: [],
    },
    actions: [],
};

export default LessonTwo;
