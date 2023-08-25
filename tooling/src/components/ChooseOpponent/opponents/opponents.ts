import { Adam, onlineOpponentAdam } from './Adam';
import { Eve, onlineOpponentEve } from './Eve';
import { HealthyDose, onlineOpponentHealthyDose } from './HealthyDose';
import { Shinigami, onlineOpponentShinigami } from './Shinigami';
import { Wana, onlineOpponentShock } from './Shock';
import { SimpleJoe, onlineOpponentSimpleJoe } from './SimpleJoe';
import { Tempete, onlineOpponentTempete } from './Tempete';
import { Wrath, onlineOpponentWrath } from './Wrath';
import { Yui, onlineOpponentYui } from './Yui';
import {
    onlineOpponentIdleAntoc,
    onlineOpponentIdleJessica,
    opponent0Antoc,
    opponent0Jessica,
} from './opponent-0';

export const JessicaOpponents = [
    { agent: opponent0Antoc, mindName: 'Idle', backgroundId: 1 },
    { agent: Shinigami, mindName: 'Shinigami', backgroundId: 2 },
    { agent: SimpleJoe, mindName: 'Simple Joe', backgroundId: 2 },
    { agent: Adam, mindName: 'Adam', backgroundId: 5 },
    { agent: Eve, mindName: 'Eve', backgroundId: 3 },
    { agent: HealthyDose, mindName: 'Healthy Dose', backgroundId: 1 },
    { agent: Tempete, mindName: 'Tempete', backgroundId: 2 },
    { agent: Wana, mindName: 'Shock', backgroundId: 3 },
    { agent: Yui, mindName: 'Yui', backgroundId: 4 },
    { agent: Wrath, mindName: 'Wrath', backgroundId: 5 },
];

export const JessicaOnlineOpponents = [
    { agent: onlineOpponentIdleAntoc.agent, mindName: 'Idle', backgroundId: 1 },
    {
        agent: onlineOpponentShinigami.agent,
        mindName: 'Shinigami',
        backgroundId: 2,
    },
    {
        agent: onlineOpponentSimpleJoe.agent,
        mindName: 'Simple Joe',
        backgroundId: 2,
    },
    { agent: onlineOpponentAdam.agent, mindName: 'Adam', backgroundId: 5 },
    { agent: onlineOpponentEve.agent, mindName: 'Eve', backgroundId: 3 },
    {
        agent: onlineOpponentHealthyDose.agent,
        mindName: 'Healthy Dose',
        backgroundId: 1,
    },
    {
        agent: onlineOpponentTempete.agent,
        mindName: 'Tempete',
        backgroundId: 2,
    },
    { agent: onlineOpponentAdam.agent, mindName: 'Shock', backgroundId: 3 },
    { agent: onlineOpponentYui.agent, mindName: 'Yui', backgroundId: 4 },
    { agent: onlineOpponentWrath.agent, mindName: 'Wrath', backgroundId: 5 },
];

export const AntocOpponents = [
    { agent: opponent0Jessica, mindName: 'Idle', backgroundId: 1 },
    { agent: SimpleJoe, mindName: 'Simple Joe', backgroundId: 2 },
    { agent: Shinigami, mindName: 'Shinigami', backgroundId: 2 },
    { agent: Eve, mindName: 'Eve', backgroundId: 3 },
    { agent: Adam, mindName: 'Adam', backgroundId: 5 },
    { agent: HealthyDose, mindName: 'Healthy Dose', backgroundId: 1 },
    { agent: Tempete, mindName: 'Tempete', backgroundId: 2 },
    { agent: Wana, mindName: 'Shock', backgroundId: 3 },
    { agent: Yui, mindName: 'Yui', backgroundId: 4 },
    { agent: Wrath, mindName: 'Wrath', backgroundId: 5 },
];

export const AntocOnlineOpponents = [
    {
        agent: onlineOpponentIdleJessica.agent,
        mindName: 'Idle',
        backgroundId: 1,
    },
    {
        agent: onlineOpponentSimpleJoe.agent,
        mindName: 'Simple Joe',
        backgroundId: 2,
    },
    {
        agent: onlineOpponentShinigami.agent,
        mindName: 'Shinigami',
        backgroundId: 2,
    },
    { agent: onlineOpponentEve.agent, mindName: 'Eve', backgroundId: 3 },
    { agent: onlineOpponentAdam.agent, mindName: 'Adam', backgroundId: 5 },
    {
        agent: onlineOpponentHealthyDose,
        mindName: 'Healthy Dose',
        backgroundId: 1,
    },
    {
        agent: onlineOpponentTempete.agent,
        mindName: 'Tempete',
        backgroundId: 2,
    },
    { agent: onlineOpponentShock.agent, mindName: 'Shock', backgroundId: 3 },
    { agent: onlineOpponentYui.agent, mindName: 'Yui', backgroundId: 4 },
    { agent: onlineOpponentWrath.agent, mindName: 'Wrath', backgroundId: 5 },
];
