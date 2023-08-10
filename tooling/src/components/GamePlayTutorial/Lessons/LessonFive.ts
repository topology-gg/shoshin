import { Character } from '../../../constants/constants';
import { Gatotsu, Slash } from '../../../types/Action';
import { PlayerAgent } from '../../../types/Agent';
import { TestJson } from '../../../types/Frame';
import { HighlightZone, Lesson, LessonSlide } from '../../../types/Tutorial';
import { opponent0Jessica } from '../../ChooseOpponent/opponents/opponent-0';
import { defeatOpponentObjective } from './CommonObjectives';

const slide0: LessonSlide = {
    content: 'Performing aggressive moves build rage',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.DIALOGUE,
};

const slide1: LessonSlide = {
    content: 'At 500 rage you can perform a special attack',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.DIALOGUE,
};

const performGatotsuEvaluation = (
    animationFrame: number,
    testJson: TestJson,
    playerAgent: PlayerAgent
) => {
    if (!testJson || testJson.agent_0 === null) {
        return false;
    }
    const gatotsuIndex = testJson.agent_0.frames.findIndex((frame) => {
        return frame.action == Gatotsu.id;
    });

    return gatotsuIndex > -1;
};

export const performGatotsuObjective = {
    description: 'Perform Gatotsu',
    evaluate: performGatotsuEvaluation,
};

export const placeGatotsuAtTopOfLayersObjective = {
    description: 'Reorder Layers so Gatotsu is at the top',
    evaluate: performGatotsuEvaluation,
};

const slide2: LessonSlide = {
    content:
        'Attack your opponent to build rage and then spend it on a special attack. \n Hint : Make sure the Gatotsu layer is above other layers that may block it',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.NONE,
    lessonObjectives: [defeatOpponentObjective, performGatotsuObjective],
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
                key: -1638793513,
                isInverted: true,
            },
        ],
        action: {
            id: 5,
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
                key: -1638793513,
            },
        ],
        action: {
            id: 0,
            isCombo: false,
        },
    },
];

const conditions = [
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
        key: -1638793513,
    },
    {
        elements: [
            {
                value: '!',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 9,
                type: 'Perceptible',
            },
            {
                value: '<=',
                type: 'Operator',
            },
            {
                value: 500,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'My rage > 500',
        type: 'my rage',
        key: -712505282,
    },
];
const LessonFive: Lesson = {
    title: 'Rage',
    opponent: opponent0Jessica,
    slides: [slide0, slide1, slide2],
    features: {
        layerAddAndDelete: true,
        conditionAnd: false,
        combos: false,
        sui: false,
    },
    player: {
        //@ts-ignore
        layers,
        character: Character.Jessica,
        combos: [],
        // @ts-ignore
        conditions,
    },
    actions: [Slash, Gatotsu],
};

export default LessonFive;
