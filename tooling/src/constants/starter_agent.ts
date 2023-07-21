import Agent, { buildAgent } from '../types/Agent';
import { Condition, Perceptible } from '../types/Condition';
import { alwaysTrueCondition } from '../types/Layer';
import { Direction, Tree } from '../types/Tree';

// source: https://stackoverflow.com/a/40958850
function simpleHash(str: string) {
    var hash = 0,
        i,
        chr,
        len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

let preset_conditions = [
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
    },
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
    },
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
                value: 120,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Within 120',
        type: 'spacing',
    },
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
                value: 150,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Within 150',
        type: 'spacing',
    },
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
                value: 180,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Within 180',
        type: 'spacing',
    },
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
                value: 250,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Within 250',
        type: 'spacing',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 10, // jessica slash
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 20, // jessica upswing
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 30, // jessica sidecut
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 1010, // antoc hori
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 1020, // antoc vert
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 140, // jessica gatotsu
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 150, // jessica low kick
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 1160, // antoc low kick
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 160, // Birdswing
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 1190, // Drop Slash
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent attacking',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 40,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 1040,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent blocking',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 130,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 1150,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent jumping',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 150,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 1160,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent low kicking',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 50,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 1130,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent clashed',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 60,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 1050,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent hurt',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 1110,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Dash Forward',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 120,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 1120,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Dash Backward',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 70,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 1060,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent knocked',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 1140,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent steping forward (Antoc)',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 110,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 140,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent in gatotsu (Jessica)',
        type: 'opponent state',
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
                value: '==',
                type: 'Operator',
            },
            {
                value: 1000,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'My rage = 1000',
        type: 'my rage',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 8,
                type: 'Perceptible',
            },
            {
                value: '<=',
                type: 'Operator',
            },
            {
                value: 200,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'My health < 200',
        type: 'my health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 8,
                type: 'Perceptible',
            },
            {
                value: '<=',
                type: 'Operator',
            },
            {
                value: 400,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'My health < 400',
        type: 'my health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 8,
                type: 'Perceptible',
            },
            {
                value: '<=',
                type: 'Operator',
            },
            {
                value: 600,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'My health < 600',
        type: 'my health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 8,
                type: 'Perceptible',
            },
            {
                value: '<=',
                type: 'Operator',
            },
            {
                value: 800,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'My health < 800',
        type: 'my health',
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
                value: Perceptible.OpponentSta,
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
        displayName: 'Opponent rage > 500',
        type: 'my rage',
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
                value: Perceptible.OpponentSta,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 1000,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent rage = 1000',
        type: 'my rage',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 108,
                type: 'Perceptible',
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
        displayName: 'Opponent health < 100',
        type: 'opponent health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 108,
                type: 'Perceptible',
            },
            {
                value: '<=',
                type: 'Operator',
            },
            {
                value: 200,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent health < 200',
        type: 'opponent health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 108,
                type: 'Perceptible',
            },
            {
                value: '<=',
                type: 'Operator',
            },
            {
                value: 300,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent health < 300',
        type: 'opponent health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 108,
                type: 'Perceptible',
            },
            {
                value: '<=',
                type: 'Operator',
            },
            {
                value: 400,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent health < 400',
        type: 'opponent health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 108,
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
        displayName: 'Opponent health < 500',
        type: 'opponent health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 108,
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
        displayName: 'Opponent health < 600',
        type: 'opponent health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 108,
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
        displayName: 'Opponent health < 700',
        type: 'opponent health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 108,
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
        displayName: 'Opponent health < 800',
        type: 'opponent health',
    },
];

preset_conditions = preset_conditions.map((condition, i) => ({
    ...condition,
    key: simpleHash(condition.displayName + i),
}));

const conditions: Condition[] = [alwaysTrueCondition as Condition].concat(
    preset_conditions as Condition[]
);

const trees: Tree[] = [
    {
        nodes: [
            {
                id: '0',
                isChild: false,
            },
            {
                id: 'Attack',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: 'Start',
                isChild: true,
                branch: Direction.Right,
            },
        ],
    },
    {
        nodes: [
            {
                id: '2',
                isChild: false,
            },
            {
                id: 'Defend',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: 'Attack',
                isChild: true,
                branch: Direction.Right,
            },
        ],
    },
    {
        nodes: [
            {
                id: '6',
                isChild: false,
            },
            {
                id: 'Defend',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: 'Attack',
                isChild: true,
                branch: Direction.Right,
            },
        ],
    },

    {
        nodes: [
            {
                id: '0',
                isChild: false,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: '1',
                isChild: false,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: '2',
                isChild: false,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: '3',
                isChild: false,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: '4',
                isChild: false,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: '5',
                isChild: false,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: '6',
                isChild: false,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Right,
            },
        ],
    },
];

const mentalStates = [
    { state: 'Start', action: 5 },
    { state: 'Attack', action: 1 },
    { state: 'Defend', action: 4 },
    { state: 'Ignore', action: 0 },
];

export const INITIAL_AGENT_COMPONENTS = {
    mentalStates,
    trees,
    conditions,
    combos: [],
};

export const STARTER_AGENT: Agent = buildAgent(
    mentalStates,
    [],
    trees,
    //@ts-ignore
    //Copying from console.log removes enums which build will complain about
    conditions,
    0,
    0
);

export const PRESET_CONDITIONS: Condition[] = conditions as Condition[];
