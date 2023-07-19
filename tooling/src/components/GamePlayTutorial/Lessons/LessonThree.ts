import { Character } from '../../../constants/constants';
import { JessicaLowKick } from '../../../types/Action';
import { HighlightZone, Lesson, LessonSlide } from '../../../types/Tutorial';
import { blockOnlyAntoc } from '../../ChooseOpponent/opponents/BlockOnly';
import { opponent0Jessica } from '../../ChooseOpponent/opponents/opponent-0';
import { defeatOpponentObjective } from './CommonObjectives';

const slide0: LessonSlide = {
    content:
        'Our character currently walks up to the opponent until is in range but does not attack',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.NONE,
};

const slide1: LessonSlide = {
    content: 'Add a new layer to attack the opponent when it is within  80',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.NONE,
    lessonObjectives: [defeatOpponentObjective],
};

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
                value: 80,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Within 80',
        type: 'spacing',
        key: 501331749,
        isInverted: false,
    },
];

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
                        value: 80,
                        type: 'Constant',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Within 80',
                type: 'spacing',
                key: 501331749,
                isInverted: true,
            },
        ],
        action: {
            id: 5,
            isCombo: false,
        },
    },
];

const LessonThree: Lesson = {
    title: 'Movement',
    opponent: blockOnlyAntoc,
    slides: [slide0, slide1],
    features: {
        layerAddAndDelete: true,
        conditionAnd: false,
        combos: false,
    },
    player: {
        //@ts-ignore
        layers: layers,
        character: Character.Jessica,
        combos: [],
        //@ts-ignore
        conditions,
    },
    actions: [JessicaLowKick],
};

export default LessonThree;
