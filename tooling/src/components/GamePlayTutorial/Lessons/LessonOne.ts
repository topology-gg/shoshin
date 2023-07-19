import { Character } from '../../../constants/constants';
import { PlayerAgent } from '../../../types/Agent';
import { TestJson } from '../../../types/Frame';
import {
    HighlightZone,
    Lesson,
    LessonObjective,
    LessonSlide,
} from '../../../types/Tutorial';
import { opponent0Jessica } from '../../ChooseOpponent/opponents/opponent-0';

const slide0: LessonSlide = {
    content: 'Shoshin is a battle of the minds',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.DIALOGUE,
};

const slide0b: LessonSlide = {
    content: 'Minds do battle in the arena',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.SIMULATOR,
};

const slide1: LessonSlide = {
    content: 'The mind is composed of layers',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.MIND,
};

const slide2: LessonSlide = {
    content: 'Layers are made from a condition and an action',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.MIND,
};

const slide3: LessonSlide = {
    content:
        'Conditions trigger entering a layer and the action is what will be done in that layer',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.NONE,
};

const playedSimulator: LessonObjective = {
    description: 'Played the fight',
    evaluate: (
        animationFrame: number,
        testJson: TestJson,
        playerAgent: PlayerAgent
    ) => {
        return animationFrame > 0;
    },
};

const slide4: LessonSlide = {
    content:
        'We have already built a mind for you in this lessons so hit play to see the mind fight in the arena',
    continueText: 'More on Layers',
    highlightLayer: -1,
    highlightZone: HighlightZone.NONE,
    lessonObjectives: [playedSimulator],
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
const LessonOne: Lesson = {
    title: 'The Mind',
    opponent: opponent0Jessica,
    slides: [slide0, slide0b, slide1, slide2, slide3, slide4],
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

export default LessonOne;
