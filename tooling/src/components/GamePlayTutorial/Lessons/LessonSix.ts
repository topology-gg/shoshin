import { Character } from '../../../constants/constants';
import { MoveForward } from '../../../types/Action';
import { PlayerAgent } from '../../../types/Agent';
import { TestJson } from '../../../types/Frame';
import {
    HighlightZone,
    Lesson,
    LessonObjective,
    LessonSlide,
} from '../../../types/Tutorial';
import { opponent0Jessica } from '../../ChooseOpponent/opponents/opponent-0';
import { defeatOpponentObjective } from './CommonObjectives';

const slide0: LessonSlide = {
    content:
        "Conditions can be inverted to match the opposite of it's criteria. \nTo invert a condition right click on a condition and select 'Invert Condition.'",
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.DIALOGUE,
};

const invertLayerWithMoveForward = {
    description: 'Invert the condition that has the MoveForward action.',
    evaluate: (
        animationFrame: number,
        testJson: TestJson,
        playerAgent: PlayerAgent
    ) => {
        const match = playerAgent.layers.findIndex((layer) => {
            const hasInvertedCondtion = layer.conditions.findIndex(
                (condition) => condition.isInverted
            );
            console.log('playerAgent.layers', playerAgent.layers);
            if (
                layer.action.id == MoveForward.id &&
                hasInvertedCondtion !== -1
            ) {
                return true;
            }
            return false;
        });

        console.log('match', match);
        return match !== -1;
    },
};

const slide1: LessonSlide = {
    content: "Beat the opponent by using the 'Invert Condition' feature",
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.NONE,
    lessonObjectives: [invertLayerWithMoveForward, defeatOpponentObjective],
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
                isInverted: false,
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
                isInverted: false,
            },
        ],
        action: {
            id: 5,
            isCombo: false,
        },
    },
];

const LessonSix: Lesson = {
    title: 'Inverting Conditions',
    opponent: opponent0Jessica,
    slides: [slide0, slide1],
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

export default LessonSix;
