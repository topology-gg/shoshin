import { Adam } from './Adam';
import { AntocAttack } from './Antoc-Attack';
import { Eve } from './Eve';
import { JessicaAttack } from './Jessica-Attack';
import { Kat } from './Kat';
import { SimpleJoe } from './SimpleJoe';
import { opponent0Antoc, opponent0Jessica } from './opponent-0';

export const JessicaOpponents = [
    { agent: opponent0Antoc, mindName: 'Idle' },
    { agent: AntocAttack, mindName: 'Antoc Attack!' },
    { agent: JessicaAttack, mindName: 'Jessica Attack!' },
    { agent: SimpleJoe, mindName: 'Simple Joe' },
    { agent: Kat, mindName: 'Kat' },
    { agent: Adam, mindName: 'Adam' },
    { agent: Eve, mindName: 'Eve' },
];
export const AntocOpponents = [
    { agent: opponent0Jessica, mindName: 'Idle' },
    { agent: JessicaAttack, mindName: 'Jessica Attack!' },
    { agent: AntocAttack, mindName: 'Antoc Attack!' },
    { agent: Kat, mindName: 'Kat' },
    { agent: SimpleJoe, mindName: 'Simple Joe' },
    { agent: Eve, mindName: 'Eve' },
    { agent: Adam, mindName: 'Adam' },
];
