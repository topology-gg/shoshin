import { Character } from '../../../constants/constants';
import { Slash, DashForward } from '../../../types/Action';
import { PlayerAgent } from '../../../types/Agent';
import { TestJson } from '../../../types/Frame';
import { HighlightZone, Lesson, LessonSlide } from '../../../types/Tutorial';
import { opponent0Jessica } from '../../ChooseOpponent/opponents/opponent-0';
import { defeatOpponentObjective } from './CommonObjectives';

const slide0: LessonSlide = {
    content: 'Combos allow you to perform multiple actions together',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.Combos,
};

const slide1: LessonSlide = {
    content:
        'Some actions synergize with each other when sequenced together in a combo',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.Combos,
};

const combineDashAndSlash = {
    description: "Create a combo that performs 'DashForward' and then 'Slash'",
    evaluate: (
        animationFrame: number,
        testJson: TestJson,
        playerAgent: PlayerAgent
    ) => {
        const found = playerAgent.combos.findIndex((combo) => {
            if (
                combo.length == 2 &&
                combo[0].id == DashForward.id &&
                combo[1].id == Slash.id
            ) {
                return true;
            }
        });
        return found !== -1;
    },
};

const slide2: LessonSlide = {
    content: "Create a combo that does 'DashForward' and 'Slash' together",
    continueText: 'Finish Tutorial',
    highlightLayer: -1,
    highlightZone: HighlightZone.NONE,
    lessonObjectives: [combineDashAndSlash, defeatOpponentObjective],
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
                        value: 1,
                        type: 'Constant',
                    },
                    {
                        value: '==',
                        type: 'Operator',
                    },
                    {
                        value: 1,
                        type: 'Constant',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Always true',
                key: '1686113964152',
                isInverted: false,
            },
        ],
        action: {
            id: 101,
            isCombo: true,
        },
    },
];

const LessonSeven: Lesson = {
    title: 'Layers',
    opponent: opponent0Jessica,
    slides: [slide0, slide1, slide2],
    features: {
        layerAddAndDelete: false,
        conditionAnd: false,
        combos: true,
    },
    player: {
        //@ts-ignore
        layers,
        character: Character.Jessica,
        combos: [[]],
        conditions: [],
    },
    actions: [Slash, DashForward],
    initialSelectedCombo: 0,
};

export default LessonSeven;
