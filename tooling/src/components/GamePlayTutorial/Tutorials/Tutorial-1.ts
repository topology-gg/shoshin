import { Character } from '../../../constants/constants';
import { HighlightZone, Lesson, LessonSlide } from '../../../types/Tutorial';
import { opponent0Jessica } from '../../ChooseOpponent/opponents/opponent-0';

const slide0: LessonSlide = {
    content: 'Shoshin is a battle of the minds',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.NONE,
};

const slide1: LessonSlide = {
    content: 'The mind is composed of layers',
    continueText: 'Next',
    highlightLayer: -1,
    highlightZone: HighlightZone.MIND,
};

const slide2: LessonSlide = {
    content: 'Layers are made from a condition and action',
    continueText: 'Next',
    highlightLayer: 0,
    highlightZone: HighlightZone.NONE,
};

const slide3: LessonSlide = {
    content:
        'Conditions trigger entering a layer and the action is what will be done in the layer',
    continueText: 'More on Layers',
    highlightLayer: 0,
    highlightZone: HighlightZone.NONE,
};

const LessonOne: Lesson = {
    title: 'The Mind',
    opponent: opponent0Jessica,
    slides: [slide0, slide1, slide2, slide3],
    features: {
        layerAddAndDelete: false,
        conditionAnd: false,
        combos: false,
    },
    player: {
        layers: [],
        character: Character.Jessica,
        combos: [],
        conditions: [],
    },
};

export default LessonOne;
