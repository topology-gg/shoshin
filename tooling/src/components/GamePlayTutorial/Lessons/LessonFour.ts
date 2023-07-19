import { Character } from '../../../constants/constants';
import { Sidecut, Slash, Upswing } from '../../../types/Action';
import { HighlightZone, Lesson, LessonSlide } from '../../../types/Tutorial';
import { AutoLowKick } from '../../ChooseOpponent/opponents/Lowkick';
import { opponent0Jessica } from '../../ChooseOpponent/opponents/opponent-0';
import { defeatOpponentObjective } from './CommonObjectives';

const slide0: LessonSlide = {
    content:
        'In the previous tutorial our character performed a low kick \n normal attacks are countered by block \n blocks are countered by low kick \n can you guess what counters low attacks?',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.DIALOGUE,
};

const slide1: LessonSlide = {
    content:
        'Modify the actions of your character to perform a high attack to beat the opponents low attack',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.NONE,
    lessonObjectives: [defeatOpponentObjective],
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
            },
        ],
        action: {
            id: 4,
            isCombo: false,
        },
    },
];
const LessonFour: Lesson = {
    title: 'Combat',
    opponent: AutoLowKick,
    slides: [slide0, slide1],
    features: {
        layerAddAndDelete: false,
        conditionAnd: false,
        combos: false,
    },
    player: {
        // @ts-ignore
        layers,
        character: Character.Jessica,
        combos: [],
        conditions: [],
    },
    actions: [Slash, Upswing, Sidecut],
};

export default LessonFour;
